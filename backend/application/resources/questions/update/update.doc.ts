import type { FastifySchema } from 'fastify';

export const UpdateQuestionDocumentationSchema: FastifySchema = {
  tags: ['Questions'],
  summary: 'Update a question',
  description: 'Updates an existing question. Requires ADMINISTRATOR role.',
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', format: 'uuid', description: 'Question ID' },
    },
  },
  body: {
    type: 'object',
    properties: {
      question: {
        type: 'string',
        description: 'Question text',
        examples: ['What is a firewall?'],
      },
      options: {
        type: 'array',
        description: 'Exactly 4 answer options',
        items: { type: 'string' },
        minItems: 4,
        maxItems: 4,
        examples: [['Option A', 'Option B', 'Option C', 'Option D']],
      },
      correct: {
        type: 'number',
        description: 'Index of the correct option (0-3)',
        minimum: 0,
        maximum: 3,
        examples: [0],
      },
      explanation: {
        type: 'string',
        description: 'Explanation for the correct answer',
        examples: ['A firewall is a network security system that monitors traffic.'],
      },
      category: {
        type: 'string',
        description: 'Question category',
        examples: ['Network Security'],
      },
      context: {
        type: 'string',
        nullable: true,
        description: 'Additional context for the question',
        examples: ['Consider a corporate network environment.'],
      },
      order: {
        type: 'number',
        description: 'Display order',
        examples: [1],
      },
    },
  },
  response: {
    200: {
      description: 'Question updated successfully',
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        question: { type: 'string' },
        options: {
          type: 'array',
          items: { type: 'string' },
        },
        correct: { type: 'number' },
        explanation: { type: 'string' },
        category: { type: 'string' },
        context: { type: 'string', nullable: true },
        order: { type: 'number' },
        active: { type: 'boolean' },
        module_id: { type: 'string', format: 'uuid' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
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
    500: {
      description: 'Internal server error',
      type: 'object',
      properties: {
        message: { type: 'string' },
        code: { type: 'number', examples: [500] },
        cause: { type: 'string', examples: ['UPDATE_QUESTION_ERROR'] },
      },
    },
  },
};
