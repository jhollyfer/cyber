import { left, right, type Either } from '@application/core/either';
import HTTPException from '@application/core/exception';
import { AnswerContractRepository } from '@application/repositories/answer-repository/answer-contract.repository';
import { GameSessionContractRepository } from '@application/repositories/game-session-repository/game-session-contract.repository';
import { ModuleContractRepository } from '@application/repositories/module-repository/module-contract.repository';
import { QuestionContractRepository } from '@application/repositories/question-repository/question-contract.repository';
import { Service } from 'fastify-decorators';
import type z from 'zod';

import type { SubmitAnswerBodySchema } from './submit-answer.schema';

type Payload = z.infer<typeof SubmitAnswerBodySchema> & {
  session_id: string;
  user_id: string;
};

interface SubmitAnswerResponse {
  is_correct: boolean;
  correct_option: number;
  explanation: string;
  points: number;
  streak: number;
  score: number;
}

type Response = Either<HTTPException, SubmitAnswerResponse>;

@Service()
export default class SubmitAnswerUseCase {
  constructor(
    private readonly gameSessionRepository: GameSessionContractRepository,
    private readonly moduleRepository: ModuleContractRepository,
    private readonly questionRepository: QuestionContractRepository,
    private readonly answerRepository: AnswerContractRepository,
  ) {}

  async execute(payload: Payload): Promise<Response> {
    try {
      const session = await this.gameSessionRepository.findByIdWithAnswers(
        payload.session_id,
      );

      if (!session) {
        return left(
          HTTPException.NotFound(
            'Session not found',
            'SESSION_NOT_FOUND',
          ),
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

      const question = await this.questionRepository.findById(
        payload.question_id,
      );

      if (!question) {
        return left(
          HTTPException.NotFound(
            'Question not found',
            'QUESTION_NOT_FOUND',
          ),
        );
      }

      if (question.module_id !== session.module_id) {
        return left(
          HTTPException.BadRequest(
            'Question does not belong to this session module',
            'QUESTION_MODULE_MISMATCH',
          ),
        );
      }

      const alreadyAnswered = session.answers.some(
        (answer) => answer.question_id === payload.question_id,
      );

      if (alreadyAnswered) {
        return left(
          HTTPException.Conflict(
            'Question already answered in this session',
            'ANSWER_ALREADY_EXISTS',
          ),
        );
      }

      const isCorrect = payload.selected_option === question.correct;

      const newStreak = isCorrect ? session.streak + 1 : 0;
      let points = 0;
      if (isCorrect) {
        points = 100 + Math.min(newStreak * 10, 50);
      }

      await this.answerRepository.create({
        selected_option: payload.selected_option,
        is_correct: isCorrect,
        points,
        time_spent: payload.time_spent ?? 0,
        session_id: payload.session_id,
        question_id: payload.question_id,
      });

      const newMaxStreak = Math.max(session.max_streak, newStreak);
      const newScore = session.score + points;
      const newCorrectAnswers = session.correct_answers + (isCorrect ? 1 : 0);
      const newTotalAnswered = session.total_answered + 1;

      await this.gameSessionRepository.update({
        id: payload.session_id,
        total_answered: newTotalAnswered,
        correct_answers: newCorrectAnswers,
        streak: newStreak,
        max_streak: newMaxStreak,
        score: newScore,
      });

      return right({
        is_correct: isCorrect,
        correct_option: question.correct,
        explanation: question.explanation,
        points,
        streak: newStreak,
        score: newScore,
      });
    } catch (error) {
      console.error(error);
      return left(
        HTTPException.InternalServerError(
          'Internal server error',
          'SUBMIT_ANSWER_ERROR',
        ),
      );
    }
  }
}
