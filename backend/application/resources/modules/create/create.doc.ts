import type { FastifySchema } from 'fastify';

export const CreateModuleDocumentationSchema: FastifySchema = {
  tags: ['Modules'],
  summary: 'Create a new module',
  description: 'Creates a new module. Requires ADMINISTRATOR role.',
  body: {
    type: 'object',
    required: ['title', 'description', 'icon', 'label'],
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
        description: 'Display order (default: 0)',
        examples: [1],
      },
      time_per_question: {
        type: 'number',
        description: 'Time per question in seconds (default: 60)',
        examples: [60],
      },
      gradient: {
        type: 'string',
        description: 'Gradient color theme (default: purple)',
        examples: ['purple'],
      },
      category_color: {
        type: 'string',
        description: 'Category color (default: purple)',
        examples: ['purple'],
      },
    },
  },
  response: {
    201: {
      description: 'Module created successfully',
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
        cause: { type: 'string', examples: ['CREATE_MODULE_ERROR'] },
      },
    },
  },
};
