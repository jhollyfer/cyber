import {
  SubmitAnswerDocumentationSchema
} from "../../../../chunk-ZCPBVR4C.js";
import {
  SubmitAnswerBodySchema
} from "../../../../chunk-SCL2U7VE.js";
import {
  SubmitAnswerUseCase
} from "../../../../chunk-DQ2DAAWQ.js";
import {
  IdParamSchema
} from "../../../../chunk-5VR5R7MV.js";
import {
  AuthenticationMiddleware
} from "../../../../chunk-G46T6ZWT.js";
import "../../../../chunk-L747NW6V.js";
import "../../../../chunk-WTYPRCME.js";
import "../../../../chunk-QL5RK6WA.js";
import "../../../../chunk-NFWZCG5O.js";
import "../../../../chunk-PX5JYL6Y.js";
import "../../../../chunk-67AJRFDF.js";
import {
  __name
} from "../../../../chunk-SHUYVCID.js";

// application/resources/game/submit-answer/submit-answer.controller.ts
import { Controller, getInstanceByToken, POST } from "fastify-decorators";
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
  useCase;
  constructor(useCase = getInstanceByToken(SubmitAnswerUseCase)) {
    this.useCase = useCase;
  }
  async handle(request, response) {
    const payload = SubmitAnswerBodySchema.parse(request.body);
    const { id: sessionId } = IdParamSchema.parse(request.params);
    const userId = request.user.sub;
    const result = await this.useCase.execute({
      ...payload,
      session_id: sessionId,
      user_id: userId
    });
    if (result.isLeft()) {
      const error = result.value;
      return response.status(error.code).send({
        message: error.message,
        code: error.code,
        cause: error.cause
      });
    }
    return response.status(201).send(result.value);
  }
};
_ts_decorate([
  POST({
    url: "/sessions/:id/answer",
    options: {
      schema: SubmitAnswerDocumentationSchema,
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
    typeof SubmitAnswerUseCase === "undefined" ? Object : SubmitAnswerUseCase
  ])
], _class);
export {
  _class as default
};
