import {
  UserContractRepository
} from "./chunk-PTQ2KP5N.js";
import {
  prisma
} from "./chunk-DJT65WAZ.js";
import {
  __name
} from "./chunk-SHUYVCID.js";

// application/repositories/user-repository/user-prisma.repository.ts
import { Service } from "fastify-decorators";
function _ts_decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
__name(_ts_decorate, "_ts_decorate");
var UserPrismaRepository = class extends UserContractRepository {
  static {
    __name(this, "UserPrismaRepository");
  }
  async create(payload) {
    const created = await prisma.user.create({
      data: payload
    });
    return created;
  }
  async update({ id, ...payload }) {
    const updated = await prisma.user.update({
      data: payload,
      where: {
        id
      }
    });
    return updated;
  }
  async findBy({ exact = false, ...payload }) {
    const queries = [];
    if (payload.phone) queries.push({
      phone: payload.phone
    });
    if (payload.id) queries.push({
      id: payload.id
    });
    if (queries.length === 0) throw new Error("At least one query is required");
    const where = exact ? {
      AND: queries
    } : {
      OR: queries
    };
    const user = await prisma.user.findFirst({
      where
    });
    return user ?? null;
  }
  async findAll() {
    return prisma.user.findMany({
      where: {
        role: "STUDENT",
        active: true
      },
      orderBy: {
        name: "asc"
      }
    });
  }
  async delete(id) {
    return prisma.user.delete({
      where: {
        id
      }
    });
  }
};
UserPrismaRepository = _ts_decorate([
  Service()
], UserPrismaRepository);

export {
  UserPrismaRepository
};
