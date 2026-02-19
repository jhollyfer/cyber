import { left, right, type Either } from '@application/core/either';
import HTTPException from '@application/core/exception';
import { StatsContractRepository } from '@application/repositories/stats-repository/stats-contract.repository';
import { Service } from 'fastify-decorators';

interface StatsResponse {
  total_students: number;
  total_sessions: number;
  average_nota: number;
  approval_rate: number;
  hardest_module: {
    id: string;
    title: string;
    average_nota: number;
  } | null;
}

type Response = Either<HTTPException, StatsResponse>;

@Service()
export default class FindAllStatsUseCase {
  constructor(private readonly statsRepository: StatsContractRepository) {}

  async execute(): Promise<Response> {
    try {
      const totalStudents = await this.statsRepository.countActiveStudents();

      const finishedSessions = await this.statsRepository.findFinishedSessions();

      const totalSessions = finishedSessions.length;
      const averageNota =
        totalSessions > 0
          ? finishedSessions.reduce((sum, s) => sum + (s.nota ?? 0), 0) / totalSessions
          : 0;

      const approvedSessions = finishedSessions.filter(
        (s) => s.nota && s.nota >= 6,
      ).length;
      const approvalRate = totalSessions > 0 ? (approvedSessions / totalSessions) * 100 : 0;

      const moduleStats = new Map<string, { total: number; sum: number }>();
      for (const s of finishedSessions) {
        const current = moduleStats.get(s.module_id) || { total: 0, sum: 0 };
        current.total++;
        current.sum += s.nota ?? 0;
        moduleStats.set(s.module_id, current);
      }

      let hardestModuleId: string | null = null;
      let lowestAvg = Infinity;
      for (const [moduleId, stats] of moduleStats) {
        const avg = stats.sum / stats.total;
        if (avg < lowestAvg) {
          lowestAvg = avg;
          hardestModuleId = moduleId;
        }
      }

      let hardestModuleInfo: StatsResponse['hardest_module'] = null;
      if (hardestModuleId) {
        const mod = await this.statsRepository.findModuleById(hardestModuleId);
        if (mod) {
          hardestModuleInfo = {
            id: mod.id,
            title: mod.title,
            average_nota: Math.round(lowestAvg * 1000) / 1000,
          };
        }
      }

      return right({
        total_students: totalStudents,
        total_sessions: totalSessions,
        average_nota: Math.round(averageNota * 1000) / 1000,
        approval_rate: Math.round(approvalRate * 100) / 100,
        hardest_module: hardestModuleInfo,
      });
    } catch (_error) {
      return left(HTTPException.InternalServerError('Internal server error', 'FIND_ALL_STATS_ERROR'));
    }
  }
}
