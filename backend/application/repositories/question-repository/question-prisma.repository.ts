import type { IQuestion } from '@application/core/entities';
import { prisma } from '@config/database';
import { Service } from 'fastify-decorators';

import {
  QuestionContractRepository,
  type QuestionCreatePayload,
  type QuestionUpdatePayload,
} from './question-contract.repository';

function parseOptions(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw as string[];
  if (typeof raw === 'string') return JSON.parse(raw);
  return [];
}

@Service()
export default class QuestionPrismaRepository extends QuestionContractRepository {
  async create(payload: QuestionCreatePayload): Promise<IQuestion> {
    const created = await prisma.question.create({ data: payload });
    return { ...created, options: parseOptions(created.options) };
  }

  async update({ id, ...payload }: QuestionUpdatePayload): Promise<IQuestion> {
    const updated = await prisma.question.update({ data: payload, where: { id } });
    return { ...updated, options: parseOptions(updated.options) };
  }

  async findById(id: string): Promise<IQuestion | null> {
    const question = await prisma.question.findFirst({ where: { id, deleted_at: null } });
    if (!question) return null;
    return { ...question, options: parseOptions(question.options) };
  }

  async findByModuleId(moduleId: string, activeOnly = true): Promise<IQuestion[]> {
    const questions = await prisma.question.findMany({
      where: { module_id: moduleId, deleted_at: null, ...(activeOnly ? { active: true } : {}) },
      orderBy: { order: 'asc' },
    });
    return questions.map((q) => ({ ...q, options: parseOptions(q.options) }));
  }

  async delete(id: string): Promise<IQuestion> {
    const deleted = await prisma.question.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
    return { ...deleted, options: parseOptions(deleted.options) };
  }
}
