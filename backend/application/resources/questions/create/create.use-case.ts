import { left, right, type Either } from '@application/core/either';
import type { IQuestion } from '@application/core/entities';
import HTTPException from '@application/core/exception';
import { QuestionContractRepository } from '@application/repositories/question-repository/question-contract.repository';
import { Service } from 'fastify-decorators';
import type z from 'zod';

import type { CreateQuestionBodySchema } from './create.schema';

type Payload = z.infer<typeof CreateQuestionBodySchema> & { module_id: string };
type Response = Either<HTTPException, IQuestion>;

@Service()
export default class CreateQuestionUseCase {
  constructor(
    private readonly questionRepository: QuestionContractRepository,
  ) {}

  async execute(payload: Payload): Promise<Response> {
    try {
      const question = await this.questionRepository.create({
        question: payload.question,
        options: payload.options,
        correct: payload.correct,
        explanation: payload.explanation,
        category: payload.category,
        context: payload.context ?? null,
        order: payload.order,
        active: true,
        module_id: payload.module_id,
      });

      return right(question);
    } catch (error) {
      console.error(error);
      return left(
        HTTPException.InternalServerError(
          'Internal server error',
          'CREATE_QUESTION_ERROR',
        ),
      );
    }
  }
}
