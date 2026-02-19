import { IdParamSchema } from '@application/core/schemas';
import { AuthenticationMiddleware } from '@application/middlewares/authentication.middleware';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, getInstanceByToken, POST } from 'fastify-decorators';

import { SubmitAnswerDocumentationSchema } from './submit-answer.doc';
import { SubmitAnswerBodySchema } from './submit-answer.schema';
import SubmitAnswerUseCase from './submit-answer.use-case';

@Controller({
  route: 'game',
})
export default class {
  constructor(
    private readonly useCase: SubmitAnswerUseCase = getInstanceByToken(SubmitAnswerUseCase),
  ) {}

  @POST({
    url: '/sessions/:id/answer',
    options: {
      schema: SubmitAnswerDocumentationSchema,
      onRequest: [AuthenticationMiddleware()],
    },
  })
  async handle(
    request: FastifyRequest<{ Params: { id: string } }>,
    response: FastifyReply,
  ): Promise<void> {
    const payload = SubmitAnswerBodySchema.parse(request.body);
    const { id: sessionId } = IdParamSchema.parse(request.params);
    const userId = request.user!.sub;

    const result = await this.useCase.execute({
      ...payload,
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

    return response.status(201).send(result.value);
  }
}
