import {
  GetSessionDocumentationSchema
} from "../../../../chunk-HAIME6XC.js";
import {
  GetSessionUseCase
} from "../../../../chunk-5SEHPNA7.js";
import {
  IdParamSchema
} from "../../../../chunk-5VR5R7MV.js";
import {
  AuthenticationMiddleware
} from "../../../../chunk-G46T6ZWT.js";
import "../../../../chunk-L747NW6V.js";
import {
  GameSessionContractRepository
} from "../../../../chunk-QL5RK6WA.js";
import "../../../../chunk-67AJRFDF.js";
import {
  __name
} from "../../../../chunk-SHUYVCID.js";

// application/resources/game/get-session/get-session.controller.ts
import { Controller, GET, getInstanceByToken } from "fastify-decorators";
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
var _class = class {
  static {
    __name(this, "_class");
  }
  gameSessionRepository;
  getSessionUseCase;
  constructor(gameSessionRepository = getInstanceByToken(GameSessionContractRepository), getSessionUseCase = getInstanceByToken(GetSessionUseCase)) {
    this.gameSessionRepository = gameSessionRepository;
    this.getSessionUseCase = getSessionUseCase;
  }
  async handleBest(request, response) {
    const userId = request.user.sub;
    const sessions = await this.gameSessionRepository.findBestSessionsByUser(userId);
    return response.status(200).send(sessions);
  }
  async handle(request, response) {
    const { id } = IdParamSchema.parse(request.params);
    const result = await this.getSessionUseCase.execute({
      session_id: id,
      user_id: request.user.sub
    });
    if (result.isLeft()) {
      return response.status(result.value.code).send({
        message: result.value.message,
        code: result.value.code,
        cause: result.value.cause
      });
    }
    return response.status(200).send(result.value);
  }
};
_ts_decorate([
  GET({
    url: "/sessions/best",
    options: {
      onRequest: [
        AuthenticationMiddleware()
      ]
    }
  }),
  _ts_metadata("design:type", Function),
  _ts_metadata("design:paramtypes", [
    typeof FastifyRequest === "undefined" ? Object : FastifyRequest,
    typeof FastifyReply === "undefined" ? Object : FastifyReply
  ]),
  _ts_metadata("design:returntype", Promise)
], _class.prototype, "handleBest", null);
_ts_decorate([
  GET({
    url: "/sessions/:id",
    options: {
      schema: GetSessionDocumentationSchema,
      onRequest: [
        AuthenticationMiddleware()
      ]
    }
  }),
  _ts_metadata("design:type", Function),
  _ts_metadata("design:paramtypes", [
    typeof FastifyRequest === "undefined" ? Object : FastifyRequest,
    typeof FastifyReply === "undefined" ? Object : FastifyReply
  ]),
  _ts_metadata("design:returntype", Promise)
], _class.prototype, "handle", null);
_class = _ts_decorate([
  Controller({
    route: "game"
  }),
  _ts_metadata("design:type", Function),
  _ts_metadata("design:paramtypes", [
    typeof GameSessionContractRepository === "undefined" ? Object : GameSessionContractRepository,
    typeof GetSessionUseCase === "undefined" ? Object : GetSessionUseCase
  ])
], _class);
export {
  _class as default
};
