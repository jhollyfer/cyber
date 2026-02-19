import 'reflect-metadata';

import { PrismaPg } from '@prisma/adapter-pg';
import { config } from 'dotenv';
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { afterAll, beforeAll } from 'vitest';

import { PrismaClient } from '../generated/prisma/client';

config({ path: '.env.test' });

let testSchema: string;
let originalDatabaseUrl: string;

beforeAll(async () => {
  originalDatabaseUrl = process.env.DATABASE_URL!;

  testSchema = randomUUID();

  const url = new URL(originalDatabaseUrl);
  url.searchParams.set('schema', testSchema);
  process.env.DATABASE_URL = url.toString();

  console.log(`🔌 Configurando banco de dados: ${process.env.DATABASE_URL}`);

  console.log(`🔄 Configurando schema de teste: ${testSchema}`);

  execSync('npx prisma migrate reset --force', { stdio: 'inherit' });
  // Executar migrações
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
});

afterAll(async () => {
  if (testSchema) {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });

    const prisma = new PrismaClient({ adapter });

    try {
      console.log(`🗑️ Limpar schema de teste: ${testSchema}`);
      await prisma.$executeRawUnsafe(
        `DROP SCHEMA IF EXISTS "${testSchema}" CASCADE`,
      );
    } catch (error) {
      console.warn('Erro ao limpar schema:', error);
    } finally {
      await prisma.$disconnect();
    }
  }

  process.env.DATABASE_URL = originalDatabaseUrl;
});
