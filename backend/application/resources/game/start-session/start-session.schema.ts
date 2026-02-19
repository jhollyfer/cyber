import z from 'zod';

export const StartSessionBodySchema = z.object({
  module_id: z
    .string()
    .uuid('O module_id deve ser um UUID valido'),
});
