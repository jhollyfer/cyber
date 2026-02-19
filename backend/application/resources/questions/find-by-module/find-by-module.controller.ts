import { ModuleIdParamSchema } from '@application/core/schemas';
import { AuthenticationMiddleware } from '@application/middlewares/authentication.middleware';
import { PermissionMiddleware } from '@application/middlewares/permissions.middleware';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, getInstanceByToken } from 'fastify-decorators';

import { FindByModuleQuestionsDocumentationSchema } from './find-by-module.doc';
import FindByModuleUseCase from './find-by-module.use-case';

@Controller({
  route: 'modules',
})
export default class {
  constructor(
    private readonly useCase: FindByModuleUseCase = getInstanceByToken(FindByModuleUseCase),
  ) {}

  @GET({
    url: '/:moduleId/questions',
    options: {
      schema: FindByModuleQuestionsDocumentationSchema,
      onRequest: [
        AuthenticationMiddleware(),
        PermissionMiddleware({ allowedRoles: ['ADMINISTRATOR'] }),
      ],
    },
  })
  async handle(
    request: FastifyRequest<{ Params: { moduleId: string } }>,
    response: FastifyReply,
  ): Promise<void> {
    const { moduleId } = ModuleIdParamSchema.parse(request.params);
    const result = await this.useCase.execute({ moduleId });

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
