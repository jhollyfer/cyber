import type { ERole } from '@application/core/entities';
import HTTPException from '@application/core/exception';
import { type FastifyRequest } from 'fastify';

interface PermissionOptions {
  allowedRoles: ERole[];
}

export function PermissionMiddleware(options: PermissionOptions) {
  const { allowedRoles } = options;

  return async function (request: FastifyRequest): Promise<void> {
    if (!request.user) return;

    if (!allowedRoles.includes(request.user.role)) {
      throw HTTPException.Forbidden(
        'Insufficient permissions',
        'INSUFFICIENT_PERMISSIONS',
      );
    }
  };
}
