import {
  HTTPException
} from "./chunk-L747NW6V.js";
import {
  QuestionContractRepository
} from "./chunk-WTYPRCME.js";
import {
  GameSessionContractRepository
} from "./chunk-QL5RK6WA.js";
import {
  ModuleContractRepository
} from "./chunk-PX5JYL6Y.js";
import {
  left,
  right
} from "./chunk-67AJRFDF.js";
import {
  __name
} from "./chunk-SHUYVCID.js";

// application/resources/game/finish-session/finish-session.use-case.ts
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
var FinishSessionUseCase = class {
  static {
    __name(this, "FinishSessionUseCase");
  }
  gameSessionRepository;
  questionRepository;
  moduleRepository;
  constructor(gameSessionRepository, questionRepository, moduleRepository) {
    this.gameSessionRepository = gameSessionRepository;
    this.questionRepository = questionRepository;
    this.moduleRepository = moduleRepository;
  }
  async execute(payload) {
    try {
      const session = await this.gameSessionRepository.findById(payload.session_id);
      if (!session) {
        return left(HTTPException.NotFound("Session not found", "SESSION_NOT_FOUND"));
      }
      if (session.user_id !== payload.user_id) {
        return left(HTTPException.Forbidden("You do not own this session", "SESSION_OWNERSHIP_ERROR"));
      }
      if (session.finished) {
        return left(HTTPException.BadRequest("Session is already finished", "SESSION_ALREADY_FINISHED"));
      }
      const questions = await this.questionRepository.findByModuleId(session.module_id, true);
      const totalQuestions = questions.length;
      const nota = totalQuestions > 0 ? Math.round(session.correct_answers / totalQuestions * 10 * 1e3) / 1e3 : 0;
      const currentBest = await this.gameSessionRepository.findBestByUserAndModule(payload.user_id, session.module_id);
      let isBest = false;
      if (!currentBest || nota >= (currentBest.nota ?? 0)) {
        await this.gameSessionRepository.clearBestFlag(payload.user_id, session.module_id);
        isBest = true;
      }
      const updatedSession = await this.gameSessionRepository.update({
        id: payload.session_id,
        finished: true,
        nota,
        finished_at: /* @__PURE__ */ new Date(),
        is_best: isBest
      });
      try {
        const allModules = await this.moduleRepository.findAll(true);
        const currentModule = allModules.find((m) => m.id === session.module_id);
        const maxOrder = Math.max(...allModules.map((m) => m.order));
        if (currentModule && currentModule.order === maxOrder) {
          const bestSessions = await this.gameSessionRepository.findBestSessionsByUser(payload.user_id);
          const totalCorrect = bestSessions.reduce((sum, s) => sum + s.correct_answers, 0);
          const totalQuestionCount = allModules.length * 10;
          const overallNota = Math.round(totalCorrect / totalQuestionCount * 10 * 1e3) / 1e3;
          return right({
            ...updatedSession,
            overall_nota: overallNota
          });
        }
      } catch {
      }
      return right(updatedSession);
    } catch (error) {
      console.error(error);
      return left(HTTPException.InternalServerError("Internal server error", "FINISH_SESSION_ERROR"));
    }
  }
};
FinishSessionUseCase = _ts_decorate([
  Service(),
  _ts_metadata("design:type", Function),
  _ts_metadata("design:paramtypes", [
    typeof GameSessionContractRepository === "undefined" ? Object : GameSessionContractRepository,
    typeof QuestionContractRepository === "undefined" ? Object : QuestionContractRepository,
    typeof ModuleContractRepository === "undefined" ? Object : ModuleContractRepository
  ])
], FinishSessionUseCase);

export {
  FinishSessionUseCase
};
