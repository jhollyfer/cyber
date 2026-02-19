import {
  UserContractRepository
} from "../../../chunk-PTQ2KP5N.js";
import {
  __name
} from "../../../chunk-SHUYVCID.js";

// application/repositories/user-repository/user-memory.repository.ts
import crypto from "crypto";
var UserMemoryRepository = class extends UserContractRepository {
  static {
    __name(this, "UserMemoryRepository");
  }
  users = [];
  reset() {
    this.users = [];
  }
  async create(payload) {
    const now = /* @__PURE__ */ new Date();
    const user = {
      id: crypto.randomUUID(),
      created_at: now,
      updated_at: now,
      ...payload
    };
    this.users.push(user);
    return user;
  }
  async update({ id, ...payload }) {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error(`User with id "${id}" not found`);
    const updated = {
      ...this.users[index],
      ...payload,
      updated_at: /* @__PURE__ */ new Date()
    };
    this.users[index] = updated;
    return updated;
  }
  async findBy({ exact = false, ...payload }) {
    const predicates = [];
    if (payload.phone) predicates.push((u) => u.phone === payload.phone);
    if (payload.id) predicates.push((u) => u.id === payload.id);
    if (predicates.length === 0) throw new Error("At least one query is required");
    const match = exact ? this.users.find((u) => u.active && predicates.every((p) => p(u))) : this.users.find((u) => u.active && predicates.some((p) => p(u)));
    return match ?? null;
  }
  async findAll() {
    return this.users.filter((u) => u.role === "STUDENT" && u.active).sort((a, b) => a.name.localeCompare(b.name));
  }
  async delete(id) {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error(`User with id "${id}" not found`);
    const updated = {
      ...this.users[index],
      active: false,
      updated_at: /* @__PURE__ */ new Date()
    };
    this.users[index] = updated;
    return updated;
  }
};
export {
  UserMemoryRepository as default
};
