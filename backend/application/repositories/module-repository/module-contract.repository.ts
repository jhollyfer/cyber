import type { IModule } from '@application/core/entities';

export type ModuleCreatePayload = Omit<IModule, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;

export type ModuleUpdatePayload = Partial<Omit<IModule, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>> & {
  id: string;
};

export abstract class ModuleContractRepository {
  abstract create(payload: ModuleCreatePayload): Promise<IModule>;
  abstract update(payload: ModuleUpdatePayload): Promise<IModule>;
  abstract findById(id: string): Promise<IModule | null>;
  abstract findAll(activeOnly?: boolean): Promise<IModule[]>;
  abstract delete(id: string): Promise<IModule>;
}
