import crypto from 'node:crypto';

import type { IUser } from '@application/core/entities';

import {
  UserContractRepository,
  type UserCreatePayload,
  type UserFindByPayload,
  type UserUpdatePayload,
} from './user-contract.repository';

export default class UserMemoryRepository extends UserContractRepository {
  private users: IUser[] = [];

  reset(): void {
    this.users = [];
  }

  async create(payload: UserCreatePayload): Promise<IUser> {
    const now = new Date();
    const user: IUser = {
      id: crypto.randomUUID(),
      created_at: now,
      updated_at: now,
      ...payload,
    };
    this.users.push(user);
    return user;
  }

  async update({ id, ...payload }: UserUpdatePayload): Promise<IUser> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error(`User with id "${id}" not found`);

    const updated: IUser = {
      ...this.users[index],
      ...payload,
      updated_at: new Date(),
    };
    this.users[index] = updated;
    return updated;
  }

  async findBy({ exact = false, ...payload }: UserFindByPayload): Promise<IUser | null> {
    const predicates: ((u: IUser) => boolean)[] = [];

    if (payload.phone) predicates.push((u) => u.phone === payload.phone);
    if (payload.id) predicates.push((u) => u.id === payload.id);

    if (predicates.length === 0) throw new Error('At least one query is required');

    const match = exact
      ? this.users.find((u) => u.active && predicates.every((p) => p(u)))
      : this.users.find((u) => u.active && predicates.some((p) => p(u)));

    return match ?? null;
  }

  async findAll(): Promise<IUser[]> {
    return this.users
      .filter((u) => u.role === 'STUDENT' && u.active)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async delete(id: string): Promise<IUser> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error(`User with id "${id}" not found`);

    const updated: IUser = {
      ...this.users[index],
      active: false,
      updated_at: new Date(),
    };
    this.users[index] = updated;
    return updated;
  }
}
