import {
  HTTPException
} from "./chunk-L747NW6V.js";
import {
  ModuleContractRepository
} from "./chunk-PX5JYL6Y.js";
import {
  left,
  right
} from "./chunk-67AJRFDF.js";
import {
  __name
} from "./chunk-SHUYVCID.js";

// application/resources/modules/create/create.use-case.ts
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
var CreateModuleUseCase = class {
  static {
    __name(this, "CreateModuleUseCase");
  }
  moduleRepository;
  constructor(moduleRepository) {
    this.moduleRepository = moduleRepository;
  }
  async execute(payload) {
    try {
      const module = await this.moduleRepository.create({
        title: payload.title,
        description: payload.description,
        icon: payload.icon,
        label: payload.label,
        order: payload.order,
        time_per_question: payload.time_per_question,
        gradient: payload.gradient,
        category_color: payload.category_color,
        active: true
      });
      return right(module);
    } catch (error) {
      console.error(error);
      return left(HTTPException.InternalServerError("Internal server error", "CREATE_MODULE_ERROR"));
    }
  }
};
CreateModuleUseCase = _ts_decorate([
  Service(),
  _ts_metadata("design:type", Function),
  _ts_metadata("design:paramtypes", [
    typeof ModuleContractRepository === "undefined" ? Object : ModuleContractRepository
  ])
], CreateModuleUseCase);

export {
  CreateModuleUseCase
};
