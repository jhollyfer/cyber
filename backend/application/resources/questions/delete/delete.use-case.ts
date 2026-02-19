import { left, right, type Either } from '@application/core/either';
import HTTPException from '@application/core/exception';
import { QuestionContractRepository } from '@application/repositories/question-repository/question-contract.repository';
import { Service } from 'fastify-decorators';

type Payload = { id: string };
type Response = Either<HTTPException, void>;

@Service()
export default class DeleteQuestionUseCase {
  constructor(
    private readonly questionRepository: QuestionContractRepository,
  ) {}

  async execute(payload: Payload): Promise<Response> {
    try {
      const existingQuestion = await this.questionRepository.findById(payload.id);

      if (!existingQuestion)
        return left(
          HTTPException.NotFound('Question not found', 'QUESTION_NOT_FOUND'),
        );

      await this.questionRepository.update({
        id: payload.id,
        active: false,
      });

      return right(undefined);
    } catch (error) {
      console.error(error);
      return left(
        HTTPException.InternalServerError(
          'Internal server error',
          'DELETE_QUESTION_ERROR',
        ),
      );
    }
  }
}
