import z from 'zod';

export const CreateModuleBodySchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required'),
  description: z
    .string()
    .trim()
    .min(1, 'Description is required'),
  icon: z
    .string()
    .trim()
    .min(1, 'Icon is required'),
  label: z
    .string()
    .trim()
    .min(1, 'Label is required'),
  order: z
    .number()
    .int()
    .optional()
    .default(0),
  time_per_question: z
    .number()
    .int()
    .positive()
    .optional()
    .default(60),
  gradient: z
    .string()
    .trim()
    .optional()
    .default('purple'),
  category_color: z
    .string()
    .trim()
    .optional()
    .default('purple'),
});
