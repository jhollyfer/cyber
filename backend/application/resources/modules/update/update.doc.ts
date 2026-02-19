import type { FastifySchema } from 'fastify';

export const UpdateModuleDocumentationSchema: FastifySchema = {
  tags: ['Modules'],
  summary: 'Update a module',
  description: 'Updates an existing module. Requires ADMINISTRATOR role.',
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', format: 'uuid', description: 'Module ID' },
    },
  },
  body: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'Module title',
        examples: ['Network Security'],
      },
      description: {
        type: 'string',
        description: 'Module description',
        examples: ['Learn about network security fundamentals'],
      },
      icon: {
        type: 'string',
        description: 'Module icon identifier',
        examples: ['shield'],
      },
      label: {
        type: 'string',
        description: 'Module label',
        examples: ['Security'],
      },
      order: {
        type: 'number',
        description: 'Display order',
        examples: [1],
      },
      time_per_question: {
        type: 'number',
        description: 'Time per question in seconds',
        examples: [60],
      },
      gradient: {
        type: 'string',
        description: 'Gradient color theme',
        examples: ['purple'],
      },
      category_color: {
        type: 'string',
        description: 'Category color',
        examples: ['purple'],
      },
    },
  },
  response: {
    200: {
      description: 'Module updated successfully',
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        title: { type: 'string' },
        description: { type: 'string' },
        icon: { type: 'string' },
        label: { type: 'string' },
        order: { type: 'number' },
        time_per_question: { type: 'number' },
        gradient: { type: 'string' },
        category_color: { type: 'string' },
        active: { type: 'boolean' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    },
    404: {
      description: 'Module not found',
      type: 'object',
      properties: {
        message: { type: 'string', examples: ['Module not found'] },
        code: { type: 'number', examples: [404] },
        cause: { type: 'string', examples: ['MODULE_NOT_FOUND'] },
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
        cause: { type: 'string', examples: ['UPDATE_MODULE_ERROR'] },
      },
    },
  },
};
