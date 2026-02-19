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

// application/resources/game/start-session/start-session.use-case.ts
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
function shuffleArray(array) {
  const shuffled = [
    ...array
  ];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [
      shuffled[j],
      shuffled[i]
    ];
  }
  return shuffled;
}
__name(shuffleArray, "shuffleArray");
var StartSessionUseCase = class {
  static {
    __name(this, "StartSessionUseCase");
  }
  gameSessionRepository;
  moduleRepository;
  questionRepository;
  constructor(gameSessionRepository, moduleRepository, questionRepository) {
    this.gameSessionRepository = gameSessionRepository;
    this.moduleRepository = moduleRepository;
    this.questionRepository = questionRepository;
  }
  async execute(payload) {
    try {
      const module = await this.moduleRepository.findById(payload.module_id);
      if (!module) {
        return left(HTTPException.NotFound("Module not found", "MODULE_NOT_FOUND"));
      }
      if (!module.active) {
        return left(HTTPException.BadRequest("Module is not active", "MODULE_NOT_ACTIVE"));
      }
      if (module.order > 1) {
        const allModules = await this.moduleRepository.findAll(true);
        const previousModule = allModules.find((m) => m.order === module.order - 1);
        if (previousModule) {
          const previousSessions = await this.gameSessionRepository.findByUserAndModule(payload.user_id, previousModule.id);
          const hasPreviousFinished = previousSessions.some((s) => s.finished);
          if (!hasPreviousFinished) {
            return left(HTTPException.BadRequest(`Voce precisa completar a fase ${module.order - 1} antes de jogar esta fase.`, "PREVIOUS_MODULE_NOT_COMPLETED"));
          }
        }
      }
      const session = await this.gameSessionRepository.create({
        user_id: payload.user_id,
        module_id: payload.module_id
      });
      const questions = await this.questionRepository.findByModuleId(payload.module_id, true);
      const shuffledQuestions = shuffleArray(questions);
      const safeQuestions = shuffledQuestions.map(({ correct, explanation, ...rest }) => rest);
      return right({
        session,
        questions: safeQuestions
      });
    } catch (error) {
      console.error(error);
      return left(HTTPException.InternalServerError("Internal server error", "START_SESSION_ERROR"));
    }
  }
};
StartSessionUseCase = _ts_decorate([
  Service(),
  _ts_metadata("design:type", Function),
  _ts_metadata("design:paramtypes", [
    typeof GameSessionContractRepository === "undefined" ? Object : GameSessionContractRepository,
    typeof ModuleContractRepository === "undefined" ? Object : ModuleContractRepository,
    typeof QuestionContractRepository === "undefined" ? Object : QuestionContractRepository
  ])
], StartSessionUseCase);

export {
  StartSessionUseCase
};
