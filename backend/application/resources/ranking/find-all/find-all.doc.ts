import type { FastifySchema } from 'fastify';

export const FindAllRankingDocumentationSchema: FastifySchema = {
  tags: ['Ranking'],
  summary: 'Get general ranking',
  description: 'Returns ranking of all students based on average of best scores per module',
  response: {
    200: {
      description: 'Ranking list',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          user_id: { type: 'string' },
          name: { type: 'string' },
          average_nota: { type: 'number' },
          modules_completed: { type: 'number' },
          total_score: { type: 'number' },
          best_streak: { type: 'number' },
        },
      },
    },
  },
};
