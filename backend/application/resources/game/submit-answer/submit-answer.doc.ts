import type { FastifySchema } from 'fastify';

export const SubmitAnswerDocumentationSchema: FastifySchema = {
  tags: ['Game'],
  summary: 'Submit an answer',
  description: 'Submits an answer for a question in the game session',
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'The session ID',
      },
    },
  },
  body: {
    type: 'object',
    required: ['question_id', 'selected_option'],
    properties: {
      question_id: {
        type: 'string',
        format: 'uuid',
        description: 'The question ID being answered',
      },
      selected_option: {
        type: 'number',
        description: 'The selected option index (-1 for timeout)',
        examples: [2],
      },
      time_spent: {
        type: 'number',
        description: 'Time spent answering in seconds',
        examples: [12.5],
      },
    },
  },
  response: {
    201: {
      description: 'Answer submitted successfully',
      type: 'object',
      properties: {
        is_correct: { type: 'boolean' },
        correct_option: { type: 'number' },
        explanation: { type: 'string' },
        points: { type: 'number' },
        streak: { type: 'number' },
        score: { type: 'number' },
      },
    },
    404: {
      description: 'Session or question not found',
      type: 'object',
      properties: {
        message: { type: 'string' },
        code: { type: 'number', examples: [404] },
        cause: { type: 'string' },
      },
    },
    400: {
      description: 'Session already finished or question module mismatch',
      type: 'object',
      properties: {
        message: { type: 'string' },
        code: { type: 'number', examples: [400] },
        cause: { type: 'string' },
      },
    },
    403: {
      description: 'Session ownership error',
      type: 'object',
      properties: {
        message: { type: 'string', examples: ['You do not own this session'] },
        code: { type: 'number', examples: [403] },
        cause: { type: 'string', examples: ['SESSION_OWNERSHIP_ERROR'] },
      },
    },
    409: {
      description: 'Answer already exists for this question',
      type: 'object',
      properties: {
        message: { type: 'string', examples: ['Question already answered in this session'] },
        code: { type: 'number', examples: [409] },
        cause: { type: 'string', examples: ['ANSWER_ALREADY_EXISTS'] },
      },
    },
    500: {
      description: 'Internal server error',
      type: 'object',
      properties: {
        message: { type: 'string' },
        code: { type: 'number', examples: [500] },
        cause: { type: 'string', examples: ['SUBMIT_ANSWER_ERROR'] },
      },
    },
  },
};
