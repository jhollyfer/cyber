import {
  HTTPException
} from "./chunk-L747NW6V.js";
import {
  QuestionContractRepository
} from "./chunk-WTYPRCME.js";
import {
  left,
  right
} from "./chunk-67AJRFDF.js";
import {
  __name
} from "./chunk-SHUYVCID.js";

// application/resources/questions/find-by-module/find-by-module.use-case.ts
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
var FindByModuleUseCase = class {
  static {
    __name(this, "FindByModuleUseCase");
  }
  questionRepository;
  constructor(questionRepository) {
    this.questionRepository = questionRepository;
  }
  async execute(payload) {
    try {
      const questions = await this.questionRepository.findByModuleId(payload.moduleId);
      return right(questions);
    } catch (error) {
      console.error(error);
      return left(HTTPException.InternalServerError("Internal server error", "FIND_BY_MODULE_ERROR"));
    }
  }
};
FindByModuleUseCase = _ts_decorate([
  Service(),
  _ts_metadata("design:type", Function),
  _ts_metadata("design:paramtypes", [
    typeof QuestionContractRepository === "undefined" ? Object : QuestionContractRepository
  ])
], FindByModuleUseCase);

export {
  FindByModuleUseCase
};
