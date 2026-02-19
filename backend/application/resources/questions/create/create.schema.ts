import z from 'zod';

export const CreateQuestionParamsSchema = z.object({
  moduleId: z.string().uuid('Invalid module ID'),
});

export const CreateQuestionBodySchema = z.object({
  question: z
    .string()
    .trim()
    .min(1, 'Question is required'),
  options: z
    .array(z.string().trim().min(1, 'Option cannot be empty'))
    .length(4, 'Exactly 4 options are required'),
  correct: z
    .number()
    .int()
    .min(0, 'Correct option must be between 0 and 3')
    .max(3, 'Correct option must be between 0 and 3'),
  explanation: z
    .string()
    .trim()
    .min(1, 'Explanation is required'),
  category: z
    .string()
    .trim()
    .min(1, 'Category is required'),
  context: z
    .string()
    .trim()
    .nullish()
    .default(null),
  order: z
    .number()
    .int()
    .optional()
    .default(0),
});
