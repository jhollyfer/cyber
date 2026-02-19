import {
  prisma
} from "./chunk-BIL5BFMH.js";
import {
  right
} from "./chunk-67AJRFDF.js";
import {
  __name
} from "./chunk-SHUYVCID.js";

// application/resources/stats/reset/reset-game-data.use-case.ts
import { Service } from "fastify-decorators";
function _ts_decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
__name(_ts_decorate, "_ts_decorate");
var ResetGameDataUseCase = class {
  static {
    __name(this, "ResetGameDataUseCase");
  }
  async execute() {
    await prisma.answer.deleteMany();
    await prisma.gameSession.deleteMany();
    return right({
      message: "Todos os dados de jogo foram resetados com sucesso."
    });
  }
};
ResetGameDataUseCase = _ts_decorate([
  Service()
], ResetGameDataUseCase);

export {
  ResetGameDataUseCase
};
