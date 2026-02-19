import {
  RankingContractRepository
} from "../../../chunk-D7B2BST3.js";
import {
  __name
} from "../../../chunk-SHUYVCID.js";

// application/repositories/ranking-repository/ranking-memory.repository.ts
var RankingMemoryRepository = class extends RankingContractRepository {
  static {
    __name(this, "RankingMemoryRepository");
  }
  students = [];
  reset() {
    this.students = [];
  }
  setStudents(students) {
    this.students = students;
  }
  async findStudentsWithBestSessions() {
    return this.students;
  }
};
export {
  RankingMemoryRepository as default
};
