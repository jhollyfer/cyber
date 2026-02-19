import { AuthenticationMiddleware } from '@application/middlewares/authentication.middleware';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, getInstanceByToken, POST } from 'fastify-decorators';

import { SignOutDocumentationSchema } from './sign-out.doc';
import SignOutUseCase from './sign-out.use-case';

@Controller({
  route: 'authentication',
})
export default class {
  constructor(
    private readonly useCase: SignOutUseCase = getInstanceByToken(SignOutUseCase),
  ) {}

  @POST({
    url: '/sign-out',
    options: {
      onRequest: [
        AuthenticationMiddleware({
          optional: false,
        }),
      ],
      schema: SignOutDocumentationSchema,
    },
  })
  async handle(request: FastifyRequest, response: FastifyReply): Promise<void> {
    await this.useCase.execute(response);

    return response.status(200).send();
  }
}
