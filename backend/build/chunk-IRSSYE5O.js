import {
  NodemailerEmailService
} from "./chunk-JJAQRIS5.js";
import {
  ModulePrismaRepository
} from "./chunk-G3LWYFUE.js";
import {
  QuestionContractRepository
} from "./chunk-WTYPRCME.js";
import {
  QuestionPrismaRepository
} from "./chunk-FTAF44OW.js";
import {
  UserContractRepository
} from "./chunk-PTQ2KP5N.js";
import {
  UserPrismaRepository
} from "./chunk-4A2CIEG7.js";
import {
  EmailContractService
} from "./chunk-2NLRF7DK.js";
import {
  AnswerContractRepository
} from "./chunk-NFWZCG5O.js";
import {
  AnswerPrismaRepository
} from "./chunk-DLIRAPMZ.js";
import {
  GameSessionContractRepository
} from "./chunk-QL5RK6WA.js";
import {
  GameSessionPrismaRepository
} from "./chunk-WS7FQUAY.js";
import {
  ModuleContractRepository
} from "./chunk-PX5JYL6Y.js";
import {
  __name
} from "./chunk-SHUYVCID.js";

// application/core/di-registry.ts
import { injectablesHolder } from "fastify-decorators";
function registerDependencies() {
  injectablesHolder.injectService(UserContractRepository, UserPrismaRepository);
  injectablesHolder.injectService(ModuleContractRepository, ModulePrismaRepository);
  injectablesHolder.injectService(QuestionContractRepository, QuestionPrismaRepository);
  injectablesHolder.injectService(GameSessionContractRepository, GameSessionPrismaRepository);
  injectablesHolder.injectService(AnswerContractRepository, AnswerPrismaRepository);
  injectablesHolder.injectService(EmailContractService, NodemailerEmailService);
}
__name(registerDependencies, "registerDependencies");

export {
  registerDependencies
};
