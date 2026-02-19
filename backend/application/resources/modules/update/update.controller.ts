import { AuthenticationMiddleware } from '@application/middlewares/authentication.middleware';
import { PermissionMiddleware } from '@application/middlewares/permissions.middleware';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, getInstanceByToken, PUT } from 'fastify-decorators';

import { UpdateModuleDocumentationSchema } from './update.doc';
import { UpdateModuleBodySchema, UpdateModuleParamsSchema } from './update.schema';
import UpdateModuleUseCase from './update.use-case';

@Controller({
  route: 'modules',
})
export default class {
  constructor(
    private readonly useCase: UpdateModuleUseCase = getInstanceByToken(UpdateModuleUseCase),
  ) {}

  @PUT({
    url: '/:id',
    options: {
      schema: UpdateModuleDocumentationSchema,
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
    const { id } = UpdateModuleParamsSchema.parse(request.params);
    const payload = UpdateModuleBodySchema.parse(request.body);
    const result = await this.useCase.execute({ ...payload, id });

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
