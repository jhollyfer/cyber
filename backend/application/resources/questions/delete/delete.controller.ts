import { IdParamSchema } from '@application/core/schemas';
import { AuthenticationMiddleware } from '@application/middlewares/authentication.middleware';
import { PermissionMiddleware } from '@application/middlewares/permissions.middleware';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, DELETE, getInstanceByToken } from 'fastify-decorators';

import { DeleteQuestionDocumentationSchema } from './delete.doc';
import DeleteQuestionUseCase from './delete.use-case';

@Controller({
  route: 'questions',
})
export default class {
  constructor(
    private readonly useCase: DeleteQuestionUseCase = getInstanceByToken(DeleteQuestionUseCase),
  ) {}

  @DELETE({
    url: '/:id',
    options: {
      schema: DeleteQuestionDocumentationSchema,
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
