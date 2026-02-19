import { AuthenticationMiddleware } from '@application/middlewares/authentication.middleware';
import { PermissionMiddleware } from '@application/middlewares/permissions.middleware';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, DELETE, getInstanceByToken } from 'fastify-decorators';

import { ResetDocumentationSchema } from './reset.doc';
import ResetGameDataUseCase from './reset-game-data.use-case';

@Controller({
  route: 'stats',
})
export default class {
  constructor(
    private readonly useCase: ResetGameDataUseCase = getInstanceByToken(ResetGameDataUseCase),
  ) {}

  @DELETE({
    url: '/reset',
    options: {
      schema: ResetDocumentationSchema,
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
