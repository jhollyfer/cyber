import {
  HTTPException
} from "./chunk-L747NW6V.js";
import {
  RankingContractRepository
} from "./chunk-D7B2BST3.js";
import {
  left,
  right
} from "./chunk-67AJRFDF.js";
import {
  __name
} from "./chunk-SHUYVCID.js";

// application/resources/ranking/find-all/find-all.use-case.ts
import { Service } from "fastify-decorators";
function _ts_decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
__name(_ts_decorate, "_ts_decorate");
function _ts_metadata(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
__name(_ts_metadata, "_ts_metadata");
var FindAllRankingUseCase = class {
  static {
    __name(this, "FindAllRankingUseCase");
  }
  rankingRepository;
  constructor(rankingRepository) {
    this.rankingRepository = rankingRepository;
  }
  async execute() {
    try {
      const students = await this.rankingRepository.findStudentsWithBestSessions();
      const ranking = students.map((student) => {
        const sessions = student.game_sessions;
        if (sessions.length === 0) return null;
        const totalNota = sessions.reduce((sum, s) => sum + (s.nota ?? 0), 0);
        const averageNota = totalNota / sessions.length;
        const totalScore = sessions.reduce((sum, s) => sum + s.score, 0);
        const bestStreak = Math.max(...sessions.map((s) => s.max_streak));
        const moduleNotas = sessions.map((s) => ({
          module_id: s.module_id,
          nota: s.nota ? Math.round(s.nota * 1e3) / 1e3 : 0
        }));
        return {
          user_id: student.id,
          name: student.name,
          average_nota: Math.round(averageNota * 1e3) / 1e3,
          modules_completed: sessions.length,
          total_score: totalScore,
          best_streak: bestStreak,
          module_notas: moduleNotas
        };
      }).filter(Boolean).sort((a, b) => b.average_nota - a.average_nota || b.total_score - a.total_score);
      return right(ranking);
    } catch (_error) {
      return left(HTTPException.InternalServerError("Internal server error", "FIND_ALL_RANKING_ERROR"));
    }
  }
};
FindAllRankingUseCase = _ts_decorate([
  Service(),
  _ts_metadata("design:type", Function),
  _ts_metadata("design:paramtypes", [
    typeof RankingContractRepository === "undefined" ? Object : RankingContractRepository
  ])
], FindAllRankingUseCase);

export {
  FindAllRankingUseCase
};
