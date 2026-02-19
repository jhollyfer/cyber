import {
  RankingContractRepository
} from "./chunk-D7B2BST3.js";
import {
  prisma
} from "./chunk-DJT65WAZ.js";
import {
  __name
} from "./chunk-SHUYVCID.js";

// application/repositories/ranking-repository/ranking-prisma.repository.ts
import { Service } from "fastify-decorators";
function _ts_decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
__name(_ts_decorate, "_ts_decorate");
var RankingPrismaRepository = class extends RankingContractRepository {
  static {
    __name(this, "RankingPrismaRepository");
  }
  async findStudentsWithBestSessions() {
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
    return students.map((s) => ({
      ...s,
      game_sessions: s.game_sessions.map((gs) => ({
        ...gs,
        nota: gs.nota ? Number(gs.nota) : null
      }))
    }));
  }
};
RankingPrismaRepository = _ts_decorate([
  Service()
], RankingPrismaRepository);

export {
  RankingPrismaRepository
};
