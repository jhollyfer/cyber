import {
  HTTPException
} from "./chunk-L747NW6V.js";
import {
  GameSessionContractRepository
} from "./chunk-QL5RK6WA.js";
import {
  left,
  right
} from "./chunk-67AJRFDF.js";
import {
  __name
} from "./chunk-SHUYVCID.js";

// application/resources/game/get-session/get-session.use-case.ts
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
var GetSessionUseCase = class {
  static {
    __name(this, "GetSessionUseCase");
  }
  gameSessionRepository;
  constructor(gameSessionRepository) {
    this.gameSessionRepository = gameSessionRepository;
  }
  async execute(payload) {
    const session = await this.gameSessionRepository.findByIdWithAnswers(payload.session_id);
    if (!session) {
      return left(HTTPException.NotFound("Session not found", "SESSION_NOT_FOUND"));
    }
    if (session.user_id !== payload.user_id) {
      return left(HTTPException.Forbidden("You do not own this session", "SESSION_OWNERSHIP_ERROR"));
    }
    return right(session);
  }
};
GetSessionUseCase = _ts_decorate([
  Service(),
  _ts_metadata("design:type", Function),
  _ts_metadata("design:paramtypes", [
    typeof GameSessionContractRepository === "undefined" ? Object : GameSessionContractRepository
  ])
], GetSessionUseCase);

export {
  GetSessionUseCase
};
