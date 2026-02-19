import {
  clearCookieTokens
} from "./chunk-KSLPQLL5.js";
import {
  right
} from "./chunk-67AJRFDF.js";
import {
  __name
} from "./chunk-SHUYVCID.js";

// application/resources/authentication/sign-out/sign-out.use-case.ts
import { Service } from "fastify-decorators";
function _ts_decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
__name(_ts_decorate, "_ts_decorate");
var SignOutUseCase = class {
  static {
    __name(this, "SignOutUseCase");
  }
  async execute(response) {
    clearCookieTokens(response);
    return right(void 0);
  }
};
SignOutUseCase = _ts_decorate([
  Service()
], SignOutUseCase);

export {
  SignOutUseCase
};
