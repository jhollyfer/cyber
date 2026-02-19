import { RankingContractRepository, type RankingStudentRaw } from './ranking-contract.repository';

export default class RankingMemoryRepository extends RankingContractRepository {
  private students: RankingStudentRaw[] = [];

  reset(): void {
    this.students = [];
  }

  setStudents(students: RankingStudentRaw[]): void {
    this.students = students;
  }

  async findStudentsWithBestSessions(): Promise<RankingStudentRaw[]> {
    return this.students;
  }
}
