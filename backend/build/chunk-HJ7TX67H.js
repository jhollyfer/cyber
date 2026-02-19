import {
  prisma
} from "./chunk-BIL5BFMH.js";
import {
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
var FindAllRankingUseCase = class {
  static {
    __name(this, "FindAllRankingUseCase");
  }
  async execute() {
    const students = await prisma.user.findMany({
      where: {
        role: "STUDENT",
        active: true
      },
      select: {
        id: true,
        name: true,
        game_sessions: {
          where: {
            is_best: true,
            finished: true
          },
          select: {
            nota: true,
            module_id: true,
            correct_answers: true,
            total_answered: true,
            score: true,
            max_streak: true
          }
        }
      }
    });
    const ranking = students.map((student) => {
      const sessions = student.game_sessions;
      if (sessions.length === 0) return null;
      const totalNota = sessions.reduce((sum, s) => sum + (s.nota ? Number(s.nota) : 0), 0);
      const averageNota = totalNota / sessions.length;
      const totalScore = sessions.reduce((sum, s) => sum + s.score, 0);
      const bestStreak = Math.max(...sessions.map((s) => s.max_streak));
      const moduleNotas = sessions.map((s) => ({
        module_id: s.module_id,
        nota: s.nota ? Math.round(Number(s.nota) * 1e3) / 1e3 : 0
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
  }
};
FindAllRankingUseCase = _ts_decorate([
  Service()
], FindAllRankingUseCase);

export {
  FindAllRankingUseCase
};
