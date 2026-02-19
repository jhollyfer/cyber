import {
  prisma
} from "./chunk-BIL5BFMH.js";
import {
  __name
} from "./chunk-SHUYVCID.js";

// application/repositories/answer-repository/answer-prisma.repository.ts
import { Service } from "fastify-decorators";
function _ts_decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
__name(_ts_decorate, "_ts_decorate");
var AnswerPrismaRepository = class {
  static {
    __name(this, "AnswerPrismaRepository");
  }
  async create(payload) {
    return prisma.answer.create({
      data: payload
    });
  }
  async findBySessionId(sessionId) {
    return prisma.answer.findMany({
      where: {
        session_id: sessionId
      },
      include: {
        question: true
      }
    });
  }
};
AnswerPrismaRepository = _ts_decorate([
  Service()
], AnswerPrismaRepository);

export {
  AnswerPrismaRepository
};
