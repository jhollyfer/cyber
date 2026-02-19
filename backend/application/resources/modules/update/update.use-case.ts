import { left, right, type Either } from '@application/core/either';
import type { IModule } from '@application/core/entities';
import HTTPException from '@application/core/exception';
import { ModuleContractRepository } from '@application/repositories/module-repository/module-contract.repository';
import { Service } from 'fastify-decorators';
import type z from 'zod';

import type { UpdateModuleBodySchema } from './update.schema';

type Payload = z.infer<typeof UpdateModuleBodySchema> & { id: string };
type Response = Either<HTTPException, IModule>;

@Service()
export default class UpdateModuleUseCase {
  constructor(
    private readonly moduleRepository: ModuleContractRepository,
  ) {}

  async execute(payload: Payload): Promise<Response> {
    try {
      const existingModule = await this.moduleRepository.findById(payload.id);

      if (!existingModule) {
        return left(
          HTTPException.NotFound(
            'Module not found',
            'MODULE_NOT_FOUND',
          ),
        );
      }

      const module = await this.moduleRepository.update(payload);

      return right(module);
    } catch (error) {
      console.error(error);
      return left(
        HTTPException.InternalServerError(
          'Internal server error',
          'UPDATE_MODULE_ERROR',
        ),
      );
    }
  }
}
