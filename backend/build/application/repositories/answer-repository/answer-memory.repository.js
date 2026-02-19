import {
  AnswerContractRepository
} from "../../../chunk-NFWZCG5O.js";
import {
  __name
} from "../../../chunk-SHUYVCID.js";

// application/repositories/answer-repository/answer-memory.repository.ts
import crypto from "crypto";
var AnswerMemoryRepository = class extends AnswerContractRepository {
  static {
    __name(this, "AnswerMemoryRepository");
  }
  answers = [];
  reset() {
    this.answers = [];
  }
  async create(payload) {
    const answer = {
      id: crypto.randomUUID(),
      created_at: /* @__PURE__ */ new Date(),
      ...payload
    };
    this.answers.push(answer);
    return answer;
  }
  async findBySessionId(sessionId) {
    return this.answers.filter((a) => a.session_id === sessionId);
  }
};
export {
  AnswerMemoryRepository as default
};
