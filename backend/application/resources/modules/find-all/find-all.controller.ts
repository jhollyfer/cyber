import { AuthenticationMiddleware } from '@application/middlewares/authentication.middleware';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, getInstanceByToken } from 'fastify-decorators';

import { FindAllModulesDocumentationSchema } from './find-all.doc';
import FindAllModulesUseCase from './find-all.use-case';

@Controller({
  route: 'modules',
})
export default class {
  constructor(
    private readonly useCase: FindAllModulesUseCase = getInstanceByToken(FindAllModulesUseCase),
  ) {}

  @GET({
    url: '/',
    options: {
      schema: FindAllModulesDocumentationSchema,
      onRequest: [AuthenticationMiddleware()],
    },
  })
  async handle(_request: FastifyRequest, response: FastifyReply): Promise<void> {
    const result = await this.useCase.execute();

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
