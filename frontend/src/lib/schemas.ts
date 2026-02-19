import z from 'zod';

import { PASSWORD_REGEX } from './constants';

// ---------------------------------------------------------------------------
// Auth schemas
// ---------------------------------------------------------------------------

export const signInSchema = z.object({
  phone: z.string().min(1, 'Telefone obrigatorio'),
  password: z.string().min(1, 'Senha obrigatoria'),
});

export const signUpSchema = z.object({
  name: z.string().min(1, 'Nome obrigatorio'),
  phone: z.string().min(1, 'Telefone obrigatorio'),
  password: z
    .string()
    .min(6, 'Senha deve ter no minimo 6 caracteres')
    .regex(PASSWORD_REGEX, 'Senha deve ter 1 maiuscula, 1 minuscula, 1 numero e 1 caractere especial'),
});

// ---------------------------------------------------------------------------
// Module schemas
// ---------------------------------------------------------------------------

export const createModuleSchema = z.object({
  title: z.string().min(1, 'Titulo obrigatorio'),
  description: z.string().min(1, 'Descricao obrigatoria'),
  icon: z.string().min(1, 'Icone obrigatorio'),
  label: z.string().min(1, 'Label obrigatoria'),
  order: z.number().int().min(0),
  time_per_question: z.number().int().min(1),
  gradient: z.string().min(1),
  category_color: z.string().min(1),
});

export const updateModuleSchema = createModuleSchema.partial();

// ---------------------------------------------------------------------------
// Question schemas
// ---------------------------------------------------------------------------

export const createQuestionSchema = z.object({
  question: z.string().min(1, 'Pergunta obrigatoria'),
  options: z.array(z.string().min(1)).length(4, 'Deve ter 4 opcoes'),
  correct: z.number().int().min(0).max(3),
  explanation: z.string().min(1, 'Explicacao obrigatoria'),
  category: z.string().min(1, 'Categoria obrigatoria'),
  context: z.string().nullable().optional(),
  order: z.number().int().min(0),
});

export const updateQuestionSchema = createQuestionSchema.partial();

// ---------------------------------------------------------------------------
// Param schemas
// ---------------------------------------------------------------------------

export const uuidParamSchema = z.string().uuid();

// ---------------------------------------------------------------------------
// Search schemas (for admin tables with URL state)
// ---------------------------------------------------------------------------

export const adminModulesSearchSchema = z.object({
  search: z.string().optional(),
  page: z.number().int().min(1).optional(),
}).passthrough();

export const adminStudentsSearchSchema = z.object({
  search: z.string().optional(),
  page: z.number().int().min(1).optional(),
}).passthrough();
