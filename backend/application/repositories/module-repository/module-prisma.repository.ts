import type { IModule } from '@application/core/entities';
import { prisma } from '@config/database';
import { Service } from 'fastify-decorators';

import {
  ModuleContractRepository,
  type ModuleCreatePayload,
  type ModuleUpdatePayload,
} from './module-contract.repository';

@Service()
export default class ModulePrismaRepository extends ModuleContractRepository {
  async create(payload: ModuleCreatePayload): Promise<IModule> {
    return prisma.module.create({ data: payload });
  }

  async update({ id, ...payload }: ModuleUpdatePayload): Promise<IModule> {
    return prisma.module.update({ data: payload, where: { id } });
  }

  async findById(id: string): Promise<IModule | null> {
    return prisma.module.findFirst({ where: { id, deleted_at: null } });
  }

  async findAll(activeOnly = true): Promise<IModule[]> {
    return prisma.module.findMany({
      where: activeOnly ? { active: true, deleted_at: null } : { deleted_at: null },
      orderBy: { order: 'asc' },
    });
  }

  async delete(id: string): Promise<IModule> {
    return prisma.module.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }
}
