import { prisma } from '@config/database';
import { Service } from 'fastify-decorators';

import { RankingContractRepository, type RankingStudentRaw } from './ranking-contract.repository';

@Service()
export default class RankingPrismaRepository extends RankingContractRepository {
  async findStudentsWithBestSessions(): Promise<RankingStudentRaw[]> {
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT', active: true },
      select: {
        id: true,
        name: true,
        game_sessions: {
          where: { is_best: true, finished: true },
          select: {
            nota: true,
            module_id: true,
            correct_answers: true,
            total_answered: true,
            score: true,
            max_streak: true,
          },
        },
      },
    });

    return students.map((s) => ({
      ...s,
      game_sessions: s.game_sessions.map((gs) => ({
        ...gs,
        nota: gs.nota ? Number(gs.nota) : null,
      })),
    }));
  }
}
