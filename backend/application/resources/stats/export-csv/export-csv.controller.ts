import { AuthenticationMiddleware } from '@application/middlewares/authentication.middleware';
import { PermissionMiddleware } from '@application/middlewares/permissions.middleware';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, GET, getInstanceByToken } from 'fastify-decorators';

import { ExportCsvDocumentationSchema } from './export-csv.doc';
import ExportCsvUseCase from './export-csv.use-case';

@Controller({
  route: 'stats',
})
export default class {
  constructor(
    private readonly useCase: ExportCsvUseCase = getInstanceByToken(ExportCsvUseCase),
  ) {}

  @GET({
    url: '/export-csv',
    options: {
      schema: ExportCsvDocumentationSchema,
      onRequest: [
        AuthenticationMiddleware(),
        PermissionMiddleware({ allowedRoles: ['ADMINISTRATOR'] }),
      ],
    },
  })
  async handle(_request: FastifyRequest, response: FastifyReply): Promise<void> {
    const result = await this.useCase.execute();

    if (result.isLeft()) {
      return response.status(result.value.code).send({
        message: result.value.message,
        code: result.value.code,
        cause: result.value.cause,
      });
    }

    response
      .header('Content-Type', 'text/csv; charset=utf-8')
      .header('Content-Disposition', 'attachment; filename="cyberguardian-ranking.csv"')
      .status(200)
      .send(result.value);
  }
}
