import {
  StatsContractRepository
} from "./chunk-HPJBMAPB.js";
import {
  prisma
} from "./chunk-DJT65WAZ.js";
import {
  __name
} from "./chunk-SHUYVCID.js";

// application/repositories/stats-repository/stats-prisma.repository.ts
import { Service } from "fastify-decorators";
function _ts_decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
__name(_ts_decorate, "_ts_decorate");
var StatsPrismaRepository = class extends StatsContractRepository {
  static {
    __name(this, "StatsPrismaRepository");
  }
  async countActiveStudents() {
    return prisma.user.count({
      where: {
        role: "STUDENT",
        active: true
      }
    });
  }
  async findFinishedSessions() {
    const sessions = await prisma.gameSession.findMany({
      where: {
        finished: true
      },
      select: {
        nota: true,
        module_id: true
      }
    });
    return sessions.map((s) => ({
      nota: s.nota ? Number(s.nota) : null,
      module_id: s.module_id
    }));
  }
  async findModuleById(id) {
    const mod = await prisma.module.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        title: true,
        order: true
      }
    });
    return mod ?? null;
  }
  async findStudentsWithModuleDetails() {
    const students = await prisma.user.findMany({
      where: {
        role: "STUDENT",
        active: true
      },
      select: {
        id: true,
        name: true,
        phone: true,
        created_at: true,
        game_sessions: {
          where: {
            finished: true,
            is_best: true
          },
          select: {
            nota: true,
            score: true,
            module_id: true,
            module: {
              select: {
                title: true
              }
            },
            correct_answers: true,
            total_answered: true,
            finished_at: true
          }
        }
      },
      orderBy: {
        name: "asc"
      }
    });
    return students.map((student) => ({
      ...student,
      game_sessions: student.game_sessions.map((s) => ({
        nota: s.nota ? Number(s.nota) : null,
        score: s.score,
        module_id: s.module_id,
        module_title: s.module.title,
        correct_answers: s.correct_answers,
        total_answered: s.total_answered,
        finished_at: s.finished_at
      }))
    }));
  }
  async findModulesOrdered() {
    return prisma.module.findMany({
      where: {
        active: true,
        deleted_at: null
      },
      select: {
        id: true,
        title: true,
        order: true
      },
      orderBy: {
        order: "asc"
      }
    });
  }
  async findStudentsForExport() {
    const students = await prisma.user.findMany({
      where: {
        role: "STUDENT",
        active: true
      },
      select: {
        id: true,
        name: true,
        phone: true,
        created_at: true,
        game_sessions: {
          where: {
            finished: true,
            is_best: true
          },
          select: {
            nota: true,
            score: true,
            module_id: true,
            correct_answers: true,
            total_answered: true,
            max_streak: true,
            finished_at: true
          }
        }
      },
      orderBy: {
        name: "asc"
      }
    });
    return students.map((student) => ({
      ...student,
      game_sessions: student.game_sessions.map((s) => ({
        ...s,
        nota: s.nota ? Number(s.nota) : null
      }))
    }));
  }
  async resetGameData() {
    await prisma.answer.deleteMany();
    await prisma.gameSession.deleteMany();
  }
};
StatsPrismaRepository = _ts_decorate([
  Service()
], StatsPrismaRepository);

export {
  StatsPrismaRepository
};
