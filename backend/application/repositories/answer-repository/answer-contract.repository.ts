import type { IAnswer } from '@application/core/entities';

export type AnswerCreatePayload = Omit<IAnswer, 'id' | 'created_at'>;

export abstract class AnswerContractRepository {
  abstract create(payload: AnswerCreatePayload): Promise<IAnswer>;
  abstract findBySessionId(sessionId: string): Promise<IAnswer[]>;
}
