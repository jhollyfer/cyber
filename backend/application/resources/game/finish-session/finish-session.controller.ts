import { IdParamSchema } from '@application/core/schemas';
import { AuthenticationMiddleware } from '@application/middlewares/authentication.middleware';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, getInstanceByToken, POST } from 'fastify-decorators';

import { FinishSessionDocumentationSchema } from './finish-session.doc';
import FinishSessionUseCase from './finish-session.use-case';

@Controller({
  route: 'game',
})
export default class {
  constructor(
    private readonly useCase: FinishSessionUseCase = getInstanceByToken(FinishSessionUseCase),
  ) {}

  @POST({
    url: '/sessions/:id/finish',
    options: {
      schema: FinishSessionDocumentationSchema,
      onRequest: [AuthenticationMiddleware()],
    },
  })
  async handle(
    request: FastifyRequest<{ Params: { id: string } }>,
    response: FastifyReply,
  ): Promise<void> {
    const { id: sessionId } = IdParamSchema.parse(request.params);
    const userId = request.user!.sub;

    const result = await this.useCase.execute({
      session_id: sessionId,
      user_id: userId,
    });

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
