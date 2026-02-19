import {
  QuestionContractRepository
} from "../../../chunk-WTYPRCME.js";
import {
  __name
} from "../../../chunk-SHUYVCID.js";

// application/repositories/question-repository/question-memory.repository.ts
import crypto from "crypto";
var QuestionMemoryRepository = class extends QuestionContractRepository {
  static {
    __name(this, "QuestionMemoryRepository");
  }
  questions = [];
  reset() {
    this.questions = [];
  }
  async create(payload) {
    const now = /* @__PURE__ */ new Date();
    const question = {
      id: crypto.randomUUID(),
      created_at: now,
      updated_at: now,
      deleted_at: null,
      ...payload
    };
    this.questions.push(question);
    return question;
  }
  async update({ id, ...payload }) {
    const index = this.questions.findIndex((q) => q.id === id);
    if (index === -1) throw new Error(`Question with id "${id}" not found`);
    const updated = {
      ...this.questions[index],
      ...payload,
      updated_at: /* @__PURE__ */ new Date()
    };
    this.questions[index] = updated;
    return updated;
  }
  async findById(id) {
    return this.questions.find((q) => q.id === id && !q.deleted_at) ?? null;
  }
  async findByModuleId(moduleId, activeOnly = true) {
    return this.questions.filter((q) => q.module_id === moduleId && !q.deleted_at && (activeOnly ? q.active : true)).sort((a, b) => a.order - b.order);
  }
  async delete(id) {
    const index = this.questions.findIndex((q) => q.id === id);
    if (index === -1) throw new Error(`Question with id "${id}" not found`);
    const updated = {
      ...this.questions[index],
      deleted_at: /* @__PURE__ */ new Date(),
      updated_at: /* @__PURE__ */ new Date()
    };
    this.questions[index] = updated;
    return updated;
  }
};
export {
  QuestionMemoryRepository as default
};
