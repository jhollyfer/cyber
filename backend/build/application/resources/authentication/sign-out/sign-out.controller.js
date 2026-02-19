import {
  SignOutDocumentationSchema
} from "../../../../chunk-Z7Z7VFY6.js";
import {
  SignOutUseCase
} from "../../../../chunk-DNJRAZIH.js";
import {
  AuthenticationMiddleware
} from "../../../../chunk-G46T6ZWT.js";
import "../../../../chunk-KSLPQLL5.js";
import "../../../../chunk-L747NW6V.js";
import "../../../../chunk-OQ2TB6G7.js";
import "../../../../chunk-67AJRFDF.js";
import {
  __name
} from "../../../../chunk-SHUYVCID.js";

// application/resources/authentication/sign-out/sign-out.controller.ts
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
  constructor(useCase = getInstanceByToken(SignOutUseCase)) {
    this.useCase = useCase;
  }
  async handle(request, response) {
    await this.useCase.execute(response);
    return response.status(200).send();
  }
};
_ts_decorate([
  POST({
    url: "/sign-out",
    options: {
      onRequest: [
        AuthenticationMiddleware({
          optional: false
        })
      ],
      schema: SignOutDocumentationSchema
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
    route: "authentication"
  }),
  _ts_metadata("design:type", Function),
  _ts_metadata("design:paramtypes", [
    typeof SignOutUseCase === "undefined" ? Object : SignOutUseCase
  ])
], _class);
export {
  _class as default
};
