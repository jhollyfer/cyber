export interface RankingStudentRaw {
  id: string;
  name: string;
  game_sessions: {
    nota: number | null;
    module_id: string;
    correct_answers: number;
    total_answered: number;
    score: number;
    max_streak: number;
  }[];
}

export abstract class RankingContractRepository {
  abstract findStudentsWithBestSessions(): Promise<RankingStudentRaw[]>;
}
