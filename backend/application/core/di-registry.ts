import { AnswerContractRepository } from '@application/repositories/answer-repository/answer-contract.repository';
import AnswerPrismaRepository from '@application/repositories/answer-repository/answer-prisma.repository';
import { GameSessionContractRepository } from '@application/repositories/game-session-repository/game-session-contract.repository';
import GameSessionPrismaRepository from '@application/repositories/game-session-repository/game-session-prisma.repository';
import { ModuleContractRepository } from '@application/repositories/module-repository/module-contract.repository';
import ModulePrismaRepository from '@application/repositories/module-repository/module-prisma.repository';
import { QuestionContractRepository } from '@application/repositories/question-repository/question-contract.repository';
import QuestionPrismaRepository from '@application/repositories/question-repository/question-prisma.repository';
import { RankingContractRepository } from '@application/repositories/ranking-repository/ranking-contract.repository';
import RankingPrismaRepository from '@application/repositories/ranking-repository/ranking-prisma.repository';
import { StatsContractRepository } from '@application/repositories/stats-repository/stats-contract.repository';
import StatsPrismaRepository from '@application/repositories/stats-repository/stats-prisma.repository';
import { UserContractRepository } from '@application/repositories/user-repository/user-contract.repository';
import UserPrismaRepository from '@application/repositories/user-repository/user-prisma.repository';
import { EmailContractService } from '@application/services/email/email-contract.service';
import NodemailerEmailService from '@application/services/email/nodemailer-email.service';
import { injectablesHolder } from 'fastify-decorators';

export function registerDependencies(): void {
  injectablesHolder.injectService(UserContractRepository, UserPrismaRepository);
  injectablesHolder.injectService(ModuleContractRepository, ModulePrismaRepository);
  injectablesHolder.injectService(QuestionContractRepository, QuestionPrismaRepository);
  injectablesHolder.injectService(GameSessionContractRepository, GameSessionPrismaRepository);
  injectablesHolder.injectService(AnswerContractRepository, AnswerPrismaRepository);
  injectablesHolder.injectService(RankingContractRepository, RankingPrismaRepository);
  injectablesHolder.injectService(StatsContractRepository, StatsPrismaRepository);
  injectablesHolder.injectService(EmailContractService, NodemailerEmailService);
}
