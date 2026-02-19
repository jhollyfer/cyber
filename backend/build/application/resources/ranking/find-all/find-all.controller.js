import {
  FindAllRankingDocumentationSchema
} from "../../../../chunk-JKYESKFD.js";
import {
  FindAllRankingUseCase
} from "../../../../chunk-CSEY2BB4.js";
import {
  AuthenticationMiddleware
} from "../../../../chunk-G46T6ZWT.js";
import "../../../../chunk-L747NW6V.js";
import "../../../../chunk-D7B2BST3.js";
import "../../../../chunk-67AJRFDF.js";
import {
  __name
} from "../../../../chunk-SHUYVCID.js";

// application/resources/ranking/find-all/find-all.controller.ts
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
  useCase;
  constructor(useCase = getInstanceByToken(FindAllRankingUseCase)) {
    this.useCase = useCase;
  }
  async handle(_request, response) {
    try {
      const result = await this.useCase.execute();
      if (result.isLeft()) {
        const error = result.value;
        return response.status(error.code).send({
          message: error.message,
          code: error.code,
          cause: error.cause
        });
      }
      return response.status(200).send(result.value);
    } catch (error) {
      console.error(error);
      return response.status(500).send({
        message: "Internal server error",
        code: 500,
        cause: "RANKING_ERROR"
      });
    }
  }
};
_ts_decorate([
  GET({
    url: "/",
    options: {
      schema: FindAllRankingDocumentationSchema,
      onRequest: [
        AuthenticationMiddleware({
          optional: true
        })
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
    route: "ranking"
  }),
  _ts_metadata("design:type", Function),
  _ts_metadata("design:paramtypes", [
    typeof FindAllRankingUseCase === "undefined" ? Object : FindAllRankingUseCase
  ])
], _class);
export {
  _class as default
};
