import type { JWTPayload } from '@application/core/entities';
import HTTPException from '@application/core/exception';
import { type FastifyRequest } from 'fastify';

interface AuthOptions {
  optional?: boolean;
}

export function AuthenticationMiddleware(
  options: AuthOptions = { optional: false },
) {
  return async function (request: FastifyRequest): Promise<void> {
    try {
      const accessToken = request.cookies.accessToken;

      if (!accessToken) {
        if (options.optional) return;
        throw HTTPException.Unauthorized(
          'Authentication required',
          'AUTHENTICATION_REQUIRED',
        );
      }

      const accessTokenDecoded: JWTPayload | null =
        await request.server.jwt.decode(String(accessToken));

      if (!accessTokenDecoded || accessTokenDecoded.type !== 'access') {
        if (options.optional) return;
        throw HTTPException.Unauthorized(
          'Authentication required',
          'AUTHENTICATION_REQUIRED',
        );
      }

      request.user = {
        sub: accessTokenDecoded.sub,
        phone: accessTokenDecoded.phone,
        role: accessTokenDecoded.role,
        type: 'access',
      };
    } catch (error) {
      if (options.optional) return;

      console.error('Authentication error:', error);
      throw HTTPException.Unauthorized(
        'Authentication required',
        'AUTHENTICATION_REQUIRED',
      );
    }
  };
}
