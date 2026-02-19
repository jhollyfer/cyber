import type { IUser } from '@application/core/entities';

export type UserCreatePayload = Omit<IUser, 'id' | 'created_at' | 'updated_at'>;

export type UserUpdatePayload = Partial<Omit<IUser, 'id' | 'created_at' | 'updated_at'>> & {
  id: string;
};

export type UserFindByPayload = Partial<Pick<IUser, 'id' | 'phone'>> & {
  exact: boolean;
};

export abstract class UserContractRepository {
  abstract create(payload: UserCreatePayload): Promise<IUser>;
  abstract update(payload: UserUpdatePayload): Promise<IUser>;
  abstract findBy(payload: UserFindByPayload): Promise<IUser | null>;
  abstract findAll(): Promise<IUser[]>;
  abstract delete(id: string): Promise<IUser>;
}
