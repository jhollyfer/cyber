/* eslint-disable no-unused-vars */
import { left, right, type Either } from '@application/core/either';
import type { IGameSession } from '@application/core/entities';
import HTTPException from '@application/core/exception';
import { GameSessionContractRepository } from '@application/repositories/game-session-repository/game-session-contract.repository';
import { ModuleContractRepository } from '@application/repositories/module-repository/module-contract.repository';
import { QuestionContractRepository } from '@application/repositories/question-repository/question-contract.repository';
import { Service } from 'fastify-decorators';

interface Payload {
  session_id: string;
  user_id: string;
}

type Response = Either<HTTPException, IGameSession>;

@Service()
export default class FinishSessionUseCase {
  constructor(
    private readonly gameSessionRepository: GameSessionContractRepository,
    private readonly questionRepository: QuestionContractRepository,
    private readonly moduleRepository: ModuleContractRepository,
  ) {}

  async execute(payload: Payload): Promise<Response> {
    try {
      const session = await this.gameSessionRepository.findById(
        payload.session_id,
      );

      if (!session) {
        return left(
          HTTPException.NotFound('Session not found', 'SESSION_NOT_FOUND'),
        );
      }

      if (session.user_id !== payload.user_id) {
        return left(
          HTTPException.Forbidden(
            'You do not own this session',
            'SESSION_OWNERSHIP_ERROR',
          ),
        );
      }

      if (session.finished) {
        return left(
          HTTPException.BadRequest(
            'Session is already finished',
            'SESSION_ALREADY_FINISHED',
          ),
        );
      }

      const questions = await this.questionRepository.findByModuleId(
        session.module_id,
        true,
      );

      const totalQuestions = questions.length;

      const nota =
        totalQuestions > 0
          ? Math.round((session.correct_answers / totalQuestions) * 10 * 1000) /
            1000
          : 0;

      const currentBest =
        await this.gameSessionRepository.findBestByUserAndModule(
          payload.user_id,
          session.module_id,
        );

      // Primeiro resultado é o que vale pro ranking — não sobrescrever
      const isBest = !currentBest;

      const updatedSession = await this.gameSessionRepository.update({
        id: payload.session_id,
        finished: true,
        nota,
        finished_at: new Date(),
        is_best: isBest,
      });

      // Check if this is the last module — calculate overall grade (RN14)
      try {
        const allModules = await this.moduleRepository.findAll(true);
        const currentModule = allModules.find(
          (m) => m.id === session.module_id,
        );
        const maxOrder = Math.max(...allModules.map((m) => m.order));

        if (currentModule && currentModule.order === maxOrder) {
          // Fetch best sessions for all modules to compute overall grade
          const bestSessions =
            await this.gameSessionRepository.findBestSessionsByUser(
              payload.user_id,
            );
          const totalCorrect = bestSessions.reduce(
            (sum, s) => sum + s.correct_answers,
            0,
          );
          const totalQuestionCount = allModules.length * 10; // 10 questions per module
          const overallNota =
            Math.round((totalCorrect / totalQuestionCount) * 10 * 1000) / 1000;

          // Store overall nota as metadata on the response
          return right({
            ...updatedSession,
            overall_nota: overallNota,
          } as IGameSession);
        }
      } catch {
        // Non-critical — just return the session without overall grade
      }

      return right(updatedSession);
    } catch (error) {
      console.error(error);
      return left(
        HTTPException.InternalServerError(
          'Internal server error',
          'FINISH_SESSION_ERROR',
        ),
      );
    }
  }
}
