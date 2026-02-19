import {
  HTTPException
} from "./chunk-L747NW6V.js";
import {
  QuestionContractRepository
} from "./chunk-WTYPRCME.js";
import {
  GameSessionContractRepository
} from "./chunk-QL5RK6WA.js";
import {
  AnswerContractRepository
} from "./chunk-NFWZCG5O.js";
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

// application/resources/game/submit-answer/submit-answer.use-case.ts
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
var SubmitAnswerUseCase = class {
  static {
    __name(this, "SubmitAnswerUseCase");
  }
  gameSessionRepository;
  moduleRepository;
  questionRepository;
  answerRepository;
  constructor(gameSessionRepository, moduleRepository, questionRepository, answerRepository) {
    this.gameSessionRepository = gameSessionRepository;
    this.moduleRepository = moduleRepository;
    this.questionRepository = questionRepository;
    this.answerRepository = answerRepository;
  }
  async execute(payload) {
    try {
      const session = await this.gameSessionRepository.findByIdWithAnswers(payload.session_id);
      if (!session) {
        return left(HTTPException.NotFound("Session not found", "SESSION_NOT_FOUND"));
      }
      if (session.user_id !== payload.user_id) {
        return left(HTTPException.Forbidden("You do not own this session", "SESSION_OWNERSHIP_ERROR"));
      }
      if (session.finished) {
        return left(HTTPException.BadRequest("Session is already finished", "SESSION_ALREADY_FINISHED"));
      }
      const question = await this.questionRepository.findById(payload.question_id);
      if (!question) {
        return left(HTTPException.NotFound("Question not found", "QUESTION_NOT_FOUND"));
      }
      if (question.module_id !== session.module_id) {
        return left(HTTPException.BadRequest("Question does not belong to this session module", "QUESTION_MODULE_MISMATCH"));
      }
      const alreadyAnswered = session.answers.some((answer) => answer.question_id === payload.question_id);
      if (alreadyAnswered) {
        return left(HTTPException.Conflict("Question already answered in this session", "ANSWER_ALREADY_EXISTS"));
      }
      const isCorrect = payload.selected_option === question.correct;
      const newStreak = isCorrect ? session.streak + 1 : 0;
      let points = 0;
      if (isCorrect) {
        points = 100 + Math.min(newStreak * 10, 50);
      }
      await this.answerRepository.create({
        selected_option: payload.selected_option,
        is_correct: isCorrect,
        points,
        time_spent: payload.time_spent ?? 0,
        session_id: payload.session_id,
        question_id: payload.question_id
      });
      const newMaxStreak = Math.max(session.max_streak, newStreak);
      const newScore = session.score + points;
      const newCorrectAnswers = session.correct_answers + (isCorrect ? 1 : 0);
      const newTotalAnswered = session.total_answered + 1;
      await this.gameSessionRepository.update({
        id: payload.session_id,
        total_answered: newTotalAnswered,
        correct_answers: newCorrectAnswers,
        streak: newStreak,
        max_streak: newMaxStreak,
        score: newScore
      });
      return right({
        is_correct: isCorrect,
        correct_option: question.correct,
        explanation: question.explanation,
        points,
        streak: newStreak,
        score: newScore
      });
    } catch (error) {
      console.error(error);
      return left(HTTPException.InternalServerError("Internal server error", "SUBMIT_ANSWER_ERROR"));
    }
  }
};
SubmitAnswerUseCase = _ts_decorate([
  Service(),
  _ts_metadata("design:type", Function),
  _ts_metadata("design:paramtypes", [
    typeof GameSessionContractRepository === "undefined" ? Object : GameSessionContractRepository,
    typeof ModuleContractRepository === "undefined" ? Object : ModuleContractRepository,
    typeof QuestionContractRepository === "undefined" ? Object : QuestionContractRepository,
    typeof AnswerContractRepository === "undefined" ? Object : AnswerContractRepository
  ])
], SubmitAnswerUseCase);

export {
  SubmitAnswerUseCase
};
