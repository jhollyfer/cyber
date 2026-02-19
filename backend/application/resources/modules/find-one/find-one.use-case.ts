import { left, right, type Either } from '@application/core/either';
import type { IModule } from '@application/core/entities';
import HTTPException from '@application/core/exception';
import { ModuleContractRepository } from '@application/repositories/module-repository/module-contract.repository';
import { Service } from 'fastify-decorators';

type Payload = { id: string };
type Response = Either<HTTPException, IModule>;

@Service()
export default class FindOneModuleUseCase {
  constructor(
    private readonly moduleRepository: ModuleContractRepository,
  ) {}

  async execute(payload: Payload): Promise<Response> {
    try {
      const module = await this.moduleRepository.findById(payload.id);

      if (!module)
        return left(
          HTTPException.NotFound('Module not found', 'MODULE_NOT_FOUND'),
        );

      return right(module);
    } catch (error) {
      console.error(error);
      return left(
        HTTPException.InternalServerError(
          'Internal server error',
          'FIND_ONE_MODULE_ERROR',
        ),
      );
    }
  }
}
