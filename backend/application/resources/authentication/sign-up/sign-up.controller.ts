import { setCookieTokens } from '@application/utils/cookies.utils';
import { createTokens } from '@application/utils/jwt.utils';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, getInstanceByToken, POST } from 'fastify-decorators';

import { SignUpDocumentationSchema } from './sign-up.doc';
import { SignUpBodySchema } from './sign-up.schema';
import SignUpUseCase from './sign-up.use-case';

@Controller({
  route: 'authentication',
})
export default class {
  constructor(
    private readonly useCase: SignUpUseCase = getInstanceByToken(SignUpUseCase),
  ) {}

  @POST({
    url: '/sign-up',
    options: {
      schema: SignUpDocumentationSchema,
      config: {
        rateLimit: {
          max: 5,
          timeWindow: '1 minute',
        },
      },
    },
  })
  async handle(request: FastifyRequest, response: FastifyReply): Promise<void> {
    const payload = SignUpBodySchema.parse(request.body);
    const result = await this.useCase.execute(payload);

    if (result.isLeft()) {
      const error = result.value;
      return response.status(error.code).send({
        message: error.message,
        code: error.code,
        cause: error.cause,
      });
    }

    const tokens = await createTokens(result.value, response);
    setCookieTokens(response, tokens);

    return response.status(201).send(result.value);
  }
}
