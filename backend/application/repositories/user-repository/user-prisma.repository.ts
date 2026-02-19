import type { IUser } from '@application/core/entities';
import { prisma } from '@config/database';
import { Service } from 'fastify-decorators';

import {
  UserContractRepository,
  type UserCreatePayload,
  type UserFindByPayload,
  type UserUpdatePayload,
} from './user-contract.repository';

@Service()
export default class UserPrismaRepository extends UserContractRepository {
  async create(payload: UserCreatePayload): Promise<IUser> {
    const created = await prisma.user.create({
      data: payload,
    });
    return created;
  }

  async update({ id, ...payload }: UserUpdatePayload): Promise<IUser> {
    const updated = await prisma.user.update({
      data: payload,
      where: { id },
    });
    return updated;
  }

  async findBy({ exact = false, ...payload }: UserFindByPayload): Promise<IUser | null> {
    const queries = [];

    if (payload.phone) queries.push({ phone: payload.phone });
    if (payload.id) queries.push({ id: payload.id });

    if (queries.length === 0) throw new Error('At least one query is required');

    const where = exact ? { AND: queries } : { OR: queries };

    const user = await prisma.user.findFirst({ where });
    return user ?? null;
  }

  async findAll(): Promise<IUser[]> {
    return prisma.user.findMany({
      where: { role: 'STUDENT', active: true },
      orderBy: { name: 'asc' },
    });
  }

  async delete(id: string): Promise<IUser> {
    return prisma.user.delete({ where: { id } });
  }
}
