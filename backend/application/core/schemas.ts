import z from 'zod';

export const IdParamSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});

export const ModuleIdParamSchema = z.object({
  moduleId: z.string().uuid('Invalid module ID format'),
});
