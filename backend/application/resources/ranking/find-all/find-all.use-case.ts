import { left, right, type Either } from '@application/core/either';
import HTTPException from '@application/core/exception';
import { RankingContractRepository } from '@application/repositories/ranking-repository/ranking-contract.repository';
import { Service } from 'fastify-decorators';

interface RankingEntry {
  user_id: string;
  name: string;
  average_nota: number;
  modules_completed: number;
  total_score: number;
  best_streak: number;
  module_notas: { module_id: string; nota: number }[];
}

type Response = Either<HTTPException, RankingEntry[]>;

@Service()
export default class FindAllRankingUseCase {
  constructor(private readonly rankingRepository: RankingContractRepository) {}

  async execute(): Promise<Response> {
    try {
      const students = await this.rankingRepository.findStudentsWithBestSessions();

      const ranking = students
        .map((student) => {
          const sessions = student.game_sessions;
          if (sessions.length === 0) return null;

          const totalNota = sessions.reduce(
            (sum, s) => sum + (s.nota ?? 0),
            0,
          );
          const averageNota = totalNota / sessions.length;
          const totalScore = sessions.reduce((sum, s) => sum + s.score, 0);
          const bestStreak = Math.max(...sessions.map((s) => s.max_streak));

          const moduleNotas = sessions.map((s) => ({
            module_id: s.module_id,
            nota: s.nota ? Math.round(s.nota * 1000) / 1000 : 0,
          }));

          return {
            user_id: student.id,
            name: student.name,
            average_nota: Math.round(averageNota * 1000) / 1000,
            modules_completed: sessions.length,
            total_score: totalScore,
            best_streak: bestStreak,
            module_notas: moduleNotas,
          };
        })
        .filter(Boolean)
        .sort((a, b) => b!.total_score - a!.total_score || b!.average_nota - a!.average_nota || b!.best_streak - a!.best_streak) as RankingEntry[];

      return right(ranking);
    } catch (_error) {
      return left(HTTPException.InternalServerError('Internal server error', 'FIND_ALL_RANKING_ERROR'));
    }
  }
}
