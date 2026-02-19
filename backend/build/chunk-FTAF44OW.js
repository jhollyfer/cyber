import {
  prisma
} from "./chunk-BIL5BFMH.js";
import {
  __name
} from "./chunk-SHUYVCID.js";

// application/repositories/question-repository/question-prisma.repository.ts
import { Service } from "fastify-decorators";
function _ts_decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
__name(_ts_decorate, "_ts_decorate");
var QuestionPrismaRepository = class {
  static {
    __name(this, "QuestionPrismaRepository");
  }
  async create(payload) {
    const created = await prisma.question.create({
      data: payload
    });
    return {
      ...created,
      options: created.options
    };
  }
  async update({ id, ...payload }) {
    const updated = await prisma.question.update({
      data: payload,
      where: {
        id
      }
    });
    return {
      ...updated,
      options: updated.options
    };
  }
  async findById(id) {
    const question = await prisma.question.findUnique({
      where: {
        id
      }
    });
    if (!question) return null;
    return {
      ...question,
      options: question.options
    };
  }
  async findByModuleId(moduleId, activeOnly = true) {
    const questions = await prisma.question.findMany({
      where: {
        module_id: moduleId,
        ...activeOnly ? {
          active: true
        } : {}
      },
      orderBy: {
        order: "asc"
      }
    });
    return questions.map((q) => ({
      ...q,
      options: q.options
    }));
  }
  async delete(id) {
    const deleted = await prisma.question.update({
      where: {
        id
      },
      data: {
        active: false
      }
    });
    return {
      ...deleted,
      options: deleted.options
    };
  }
};
QuestionPrismaRepository = _ts_decorate([
  Service()
], QuestionPrismaRepository);

export {
  QuestionPrismaRepository
};
