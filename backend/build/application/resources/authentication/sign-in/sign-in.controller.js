import {
  SignInUseCase
} from "../../../../chunk-LSBYSPAP.js";
import {
  SignInDocumentationSchema
} from "../../../../chunk-M4ALRPMH.js";
import {
  SignInBodySchema
} from "../../../../chunk-V5NYOY7X.js";
import {
  createTokens
} from "../../../../chunk-3BYXAMOQ.js";
import "../../../../chunk-3VPHLQXE.js";
import {
  setCookieTokens
} from "../../../../chunk-KSLPQLL5.js";
import "../../../../chunk-L747NW6V.js";
import "../../../../chunk-PTQ2KP5N.js";
import "../../../../chunk-OQ2TB6G7.js";
import "../../../../chunk-67AJRFDF.js";
import {
  __name
} from "../../../../chunk-SHUYVCID.js";

// application/resources/authentication/sign-in/sign-in.controller.ts
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
  constructor(useCase = getInstanceByToken(SignInUseCase)) {
    this.useCase = useCase;
  }
  async handle(request, response) {
    const payload = SignInBodySchema.parse(request.body);
    const result = await this.useCase.execute(payload);
    if (result.isLeft()) {
      const error = result.value;
      return response.status(error.code).send({
        message: error.message,
        code: error.code,
        cause: error.cause
      });
    }
    const tokens = await createTokens(result.value, response);
    setCookieTokens(response, tokens);
    return response.status(200).send();
  }
};
_ts_decorate([
  POST({
    url: "/sign-in",
    options: {
      schema: SignInDocumentationSchema,
      config: {
        rateLimit: {
          max: 5,
          timeWindow: "1 minute"
        }
      }
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
    typeof SignInUseCase === "undefined" ? Object : SignInUseCase
  ])
], _class);
export {
  _class as default
};
