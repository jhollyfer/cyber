import { config } from 'dotenv';
import { z } from 'zod';

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' });
}

if (!(process.env.NODE_ENV === 'test')) {
  config();
}

const schema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().default(4000),

  JWT_PUBLIC_KEY: z.string().trim(),
  JWT_PRIVATE_KEY: z.string().trim(),

  COOKIE_SECRET: z.string().trim(),
  COOKIE_DOMAIN: z.string().trim().optional(),

  DATABASE_URL: z.string().trim(),

  DB_HOST: z.string().trim().default('localhost'),
  DB_PORT: z.coerce.number().default(5432),
  DB_USER: z.string().trim(),
  DB_PASSWORD: z.string().trim(),
  DB_DATABASE: z.string().trim(),

  ADMINISTRATOR_PHONE: z.string().trim(),
  ADMINISTRATOR_PASSWORD: z.string().trim(),
  ADMINISTRATOR_NAME: z.string().trim().default('Administrador'),

  SERVER_URL: z.string().trim(),
  CLIENT_URL: z.string().trim(),

  SMTP_HOST: z.string().trim().optional(),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_SECURE: z.string().trim().default('false'),
  SMTP_USER: z.string().trim().optional(),
  SMTP_PASSWORD: z.string().trim().optional(),
  SMTP_FROM: z.string().trim().default('noreply@cyberguardian.app'),
});

const validation = schema.safeParse(process.env);

if (!validation.success) {
  console.error('Invalid environment variables', validation.error.format());
  throw new Error('Invalid environment variables');
}

export const Env = validation.data;
