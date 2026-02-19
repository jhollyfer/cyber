import type { IAnswer } from '@application/core/entities';
import { prisma } from '@config/database';
import { Service } from 'fastify-decorators';

import {
  AnswerContractRepository,
  type AnswerCreatePayload,
} from './answer-contract.repository';

@Service()
export default class AnswerPrismaRepository extends AnswerContractRepository {
  async create(payload: AnswerCreatePayload): Promise<IAnswer> {
    return prisma.answer.create({ data: payload });
  }

  async findBySessionId(sessionId: string): Promise<IAnswer[]> {
    return prisma.answer.findMany({
      where: { session_id: sessionId },
      include: { question: true },
    });
  }
}
