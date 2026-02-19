import type { ERole } from '@application/core/entities';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      sub: string;
      phone: string;
      role: ERole;
      type: 'access';
    };
  }
}
