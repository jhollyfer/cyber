import { PrismaPg } from '@prisma/adapter-pg';
import { Env } from '@start/env';

import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaPg({ connectionString: Env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export { prisma };
