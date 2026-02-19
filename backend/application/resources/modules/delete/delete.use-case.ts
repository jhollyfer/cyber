import { left, right, type Either } from '@application/core/either';
import HTTPException from '@application/core/exception';
import { ModuleContractRepository } from '@application/repositories/module-repository/module-contract.repository';
import { Service } from 'fastify-decorators';

type Payload = { id: string };
type Response = Either<HTTPException, void>;

@Service()
export default class DeleteModuleUseCase {
  constructor(
    private readonly moduleRepository: ModuleContractRepository,
  ) {}

  async execute(payload: Payload): Promise<Response> {
    try {
      const existingModule = await this.moduleRepository.findById(payload.id);

      if (!existingModule)
        return left(
          HTTPException.NotFound('Module not found', 'MODULE_NOT_FOUND'),
        );

      await this.moduleRepository.update({
        id: payload.id,
        active: false,
      });

      return right(undefined);
    } catch (error) {
      console.error(error);
      return left(
        HTTPException.InternalServerError(
          'Internal server error',
          'DELETE_MODULE_ERROR',
        ),
      );
    }
  }
}
