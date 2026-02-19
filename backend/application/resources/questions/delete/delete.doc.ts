import type { FastifySchema } from 'fastify';

export const DeleteQuestionDocumentationSchema: FastifySchema = {
  tags: ['Questions'],
  summary: 'Delete a question',
  description: 'Soft-deletes a question by setting active to false. Requires ADMINISTRATOR role.',
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', format: 'uuid', description: 'Question ID' },
    },
  },
  response: {
    204: {
      description: 'Question deleted successfully',
      type: 'null',
    },
    404: {
      description: 'Question not found',
      type: 'object',
      properties: {
        message: { type: 'string', examples: ['Question not found'] },
        code: { type: 'number', examples: [404] },
        cause: { type: 'string', examples: ['QUESTION_NOT_FOUND'] },
      },
    },
    401: {
      description: 'Authentication required',
      type: 'object',
      properties: {
        message: { type: 'string', examples: ['Authentication required'] },
        code: { type: 'number', examples: [401] },
        cause: { type: 'string', examples: ['AUTHENTICATION_REQUIRED'] },
      },
    },
    403: {
      description: 'Insufficient permissions',
      type: 'object',
      properties: {
        message: { type: 'string', examples: ['Insufficient permissions'] },
        code: { type: 'number', examples: [403] },
        cause: { type: 'string', examples: ['INSUFFICIENT_PERMISSIONS'] },
      },
    },
  },
};
