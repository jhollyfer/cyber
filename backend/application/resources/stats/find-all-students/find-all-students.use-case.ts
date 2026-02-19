import { left, right, type Either } from '@application/core/either';
import HTTPException from '@application/core/exception';
import { StatsContractRepository } from '@application/repositories/stats-repository/stats-contract.repository';
import { Service } from 'fastify-decorators';

interface StudentDetail {
  id: string;
  name: string;
  phone: string;
  created_at: Date;
  average_nota: number;
  modules_completed: number;
  modules: {
    module_id: string;
    module_title: string;
    nota: number;
    score: number;
    correct_answers: number;
    total_answered: number;
    finished_at: Date | null;
  }[];
}

type Response = Either<HTTPException, StudentDetail[]>;

@Service()
export default class FindAllStudentsUseCase {
  constructor(private readonly statsRepository: StatsContractRepository) {}

  async execute(): Promise<Response> {
    try {
      const students = await this.statsRepository.findStudentsWithModuleDetails();

      const result = students.map((student) => {
        const sessions = student.game_sessions;
        const totalNota = sessions.reduce(
          (sum, s) => sum + (s.nota ?? 0),
          0,
        );
        const averageNota = sessions.length > 0 ? totalNota / sessions.length : 0;

        return {
          id: student.id,
          name: student.name,
          phone: student.phone,
          created_at: student.created_at,
          average_nota: Math.round(averageNota * 1000) / 1000,
          modules_completed: sessions.length,
          modules: sessions.map((s) => ({
            module_id: s.module_id,
            module_title: s.module_title,
            nota: s.nota ?? 0,
            score: s.score,
            correct_answers: s.correct_answers,
            total_answered: s.total_answered,
            finished_at: s.finished_at,
          })),
        };
      });

      return right(result);
    } catch (_error) {
      return left(HTTPException.InternalServerError('Internal server error', 'FIND_ALL_STUDENTS_ERROR'));
    }
  }
}
