import { AuthenticationMiddleware } from '@application/middlewares/authentication.middleware';
import { PermissionMiddleware } from '@application/middlewares/permissions.middleware';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, getInstanceByToken, PUT } from 'fastify-decorators';

import { UpdateQuestionDocumentationSchema } from './update.doc';
import { UpdateQuestionBodySchema, UpdateQuestionParamsSchema } from './update.schema';
import UpdateQuestionUseCase from './update.use-case';

@Controller({
  route: 'questions',
})
export default class {
  constructor(
    private readonly useCase: UpdateQuestionUseCase = getInstanceByToken(UpdateQuestionUseCase),
  ) {}

  @PUT({
    url: '/:id',
    options: {
      schema: UpdateQuestionDocumentationSchema,
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
    const { id } = UpdateQuestionParamsSchema.parse(request.params);
    const payload = UpdateQuestionBodySchema.parse(request.body);
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
