import {
  hashPassword
} from "./chunk-3VPHLQXE.js";
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

// application/resources/authentication/sign-up/sign-up.use-case.ts
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
var SignUpUseCase = class {
  static {
    __name(this, "SignUpUseCase");
  }
  userRepository;
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  async execute(payload) {
    try {
      const userExists = await this.userRepository.findBy({
        phone: payload.phone,
        exact: true
      });
      if (userExists) return left(HTTPException.Conflict("User already exists", "USER_ALREADY_EXISTS"));
      const passwordHash = await hashPassword(payload.password);
      const user = await this.userRepository.create({
        name: payload.name,
        phone: payload.phone,
        password: passwordHash,
        role: "STUDENT",
        active: true
      });
      const { password: _, ...userWithoutPassword } = user;
      return right(userWithoutPassword);
    } catch (error) {
      console.error(error);
      return left(HTTPException.InternalServerError("Internal server error", "SIGN_UP_ERROR"));
    }
  }
};
SignUpUseCase = _ts_decorate([
  Service(),
  _ts_metadata("design:type", Function),
  _ts_metadata("design:paramtypes", [
    typeof UserContractRepository === "undefined" ? Object : UserContractRepository
  ])
], SignUpUseCase);

export {
  SignUpUseCase
};
