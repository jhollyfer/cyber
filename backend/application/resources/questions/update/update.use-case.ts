import { left, right, type Either } from '@application/core/either';
import type { IQuestion } from '@application/core/entities';
import HTTPException from '@application/core/exception';
import { QuestionContractRepository } from '@application/repositories/question-repository/question-contract.repository';
import { Service } from 'fastify-decorators';
import type z from 'zod';

import type { UpdateQuestionBodySchema } from './update.schema';

type Payload = z.infer<typeof UpdateQuestionBodySchema> & { id: string };
type Response = Either<HTTPException, IQuestion>;

@Service()
export default class UpdateQuestionUseCase {
  constructor(
    private readonly questionRepository: QuestionContractRepository,
  ) {}

  async execute(payload: Payload): Promise<Response> {
    try {
      const existingQuestion = await this.questionRepository.findById(payload.id);

      if (!existingQuestion) {
        return left(
          HTTPException.NotFound(
            'Question not found',
            'QUESTION_NOT_FOUND',
          ),
        );
      }

      const question = await this.questionRepository.update(payload);

      return right(question);
    } catch (error) {
      console.error(error);
      return left(
        HTTPException.InternalServerError(
          'Internal server error',
          'UPDATE_QUESTION_ERROR',
        ),
      );
    }
  }
}
