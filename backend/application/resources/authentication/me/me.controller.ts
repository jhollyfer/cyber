/* eslint-disable no-unused-vars */
import { AuthenticationMiddleware } from '@application/middlewares/authentication.middleware';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, getInstanceByToken } from 'fastify-decorators';

import { MeDocumentationSchema } from './me.doc';
import MeUseCase from './me.use-case';

@Controller({
  route: 'authentication',
})
export default class {
  constructor(
    private readonly useCase: MeUseCase = getInstanceByToken(MeUseCase),
  ) {}

  @GET({
    url: '/me',
    options: {
      onRequest: [
        AuthenticationMiddleware({
          optional: false,
        }),
      ],
      schema: MeDocumentationSchema,
    },
  })
  async handle(request: FastifyRequest, response: FastifyReply): Promise<void> {
    const result = await this.useCase.execute({ userId: request.user.sub! });

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
