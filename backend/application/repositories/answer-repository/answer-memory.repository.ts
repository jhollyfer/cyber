import crypto from 'node:crypto';

import type { IAnswer } from '@application/core/entities';

import {
  AnswerContractRepository,
  type AnswerCreatePayload,
} from './answer-contract.repository';

export default class AnswerMemoryRepository extends AnswerContractRepository {
  public answers: IAnswer[] = [];

  reset(): void {
    this.answers = [];
  }

  async create(payload: AnswerCreatePayload): Promise<IAnswer> {
    const answer: IAnswer = {
      id: crypto.randomUUID(),
      created_at: new Date(),
      ...payload,
    };
    this.answers.push(answer);
    return answer;
  }

  async findBySessionId(sessionId: string): Promise<IAnswer[]> {
    return this.answers.filter((a) => a.session_id === sessionId);
  }
}
