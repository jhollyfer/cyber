import {
  prisma
} from "./chunk-BIL5BFMH.js";
import {
  right
} from "./chunk-67AJRFDF.js";
import {
  __name
} from "./chunk-SHUYVCID.js";

// application/resources/stats/export-csv/export-csv.use-case.ts
import { Service } from "fastify-decorators";
function _ts_decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
__name(_ts_decorate, "_ts_decorate");
var ExportCsvUseCase = class {
  static {
    __name(this, "ExportCsvUseCase");
  }
  async execute() {
    const modules = await prisma.module.findMany({
      where: {
        active: true
      },
      orderBy: {
        order: "asc"
      }
    });
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
    const BOM = "\uFEFF";
    const moduleHeaders = modules.map((m) => `F${m.order} Nota`).join(";");
    const header = `Pos;Nome;Telefone;Nota Geral;${moduleHeaders};Pontos;Acertos;Streak;Data
`;
    const rows = students.map((student, index) => {
      const sessions = student.game_sessions;
      const totalNota = sessions.reduce((sum, s) => sum + (s.nota ? Number(s.nota) : 0), 0);
      const averageNota = sessions.length > 0 ? totalNota / sessions.length : 0;
      const totalScore = sessions.reduce((sum, s) => sum + s.score, 0);
      const totalCorrect = sessions.reduce((sum, s) => sum + s.correct_answers, 0);
      const bestStreak = sessions.length > 0 ? Math.max(...sessions.map((s) => s.max_streak)) : 0;
      const moduleNotas = modules.map((m) => {
        const session = sessions.find((s) => s.module_id === m.id);
        return session?.nota ? Number(session.nota).toFixed(3).replace(".", ",") : "-";
      });
      const latestDate = sessions.length > 0 ? sessions.filter((s) => s.finished_at).sort((a, b) => new Date(b.finished_at).getTime() - new Date(a.finished_at).getTime())[0] : null;
      const dateStr = latestDate?.finished_at ? new Date(latestDate.finished_at).toLocaleDateString("pt-BR") : "-";
      return [
        index + 1,
        student.name,
        student.phone,
        averageNota.toFixed(3).replace(".", ","),
        ...moduleNotas,
        totalScore,
        totalCorrect,
        bestStreak,
        dateStr
      ].join(";");
    });
    const csv = BOM + header + rows.join("\n");
    return right(csv);
  }
};
ExportCsvUseCase = _ts_decorate([
  Service()
], ExportCsvUseCase);

export {
  ExportCsvUseCase
};
