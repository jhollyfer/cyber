import { AuthenticationMiddleware } from '@application/middlewares/authentication.middleware';
import { PermissionMiddleware } from '@application/middlewares/permissions.middleware';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, getInstanceByToken } from 'fastify-decorators';

import { FindAllStatsDocumentationSchema } from './find-all-stats.doc';
import FindAllStatsUseCase from './find-all-stats.use-case';

@Controller({
  route: 'stats',
})
export default class {
  constructor(
    private readonly useCase: FindAllStatsUseCase = getInstanceByToken(FindAllStatsUseCase),
  ) {}

  @GET({
    url: '/',
    options: {
      schema: FindAllStatsDocumentationSchema,
      onRequest: [
        AuthenticationMiddleware(),
        PermissionMiddleware({ allowedRoles: ['ADMINISTRATOR'] }),
      ],
    },
  })
  async handle(_request: FastifyRequest, response: FastifyReply): Promise<void> {
    const result = await this.useCase.execute();

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
