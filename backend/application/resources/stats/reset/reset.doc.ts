import type { FastifySchema } from 'fastify';

export const ResetDocumentationSchema: FastifySchema = {
  tags: ['Stats'],
  summary: 'Reset all game data (Admin)',
  description: 'Deletes all answers and game sessions. This action is irreversible.',
  response: {
    200: {
      description: 'Game data reset successfully',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
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
