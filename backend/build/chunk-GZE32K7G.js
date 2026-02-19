import {
  prisma
} from "./chunk-BIL5BFMH.js";
import {
  right
} from "./chunk-67AJRFDF.js";
import {
  __name
} from "./chunk-SHUYVCID.js";

// application/resources/stats/find-all-stats/find-all-stats.use-case.ts
import { Service } from "fastify-decorators";
function _ts_decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
__name(_ts_decorate, "_ts_decorate");
var FindAllStatsUseCase = class {
  static {
    __name(this, "FindAllStatsUseCase");
  }
  async execute() {
    const totalStudents = await prisma.user.count({
      where: {
        role: "STUDENT",
        active: true
      }
    });
    const finishedSessions = await prisma.gameSession.findMany({
      where: {
        finished: true
      },
      select: {
        nota: true,
        module_id: true
      }
    });
    const totalSessions = finishedSessions.length;
    const averageNota = totalSessions > 0 ? finishedSessions.reduce((sum, s) => sum + (s.nota ? Number(s.nota) : 0), 0) / totalSessions : 0;
    const approvedSessions = finishedSessions.filter((s) => s.nota && Number(s.nota) >= 6).length;
    const approvalRate = totalSessions > 0 ? approvedSessions / totalSessions * 100 : 0;
    const moduleStats = /* @__PURE__ */ new Map();
    for (const s of finishedSessions) {
      const current = moduleStats.get(s.module_id) || {
        total: 0,
        sum: 0
      };
      current.total++;
      current.sum += s.nota ? Number(s.nota) : 0;
      moduleStats.set(s.module_id, current);
    }
    let hardestModule = null;
    let lowestAvg = Infinity;
    for (const [moduleId, stats] of moduleStats) {
      const avg = stats.sum / stats.total;
      if (avg < lowestAvg) {
        lowestAvg = avg;
        hardestModule = moduleId;
      }
    }
    let hardestModuleInfo = null;
    if (hardestModule) {
      const mod = await prisma.module.findUnique({
        where: {
          id: hardestModule
        }
      });
      if (mod) {
        hardestModuleInfo = {
          id: mod.id,
          title: mod.title,
          average_nota: Math.round(lowestAvg * 1e3) / 1e3
        };
      }
    }
    return right({
      total_students: totalStudents,
      total_sessions: totalSessions,
      average_nota: Math.round(averageNota * 1e3) / 1e3,
      approval_rate: Math.round(approvalRate * 100) / 100,
      hardest_module: hardestModuleInfo
    });
  }
};
FindAllStatsUseCase = _ts_decorate([
  Service()
], FindAllStatsUseCase);

export {
  FindAllStatsUseCase
};
