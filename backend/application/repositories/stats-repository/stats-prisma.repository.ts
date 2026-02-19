import { prisma } from '@config/database';
import { Service } from 'fastify-decorators';

import {
  StatsContractRepository,
  type FinishedSessionRaw,
  type ModuleBasic,
  type StudentExportRaw,
  type StudentWithModulesRaw,
} from './stats-contract.repository';

@Service()
export default class StatsPrismaRepository extends StatsContractRepository {
  async countActiveStudents(): Promise<number> {
    return prisma.user.count({
      where: { role: 'STUDENT', active: true },
    });
  }

  async findFinishedSessions(): Promise<FinishedSessionRaw[]> {
    const sessions = await prisma.gameSession.findMany({
      where: { finished: true },
      select: { nota: true, module_id: true },
    });

    return sessions.map((s) => ({
      nota: s.nota ? Number(s.nota) : null,
      module_id: s.module_id,
    }));
  }

  async findModuleById(id: string): Promise<ModuleBasic | null> {
    const mod = await prisma.module.findUnique({
      where: { id },
      select: { id: true, title: true, order: true },
    });
    return mod ?? null;
  }

  async findStudentsWithModuleDetails(): Promise<StudentWithModulesRaw[]> {
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT', active: true },
      select: {
        id: true,
        name: true,
        phone: true,
        created_at: true,
        game_sessions: {
          where: { finished: true, is_best: true },
          select: {
            nota: true,
            score: true,
            module_id: true,
            module: { select: { title: true } },
            correct_answers: true,
            total_answered: true,
            finished_at: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return students.map((student) => ({
      ...student,
      game_sessions: student.game_sessions.map((s) => ({
        nota: s.nota ? Number(s.nota) : null,
        score: s.score,
        module_id: s.module_id,
        module_title: s.module.title,
        correct_answers: s.correct_answers,
        total_answered: s.total_answered,
        finished_at: s.finished_at,
      })),
    }));
  }

  async findModulesOrdered(): Promise<ModuleBasic[]> {
    return prisma.module.findMany({
      where: { active: true, deleted_at: null },
      select: { id: true, title: true, order: true },
      orderBy: { order: 'asc' },
    });
  }

  async findStudentsForExport(): Promise<StudentExportRaw[]> {
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT', active: true },
      select: {
        id: true,
        name: true,
        phone: true,
        created_at: true,
        game_sessions: {
          where: { finished: true, is_best: true },
          select: {
            nota: true,
            score: true,
            module_id: true,
            correct_answers: true,
            total_answered: true,
            max_streak: true,
            finished_at: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return students.map((student) => ({
      ...student,
      game_sessions: student.game_sessions.map((s) => ({
        ...s,
        nota: s.nota ? Number(s.nota) : null,
      })),
    }));
  }

  async resetGameData(): Promise<void> {
    await prisma.answer.deleteMany();
    await prisma.gameSession.deleteMany();
  }
}
