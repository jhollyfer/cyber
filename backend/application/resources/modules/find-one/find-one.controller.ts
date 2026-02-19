import { IdParamSchema } from '@application/core/schemas';
import { AuthenticationMiddleware } from '@application/middlewares/authentication.middleware';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, getInstanceByToken } from 'fastify-decorators';

import { FindOneModuleDocumentationSchema } from './find-one.doc';
import FindOneModuleUseCase from './find-one.use-case';

@Controller({
  route: 'modules',
})
export default class {
  constructor(
    private readonly useCase: FindOneModuleUseCase = getInstanceByToken(FindOneModuleUseCase),
  ) {}

  @GET({
    url: '/:id',
    options: {
      schema: FindOneModuleDocumentationSchema,
      onRequest: [AuthenticationMiddleware()],
    },
  })
  async handle(
    request: FastifyRequest<{ Params: { id: string } }>,
    response: FastifyReply,
  ): Promise<void> {
    const { id } = IdParamSchema.parse(request.params);
    const result = await this.useCase.execute({ id });

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
