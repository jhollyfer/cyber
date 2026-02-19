import type { IGameSession } from '@application/core/entities';

export type GameSessionCreatePayload = Pick<IGameSession, 'user_id' | 'module_id'>;

export type GameSessionUpdatePayload = Partial<
  Omit<IGameSession, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'module_id'>
> & {
  id: string;
};

export abstract class GameSessionContractRepository {
  abstract create(payload: GameSessionCreatePayload): Promise<IGameSession>;
  abstract update(payload: GameSessionUpdatePayload): Promise<IGameSession>;
  abstract findById(id: string): Promise<IGameSession | null>;
  abstract findByIdWithAnswers(id: string): Promise<(IGameSession & { answers: { question_id: string }[] }) | null>;
  abstract findBestByUserAndModule(userId: string, moduleId: string): Promise<IGameSession | null>;
  abstract findByUserAndModule(userId: string, moduleId: string): Promise<IGameSession[]>;
  abstract clearBestFlag(userId: string, moduleId: string): Promise<void>;
  abstract findBestSessionsByUser(userId: string): Promise<IGameSession[]>;
}
