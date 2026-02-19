import { AuthenticationMiddleware } from '@application/middlewares/authentication.middleware';
import { PermissionMiddleware } from '@application/middlewares/permissions.middleware';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, getInstanceByToken, POST } from 'fastify-decorators';

import { CreateModuleDocumentationSchema } from './create.doc';
import { CreateModuleBodySchema } from './create.schema';
import CreateModuleUseCase from './create.use-case';

@Controller({
  route: 'modules',
})
export default class {
  constructor(
    private readonly useCase: CreateModuleUseCase = getInstanceByToken(CreateModuleUseCase),
  ) {}

  @POST({
    url: '/',
    options: {
      schema: CreateModuleDocumentationSchema,
      onRequest: [
        AuthenticationMiddleware(),
        PermissionMiddleware({ allowedRoles: ['ADMINISTRATOR'] }),
      ],
    },
  })
  async handle(request: FastifyRequest, response: FastifyReply): Promise<void> {
    const payload = CreateModuleBodySchema.parse(request.body);
    const result = await this.useCase.execute(payload);

    if (result.isLeft()) {
      const error = result.value;
      return response.status(error.code).send({
        message: error.message,
        code: error.code,
        cause: error.cause,
      });
    }

    return response.status(201).send(result.value);
  }
}
