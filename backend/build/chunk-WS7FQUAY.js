import {
  prisma
} from "./chunk-BIL5BFMH.js";
import {
  __name
} from "./chunk-SHUYVCID.js";

// application/repositories/game-session-repository/game-session-prisma.repository.ts
import { Service } from "fastify-decorators";
function _ts_decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
__name(_ts_decorate, "_ts_decorate");
function mapSession(session) {
  return {
    ...session,
    nota: session.nota ? Number(session.nota) : null
  };
}
__name(mapSession, "mapSession");
var GameSessionPrismaRepository = class {
  static {
    __name(this, "GameSessionPrismaRepository");
  }
  async create(payload) {
    const created = await prisma.gameSession.create({
      data: payload
    });
    return mapSession(created);
  }
  async update({ id, ...payload }) {
    const updated = await prisma.gameSession.update({
      data: payload,
      where: {
        id
      }
    });
    return mapSession(updated);
  }
  async findById(id) {
    const session = await prisma.gameSession.findUnique({
      where: {
        id
      },
      include: {
        module: true
      }
    });
    if (!session) return null;
    return mapSession(session);
  }
  async findByIdWithAnswers(id) {
    const session = await prisma.gameSession.findUnique({
      where: {
        id
      },
      include: {
        answers: {
          select: {
            question_id: true
          }
        }
      }
    });
    if (!session) return null;
    return {
      ...mapSession(session),
      answers: session.answers
    };
  }
  async findBestByUserAndModule(userId, moduleId) {
    const session = await prisma.gameSession.findFirst({
      where: {
        user_id: userId,
        module_id: moduleId,
        is_best: true,
        finished: true
      }
    });
    if (!session) return null;
    return mapSession(session);
  }
  async findByUserAndModule(userId, moduleId) {
    const sessions = await prisma.gameSession.findMany({
      where: {
        user_id: userId,
        module_id: moduleId,
        finished: true
      },
      orderBy: {
        created_at: "desc"
      }
    });
    return sessions.map((s) => mapSession(s));
  }
  async clearBestFlag(userId, moduleId) {
    await prisma.gameSession.updateMany({
      where: {
        user_id: userId,
        module_id: moduleId,
        is_best: true
      },
      data: {
        is_best: false
      }
    });
  }
  async findBestSessionsByUser(userId) {
    const sessions = await prisma.gameSession.findMany({
      where: {
        user_id: userId,
        is_best: true,
        finished: true
      },
      include: {
        module: true
      }
    });
    return sessions.map((s) => mapSession(s));
  }
};
GameSessionPrismaRepository = _ts_decorate([
  Service()
], GameSessionPrismaRepository);

export {
  GameSessionPrismaRepository
};
