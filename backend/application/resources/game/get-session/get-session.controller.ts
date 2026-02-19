import { IdParamSchema } from '@application/core/schemas';
import { AuthenticationMiddleware } from '@application/middlewares/authentication.middleware';
import { GameSessionContractRepository } from '@application/repositories/game-session-repository/game-session-contract.repository';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, getInstanceByToken } from 'fastify-decorators';

import { GetSessionDocumentationSchema } from './get-session.doc';
import GetSessionUseCase from './get-session.use-case';

@Controller({
  route: 'game',
})
export default class {
  constructor(
    private readonly gameSessionRepository: GameSessionContractRepository = getInstanceByToken(GameSessionContractRepository as any),
    private readonly getSessionUseCase: GetSessionUseCase = getInstanceByToken(GetSessionUseCase),
  ) {}

  @GET({
    url: '/sessions/best',
    options: {
      onRequest: [AuthenticationMiddleware()],
    },
  })
  async handleBest(
    request: FastifyRequest,
    response: FastifyReply,
  ): Promise<void> {
    const userId = request.user!.sub;
    const sessions = await this.gameSessionRepository.findBestSessionsByUser(userId);
    return response.status(200).send(sessions);
  }

  @GET({
    url: '/sessions/:id',
    options: {
      schema: GetSessionDocumentationSchema,
      onRequest: [AuthenticationMiddleware()],
    },
  })
  async handle(
    request: FastifyRequest<{ Params: { id: string } }>,
    response: FastifyReply,
  ): Promise<void> {
    const { id } = IdParamSchema.parse(request.params);
    const result = await this.getSessionUseCase.execute({
      session_id: id,
      user_id: request.user!.sub,
    });

    if (result.isLeft()) {
      return response.status(result.value.code).send({
        message: result.value.message,
        code: result.value.code,
        cause: result.value.cause,
      });
    }

    return response.status(200).send(result.value);
  }
}
