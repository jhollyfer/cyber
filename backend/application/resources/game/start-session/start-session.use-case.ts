import { left, right, type Either } from '@application/core/either';
import type { IGameSession, IQuestion } from '@application/core/entities';
import HTTPException from '@application/core/exception';
import { GameSessionContractRepository } from '@application/repositories/game-session-repository/game-session-contract.repository';
import { ModuleContractRepository } from '@application/repositories/module-repository/module-contract.repository';
import { QuestionContractRepository } from '@application/repositories/question-repository/question-contract.repository';
import { Service } from 'fastify-decorators';
import type z from 'zod';

import type { StartSessionBodySchema } from './start-session.schema';

type Payload = z.infer<typeof StartSessionBodySchema> & { user_id: string };

type SafeQuestion = Omit<IQuestion, 'correct' | 'explanation'>;

type Response = Either<
  HTTPException,
  { session: IGameSession; questions: SafeQuestion[] }
>;

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

@Service()
export default class StartSessionUseCase {
  constructor(
    private readonly gameSessionRepository: GameSessionContractRepository,
    private readonly moduleRepository: ModuleContractRepository,
    private readonly questionRepository: QuestionContractRepository,
  ) {}

  async execute(payload: Payload): Promise<Response> {
    try {
      const module = await this.moduleRepository.findById(payload.module_id);

      if (!module) {
        return left(
          HTTPException.NotFound(
            'Module not found',
            'MODULE_NOT_FOUND',
          ),
        );
      }

      if (!module.active) {
        return left(
          HTTPException.BadRequest(
            'Module is not active',
            'MODULE_NOT_ACTIVE',
          ),
        );
      }

      // Sequential progression check: module order=1 always allowed,
      // order=N requires order=N-1 to have a finished session
      if (module.order > 1) {
        const allModules = await this.moduleRepository.findAll(true);
        const previousModule = allModules.find((m) => m.order === module.order - 1);

        if (previousModule) {
          const previousSessions = await this.gameSessionRepository.findByUserAndModule(
            payload.user_id,
            previousModule.id,
          );
          const hasPreviousFinished = previousSessions.some((s) => s.finished);

          if (!hasPreviousFinished) {
            return left(
              HTTPException.BadRequest(
                `Voce precisa completar a fase ${module.order - 1} antes de jogar esta fase.`,
                'PREVIOUS_MODULE_NOT_COMPLETED',
              ),
            );
          }
        }
      }

      const session = await this.gameSessionRepository.create({
        user_id: payload.user_id,
        module_id: payload.module_id,
      });

      const questions = await this.questionRepository.findByModuleId(
        payload.module_id,
        true,
      );

      const shuffledQuestions = shuffleArray(questions);

      const safeQuestions: SafeQuestion[] = shuffledQuestions.map(
        ({ correct, explanation, ...rest }) => rest,
      );

      return right({ session, questions: safeQuestions });
    } catch (error) {
      console.error(error);
      return left(
        HTTPException.InternalServerError(
          'Internal server error',
          'START_SESSION_ERROR',
        ),
      );
    }
  }
}
