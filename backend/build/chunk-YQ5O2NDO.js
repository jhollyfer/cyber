import {
  prisma
} from "./chunk-BIL5BFMH.js";
import {
  right
} from "./chunk-67AJRFDF.js";
import {
  __name
} from "./chunk-SHUYVCID.js";

// application/resources/stats/find-all-students/find-all-students.use-case.ts
import { Service } from "fastify-decorators";
function _ts_decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
__name(_ts_decorate, "_ts_decorate");
var FindAllStudentsUseCase = class {
  static {
    __name(this, "FindAllStudentsUseCase");
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
    const result = students.map((student) => {
      const sessions = student.game_sessions;
      const totalNota = sessions.reduce((sum, s) => sum + (s.nota ? Number(s.nota) : 0), 0);
      const averageNota = sessions.length > 0 ? totalNota / sessions.length : 0;
      return {
        id: student.id,
        name: student.name,
        phone: student.phone,
        created_at: student.created_at,
        average_nota: Math.round(averageNota * 1e3) / 1e3,
        modules_completed: sessions.length,
        modules: sessions.map((s) => ({
          module_id: s.module_id,
          module_title: s.module.title,
          nota: s.nota ? Number(s.nota) : 0,
          score: s.score,
          correct_answers: s.correct_answers,
          total_answered: s.total_answered,
          finished_at: s.finished_at
        }))
      };
    });
    return right(result);
  }
};
FindAllStudentsUseCase = _ts_decorate([
  Service()
], FindAllStudentsUseCase);

export {
  FindAllStudentsUseCase
};
