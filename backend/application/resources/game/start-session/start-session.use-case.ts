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
  { session: IGameSession; questions: SafeQuestion[]; resumed: boolean }
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

      const questions = await this.questionRepository.findByModuleId(
        payload.module_id,
        true,
      );

      // Try to resume an unfinished session
      const unfinished = await this.gameSessionRepository.findUnfinishedByUserAndModule(
        payload.user_id,
        payload.module_id,
      );

      if (unfinished) {
        const answeredIds = new Set(unfinished.answers.map((a) => a.question_id));
        const remaining = questions.filter((q) => !answeredIds.has(q.id));

        if (remaining.length > 0) {
          const shuffledRemaining = shuffleArray(remaining);
          const safeQuestions: SafeQuestion[] = shuffledRemaining.map(
            ({ correct, explanation, ...rest }) => rest,
          );
          const { answers: _, ...sessionWithoutAnswers } = unfinished;
          return right({ session: sessionWithoutAnswers, questions: safeQuestions, resumed: true });
        }

        // All questions answered — auto-finalize the old session
        const totalQuestions = questions.length;
        const nota =
          totalQuestions > 0
            ? Math.round((unfinished.correct_answers / totalQuestions) * 10 * 1000) / 1000
            : 0;
        await this.gameSessionRepository.update({
          id: unfinished.id,
          finished: true,
          nota,
          finished_at: new Date(),
        });
      }

      // Create a new session
      const session = await this.gameSessionRepository.create({
        user_id: payload.user_id,
        module_id: payload.module_id,
      });

      const shuffledQuestions = shuffleArray(questions);

      const safeQuestions: SafeQuestion[] = shuffledQuestions.map(
        ({ correct, explanation, ...rest }) => rest,
      );

      return right({ session, questions: safeQuestions, resumed: false });
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
