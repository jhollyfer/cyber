import crypto from 'node:crypto';

import type { IModule } from '@application/core/entities';

import {
  ModuleContractRepository,
  type ModuleCreatePayload,
  type ModuleUpdatePayload,
} from './module-contract.repository';

export default class ModuleMemoryRepository extends ModuleContractRepository {
  private modules: IModule[] = [];

  reset(): void {
    this.modules = [];
  }

  async create(payload: ModuleCreatePayload): Promise<IModule> {
    const now = new Date();
    const module: IModule = {
      id: crypto.randomUUID(),
      created_at: now,
      updated_at: now,
      deleted_at: null,
      ...payload,
    };
    this.modules.push(module);
    return module;
  }

  async update({ id, ...payload }: ModuleUpdatePayload): Promise<IModule> {
    const index = this.modules.findIndex((m) => m.id === id);
    if (index === -1) throw new Error(`Module with id "${id}" not found`);

    const updated: IModule = {
      ...this.modules[index],
      ...payload,
      updated_at: new Date(),
    };
    this.modules[index] = updated;
    return updated;
  }

  async findById(id: string): Promise<IModule | null> {
    return this.modules.find((m) => m.id === id && !m.deleted_at) ?? null;
  }

  async findAll(activeOnly = true): Promise<IModule[]> {
    return this.modules
      .filter((m) => !m.deleted_at && (activeOnly ? m.active : true))
      .sort((a, b) => a.order - b.order);
  }

  async delete(id: string): Promise<IModule> {
    const index = this.modules.findIndex((m) => m.id === id);
    if (index === -1) throw new Error(`Module with id "${id}" not found`);

    const updated: IModule = {
      ...this.modules[index],
      deleted_at: new Date(),
      updated_at: new Date(),
    };
    this.modules[index] = updated;
    return updated;
  }
}
