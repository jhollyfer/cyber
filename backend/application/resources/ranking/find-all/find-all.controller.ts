import { AuthenticationMiddleware } from '@application/middlewares/authentication.middleware';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, getInstanceByToken } from 'fastify-decorators';

import { FindAllRankingDocumentationSchema } from './find-all.doc';
import FindAllRankingUseCase from './find-all.use-case';

@Controller({
  route: 'ranking',
})
export default class {
  constructor(
    private readonly useCase: FindAllRankingUseCase = getInstanceByToken(FindAllRankingUseCase),
  ) {}

  @GET({
    url: '/',
    options: {
      schema: FindAllRankingDocumentationSchema,
      onRequest: [AuthenticationMiddleware({ optional: true })],
    },
  })
  async handle(_request: FastifyRequest, response: FastifyReply): Promise<void> {
    const result = await this.useCase.execute();

    if (result.isLeft()) {
      const error = result.value;
      return response.status(error.code).send({
        message: error.message,
        code: error.code,
        cause: error.cause,
      });
    }

    return response.status(200).send(result.value);
  }
}
