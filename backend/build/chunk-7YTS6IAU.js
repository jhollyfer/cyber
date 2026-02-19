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

// application/resources/questions/update/update.use-case.ts
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
var UpdateQuestionUseCase = class {
  static {
    __name(this, "UpdateQuestionUseCase");
  }
  questionRepository;
  constructor(questionRepository) {
    this.questionRepository = questionRepository;
  }
  async execute(payload) {
    try {
      const existingQuestion = await this.questionRepository.findById(payload.id);
      if (!existingQuestion) {
        return left(HTTPException.NotFound("Question not found", "QUESTION_NOT_FOUND"));
      }
      const question = await this.questionRepository.update(payload);
      return right(question);
    } catch (error) {
      console.error(error);
      return left(HTTPException.InternalServerError("Internal server error", "UPDATE_QUESTION_ERROR"));
    }
  }
};
UpdateQuestionUseCase = _ts_decorate([
  Service(),
  _ts_metadata("design:type", Function),
  _ts_metadata("design:paramtypes", [
    typeof QuestionContractRepository === "undefined" ? Object : QuestionContractRepository
  ])
], UpdateQuestionUseCase);

export {
  UpdateQuestionUseCase
};
