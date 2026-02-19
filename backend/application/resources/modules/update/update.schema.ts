import z from 'zod';

export const UpdateModuleParamsSchema = z.object({
  id: z.string().uuid('Invalid module ID'),
});

export const UpdateModuleBodySchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .optional(),
  description: z
    .string()
    .trim()
    .min(1, 'Description is required')
    .optional(),
  icon: z
    .string()
    .trim()
    .min(1, 'Icon is required')
    .optional(),
  label: z
    .string()
    .trim()
    .min(1, 'Label is required')
    .optional(),
  order: z
    .number()
    .int()
    .optional(),
  time_per_question: z
    .number()
    .int()
    .positive()
    .optional(),
  gradient: z
    .string()
    .trim()
    .optional(),
  category_color: z
    .string()
    .trim()
    .optional(),
});
