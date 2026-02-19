import { left, right, type Either } from '@application/core/either';
import type { IModule } from '@application/core/entities';
import HTTPException from '@application/core/exception';
import { ModuleContractRepository } from '@application/repositories/module-repository/module-contract.repository';
import { Service } from 'fastify-decorators';
import type z from 'zod';

import type { CreateModuleBodySchema } from './create.schema';

type Payload = z.infer<typeof CreateModuleBodySchema>;
type Response = Either<HTTPException, IModule>;

@Service()
export default class CreateModuleUseCase {
  constructor(
    private readonly moduleRepository: ModuleContractRepository,
  ) {}

  async execute(payload: Payload): Promise<Response> {
    try {
      const module = await this.moduleRepository.create({
        title: payload.title,
        description: payload.description,
        icon: payload.icon,
        label: payload.label,
        order: payload.order,
        time_per_question: payload.time_per_question,
        gradient: payload.gradient,
        category_color: payload.category_color,
        active: true,
      });

      return right(module);
    } catch (error) {
      console.error(error);
      return left(
        HTTPException.InternalServerError(
          'Internal server error',
          'CREATE_MODULE_ERROR',
        ),
      );
    }
  }
}
