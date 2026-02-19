import { left, right, type Either } from '@application/core/either';
import HTTPException from '@application/core/exception';
import { StatsContractRepository } from '@application/repositories/stats-repository/stats-contract.repository';
import { Service } from 'fastify-decorators';

type Response = Either<HTTPException, string>;

@Service()
export default class ExportCsvUseCase {
  constructor(private readonly statsRepository: StatsContractRepository) {}

  async execute(): Promise<Response> {
    try {
      const modules = await this.statsRepository.findModulesOrdered();
      const students = await this.statsRepository.findStudentsForExport();

      const BOM = '\uFEFF';
      const moduleHeaders = modules.map((m) => `F${m.order} Nota`).join(';');
      const header = `Pos;Nome;Telefone;Nota Geral;${moduleHeaders};Pontos;Acertos;Streak;Data\n`;

      const rows = students.map((student, index) => {
        const sessions = student.game_sessions;
        const totalNota = sessions.reduce((sum, s) => sum + (s.nota ?? 0), 0);
        const averageNota = sessions.length > 0 ? totalNota / sessions.length : 0;
        const totalScore = sessions.reduce((sum, s) => sum + s.score, 0);
        const totalCorrect = sessions.reduce((sum, s) => sum + s.correct_answers, 0);
        const bestStreak = sessions.length > 0 ? Math.max(...sessions.map((s) => s.max_streak)) : 0;

        const moduleNotas = modules.map((m) => {
          const session = sessions.find((s) => s.module_id === m.id);
          return session?.nota ? session.nota.toFixed(3).replace('.', ',') : '-';
        });

        const latestDate = sessions.length > 0
          ? sessions
              .filter((s) => s.finished_at)
              .sort((a, b) => new Date(b.finished_at!).getTime() - new Date(a.finished_at!).getTime())[0]
          : null;

        const dateStr = latestDate?.finished_at
          ? new Date(latestDate.finished_at).toLocaleDateString('pt-BR')
          : '-';

        return [
          index + 1,
          student.name,
          student.phone,
          averageNota.toFixed(3).replace('.', ','),
          ...moduleNotas,
          totalScore,
          totalCorrect,
          bestStreak,
          dateStr,
        ].join(';');
      });

      const csv = BOM + header + rows.join('\n');
      return right(csv);
    } catch (_error) {
      return left(HTTPException.InternalServerError('Internal server error', 'EXPORT_CSV_ERROR'));
    }
  }
}
