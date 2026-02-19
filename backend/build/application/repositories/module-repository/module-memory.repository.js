import {
  ModuleContractRepository
} from "../../../chunk-PX5JYL6Y.js";
import {
  __name
} from "../../../chunk-SHUYVCID.js";

// application/repositories/module-repository/module-memory.repository.ts
import crypto from "crypto";
var ModuleMemoryRepository = class extends ModuleContractRepository {
  static {
    __name(this, "ModuleMemoryRepository");
  }
  modules = [];
  reset() {
    this.modules = [];
  }
  async create(payload) {
    const now = /* @__PURE__ */ new Date();
    const module = {
      id: crypto.randomUUID(),
      created_at: now,
      updated_at: now,
      deleted_at: null,
      ...payload
    };
    this.modules.push(module);
    return module;
  }
  async update({ id, ...payload }) {
    const index = this.modules.findIndex((m) => m.id === id);
    if (index === -1) throw new Error(`Module with id "${id}" not found`);
    const updated = {
      ...this.modules[index],
      ...payload,
      updated_at: /* @__PURE__ */ new Date()
    };
    this.modules[index] = updated;
    return updated;
  }
  async findById(id) {
    return this.modules.find((m) => m.id === id && !m.deleted_at) ?? null;
  }
  async findAll(activeOnly = true) {
    return this.modules.filter((m) => !m.deleted_at && (activeOnly ? m.active : true)).sort((a, b) => a.order - b.order);
  }
  async delete(id) {
    const index = this.modules.findIndex((m) => m.id === id);
    if (index === -1) throw new Error(`Module with id "${id}" not found`);
    const updated = {
      ...this.modules[index],
      deleted_at: /* @__PURE__ */ new Date(),
      updated_at: /* @__PURE__ */ new Date()
    };
    this.modules[index] = updated;
    return updated;
  }
};
export {
  ModuleMemoryRepository as default
};
