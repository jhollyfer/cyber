import type { IGameSession } from '@application/core/entities';
import { prisma } from '@config/database';
import { Service } from 'fastify-decorators';

import {
  GameSessionContractRepository,
  type GameSessionCreatePayload,
  type GameSessionUpdatePayload,
} from './game-session-contract.repository';

function mapSession(session: Record<string, unknown>): IGameSession {
  return {
    ...session,
    nota: session.nota ? Number(session.nota) : null,
  } as IGameSession;
}

@Service()
export default class GameSessionPrismaRepository extends GameSessionContractRepository {
  async create(payload: GameSessionCreatePayload): Promise<IGameSession> {
    const created = await prisma.gameSession.create({ data: payload });
    return mapSession(created as unknown as Record<string, unknown>);
  }

  async update({ id, ...payload }: GameSessionUpdatePayload): Promise<IGameSession> {
    const updated = await prisma.gameSession.update({ data: payload, where: { id } });
    return mapSession(updated as unknown as Record<string, unknown>);
  }

  async findById(id: string): Promise<IGameSession | null> {
    const session = await prisma.gameSession.findUnique({
      where: { id },
      include: { module: true },
    });
    if (!session) return null;
    return mapSession(session as unknown as Record<string, unknown>);
  }

  async findByIdWithAnswers(id: string): Promise<(IGameSession & { answers: { question_id: string }[] }) | null> {
    const session = await prisma.gameSession.findUnique({
      where: { id },
      include: { answers: { select: { question_id: true } } },
    });
    if (!session) return null;
    return {
      ...mapSession(session as unknown as Record<string, unknown>),
      answers: session.answers,
    };
  }

  async findBestByUserAndModule(userId: string, moduleId: string): Promise<IGameSession | null> {
    const session = await prisma.gameSession.findFirst({
      where: { user_id: userId, module_id: moduleId, is_best: true, finished: true },
    });
    if (!session) return null;
    return mapSession(session as unknown as Record<string, unknown>);
  }

  async findByUserAndModule(userId: string, moduleId: string): Promise<IGameSession[]> {
    const sessions = await prisma.gameSession.findMany({
      where: { user_id: userId, module_id: moduleId, finished: true },
      orderBy: { created_at: 'desc' },
    });
    return sessions.map((s) => mapSession(s as unknown as Record<string, unknown>));
  }

  async clearBestFlag(userId: string, moduleId: string): Promise<void> {
    await prisma.gameSession.updateMany({
      where: { user_id: userId, module_id: moduleId, is_best: true },
      data: { is_best: false },
    });
  }

  async findBestSessionsByUser(userId: string): Promise<IGameSession[]> {
    const sessions = await prisma.gameSession.findMany({
      where: { user_id: userId, is_best: true, finished: true },
      include: { module: true },
    });
    return sessions.map((s) => mapSession(s as unknown as Record<string, unknown>));
  }
}
