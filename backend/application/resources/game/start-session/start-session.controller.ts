import { AuthenticationMiddleware } from '@application/middlewares/authentication.middleware';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, getInstanceByToken, POST } from 'fastify-decorators';

import { StartSessionDocumentationSchema } from './start-session.doc';
import { StartSessionBodySchema } from './start-session.schema';
import StartSessionUseCase from './start-session.use-case';

@Controller({
  route: 'game',
})
export default class {
  constructor(
    private readonly useCase: StartSessionUseCase = getInstanceByToken(StartSessionUseCase),
  ) {}

  @POST({
    url: '/sessions',
    options: {
      schema: StartSessionDocumentationSchema,
      onRequest: [AuthenticationMiddleware()],
    },
  })
  async handle(request: FastifyRequest, response: FastifyReply): Promise<void> {
    const payload = StartSessionBodySchema.parse(request.body);
    const userId = request.user!.sub;

    const result = await this.useCase.execute({
      ...payload,
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
