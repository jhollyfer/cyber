import z from 'zod';

export const SignInBodySchema = z.object({
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/\D/g, ''))
    .pipe(
      z.string().min(10, 'O telefone deve ter no minimo 10 digitos'),
    ),
  password: z
    .string()
    .trim()
    .refine((value) => value.length > 0, 'A senha e obrigatoria'),
});
