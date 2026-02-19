import {
  FindAllStudentsDocumentationSchema
} from "../../../../chunk-Q2H4HX77.js";
import {
  FindAllStudentsUseCase
} from "../../../../chunk-C6MFCSRH.js";
import {
  AuthenticationMiddleware
} from "../../../../chunk-G46T6ZWT.js";
import {
  PermissionMiddleware
} from "../../../../chunk-I76EOX2U.js";
import "../../../../chunk-L747NW6V.js";
import "../../../../chunk-HPJBMAPB.js";
import "../../../../chunk-67AJRFDF.js";
import {
  __name
} from "../../../../chunk-SHUYVCID.js";

// application/resources/stats/find-all-students/find-all-students.controller.ts
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
  constructor(useCase = getInstanceByToken(FindAllStudentsUseCase)) {
    this.useCase = useCase;
  }
  async handle(_request, response) {
    const result = await this.useCase.execute();
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
    url: "/students",
    options: {
      schema: FindAllStudentsDocumentationSchema,
      onRequest: [
        AuthenticationMiddleware(),
        PermissionMiddleware({
          allowedRoles: [
            "ADMINISTRATOR"
          ]
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
    route: "stats"
  }),
  _ts_metadata("design:type", Function),
  _ts_metadata("design:paramtypes", [
    typeof FindAllStudentsUseCase === "undefined" ? Object : FindAllStudentsUseCase
  ])
], _class);
export {
  _class as default
};
