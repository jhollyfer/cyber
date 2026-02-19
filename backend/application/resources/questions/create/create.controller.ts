import { AuthenticationMiddleware } from '@application/middlewares/authentication.middleware';
import { PermissionMiddleware } from '@application/middlewares/permissions.middleware';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, getInstanceByToken, POST } from 'fastify-decorators';

import { CreateQuestionDocumentationSchema } from './create.doc';
import { CreateQuestionBodySchema, CreateQuestionParamsSchema } from './create.schema';
import CreateQuestionUseCase from './create.use-case';

@Controller({
  route: 'modules',
})
export default class {
  constructor(
    private readonly useCase: CreateQuestionUseCase = getInstanceByToken(CreateQuestionUseCase),
  ) {}

  @POST({
    url: '/:moduleId/questions',
    options: {
      schema: CreateQuestionDocumentationSchema,
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
    const { moduleId } = CreateQuestionParamsSchema.parse(request.params);
    const payload = CreateQuestionBodySchema.parse(request.body);
    const result = await this.useCase.execute({ ...payload, module_id: moduleId });

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
