import crypto from 'node:crypto';

import type { IQuestion } from '@application/core/entities';

import {
  QuestionContractRepository,
  type QuestionCreatePayload,
  type QuestionUpdatePayload,
} from './question-contract.repository';

export default class QuestionMemoryRepository extends QuestionContractRepository {
  private questions: IQuestion[] = [];

  reset(): void {
    this.questions = [];
  }

  async create(payload: QuestionCreatePayload): Promise<IQuestion> {
    const now = new Date();
    const question: IQuestion = {
      id: crypto.randomUUID(),
      created_at: now,
      updated_at: now,
      deleted_at: null,
      ...payload,
    };
    this.questions.push(question);
    return question;
  }

  async update({ id, ...payload }: QuestionUpdatePayload): Promise<IQuestion> {
    const index = this.questions.findIndex((q) => q.id === id);
    if (index === -1) throw new Error(`Question with id "${id}" not found`);

    const updated: IQuestion = {
      ...this.questions[index],
      ...payload,
      updated_at: new Date(),
    };
    this.questions[index] = updated;
    return updated;
  }

  async findById(id: string): Promise<IQuestion | null> {
    return this.questions.find((q) => q.id === id && !q.deleted_at) ?? null;
  }

  async findByModuleId(moduleId: string, activeOnly = true): Promise<IQuestion[]> {
    return this.questions
      .filter((q) => q.module_id === moduleId && !q.deleted_at && (activeOnly ? q.active : true))
      .sort((a, b) => a.order - b.order);
  }

  async delete(id: string): Promise<IQuestion> {
    const index = this.questions.findIndex((q) => q.id === id);
    if (index === -1) throw new Error(`Question with id "${id}" not found`);

    const updated: IQuestion = {
      ...this.questions[index],
      deleted_at: new Date(),
      updated_at: new Date(),
    };
    this.questions[index] = updated;
    return updated;
  }
}
