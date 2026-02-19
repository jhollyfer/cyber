import { left, right, type Either } from '@application/core/either';
import type { IModule } from '@application/core/entities';
import HTTPException from '@application/core/exception';
import { ModuleContractRepository } from '@application/repositories/module-repository/module-contract.repository';
import { Service } from 'fastify-decorators';

type Response = Either<HTTPException, IModule[]>;

@Service()
export default class FindAllModulesUseCase {
  constructor(
    private readonly moduleRepository: ModuleContractRepository,
  ) {}

  async execute(): Promise<Response> {
    try {
      const modules = await this.moduleRepository.findAll(true);

      return right(modules);
    } catch (error) {
      console.error(error);
      return left(
        HTTPException.InternalServerError(
          'Internal server error',
          'FIND_ALL_MODULES_ERROR',
        ),
      );
    }
  }
}
