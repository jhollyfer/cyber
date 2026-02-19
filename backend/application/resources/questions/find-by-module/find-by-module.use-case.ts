import { left, right, type Either } from '@application/core/either';
import type { IQuestion } from '@application/core/entities';
import HTTPException from '@application/core/exception';
import { QuestionContractRepository } from '@application/repositories/question-repository/question-contract.repository';
import { Service } from 'fastify-decorators';

type Payload = { moduleId: string };
type Response = Either<HTTPException, IQuestion[]>;

@Service()
export default class FindByModuleUseCase {
  constructor(
    private readonly questionRepository: QuestionContractRepository,
  ) {}

  async execute(payload: Payload): Promise<Response> {
    try {
      const questions = await this.questionRepository.findByModuleId(payload.moduleId);

      return right(questions);
    } catch (error) {
      console.error(error);
      return left(
        HTTPException.InternalServerError(
          'Internal server error',
          'FIND_BY_MODULE_ERROR',
        ),
      );
    }
  }
}
