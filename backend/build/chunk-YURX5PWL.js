import {
  StatsPrismaRepository
} from "./chunk-ZFJF6E7N.js";
import {
  UserPrismaRepository
} from "./chunk-PZEVUCQA.js";
import {
  UserContractRepository
} from "./chunk-PTQ2KP5N.js";
import {
  EmailContractService
} from "./chunk-2NLRF7DK.js";
import {
  NodemailerEmailService
} from "./chunk-JJAQRIS5.js";
import {
  ModulePrismaRepository
} from "./chunk-3S43JY7S.js";
import {
  QuestionPrismaRepository
} from "./chunk-Y34IBYK5.js";
import {
  QuestionContractRepository
} from "./chunk-WTYPRCME.js";
import {
  RankingPrismaRepository
} from "./chunk-B2ATDGCX.js";
import {
  RankingContractRepository
} from "./chunk-D7B2BST3.js";
import {
  StatsContractRepository
} from "./chunk-HPJBMAPB.js";
import {
  AnswerPrismaRepository
} from "./chunk-RZUCKSGA.js";
import {
  AnswerContractRepository
} from "./chunk-NFWZCG5O.js";
import {
  GameSessionPrismaRepository
} from "./chunk-MR5C3QLP.js";
import {
  GameSessionContractRepository
} from "./chunk-QL5RK6WA.js";
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
  injectablesHolder.injectService(RankingContractRepository, RankingPrismaRepository);
  injectablesHolder.injectService(StatsContractRepository, StatsPrismaRepository);
  injectablesHolder.injectService(EmailContractService, NodemailerEmailService);
}
__name(registerDependencies, "registerDependencies");

export {
  registerDependencies
};
