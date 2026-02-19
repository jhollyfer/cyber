import {
  HTTPException
} from "./chunk-L747NW6V.js";
import {
  UserContractRepository
} from "./chunk-PTQ2KP5N.js";
import {
  left,
  right
} from "./chunk-67AJRFDF.js";
import {
  __name
} from "./chunk-SHUYVCID.js";

// application/resources/authentication/me/me.use-case.ts
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
var MeUseCase = class {
  static {
    __name(this, "MeUseCase");
  }
  userRepository;
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  async execute(payload) {
    try {
      const user = await this.userRepository.findBy({
        id: payload.userId,
        exact: true
      });
      if (!user) return left(HTTPException.NotFound("User not found", "USER_NOT_FOUND"));
      return right({
        ...user,
        password: void 0
      });
    } catch (error) {
      console.error(error);
      return left(HTTPException.InternalServerError("Internal server error", "ME_ERROR"));
    }
  }
};
MeUseCase = _ts_decorate([
  Service(),
  _ts_metadata("design:type", Function),
  _ts_metadata("design:paramtypes", [
    typeof UserContractRepository === "undefined" ? Object : UserContractRepository
  ])
], MeUseCase);

export {
  MeUseCase
};
