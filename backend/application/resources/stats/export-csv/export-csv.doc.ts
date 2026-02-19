import type { FastifySchema } from 'fastify';

export const ExportCsvDocumentationSchema: FastifySchema = {
  tags: ['Stats'],
  summary: 'Export ranking data as CSV (Admin)',
  description: 'Generates a CSV file with student ranking data including per-module grades',
  response: {
    200: {
      description: 'CSV file content',
      type: 'string',
    },
    401: {
      description: 'Unauthorized',
      type: 'object',
      properties: {
        message: { type: 'string' },
        code: { type: 'number' },
        cause: { type: 'string' },
      },
    },
    403: {
      description: 'Forbidden - Admin only',
      type: 'object',
      properties: {
        message: { type: 'string' },
        code: { type: 'number' },
        cause: { type: 'string' },
      },
    },
  },
};
