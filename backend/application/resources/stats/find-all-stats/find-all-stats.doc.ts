import type { FastifySchema } from 'fastify';

export const FindAllStatsDocumentationSchema: FastifySchema = {
  tags: ['Stats'],
  summary: 'Get general statistics (Admin)',
  description: 'Returns total students, average grade, approval rate, and hardest module',
  response: {
    200: {
      description: 'Statistics summary',
      type: 'object',
      properties: {
        total_students: { type: 'number' },
        total_sessions: { type: 'number' },
        average_nota: { type: 'number' },
        approval_rate: { type: 'number' },
        hardest_module: {
          type: 'object',
          nullable: true,
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            average_nota: { type: 'number' },
          },
        },
      },
    },
  },
};
