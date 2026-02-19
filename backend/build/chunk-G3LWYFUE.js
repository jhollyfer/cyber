import {
  prisma
} from "./chunk-BIL5BFMH.js";
import {
  __name
} from "./chunk-SHUYVCID.js";

// application/repositories/module-repository/module-prisma.repository.ts
import { Service } from "fastify-decorators";
function _ts_decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
__name(_ts_decorate, "_ts_decorate");
var ModulePrismaRepository = class {
  static {
    __name(this, "ModulePrismaRepository");
  }
  async create(payload) {
    return prisma.module.create({
      data: payload
    });
  }
  async update({ id, ...payload }) {
    return prisma.module.update({
      data: payload,
      where: {
        id
      }
    });
  }
  async findById(id) {
    return prisma.module.findUnique({
      where: {
        id
      }
    });
  }
  async findAll(activeOnly = true) {
    return prisma.module.findMany({
      where: activeOnly ? {
        active: true
      } : {},
      orderBy: {
        order: "asc"
      }
    });
  }
  async delete(id) {
    return prisma.module.update({
      where: {
        id
      },
      data: {
        active: false
      }
    });
  }
};
ModulePrismaRepository = _ts_decorate([
  Service()
], ModulePrismaRepository);

export {
  ModulePrismaRepository
};
