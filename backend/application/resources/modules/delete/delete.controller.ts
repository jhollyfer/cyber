import { IdParamSchema } from '@application/core/schemas';
import { AuthenticationMiddleware } from '@application/middlewares/authentication.middleware';
import { PermissionMiddleware } from '@application/middlewares/permissions.middleware';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, DELETE, getInstanceByToken } from 'fastify-decorators';

import { DeleteModuleDocumentationSchema } from './delete.doc';
import DeleteModuleUseCase from './delete.use-case';

@Controller({
  route: 'modules',
})
export default class {
  constructor(
    private readonly useCase: DeleteModuleUseCase = getInstanceByToken(DeleteModuleUseCase),
  ) {}

  @DELETE({
    url: '/:id',
    options: {
      schema: DeleteModuleDocumentationSchema,
      onRequest: [
        AuthenticationMiddleware(),
        PermissionMiddleware({ allowedRoles: ['ADMINISTRATOR'] }),
      ],
    },
  })
  async handle(
    request: FastifyRequest<{ Params: { id: string } }>,
    response: FastifyReply,
  ): Promise<void> {
    const { id } = IdParamSchema.parse(request.params);
    const result = await this.useCase.execute({ id });

    if (result.isLeft()) {
      const error = result.value;
      return response.status(error.code).send({
        message: error.message,
        code: error.code,
        cause: error.cause,
      });
    }

    return response.status(204).send();
  }
}
