import { right, type Either } from '@application/core/either';
import HTTPException from '@application/core/exception';
import { clearCookieTokens } from '@application/utils/cookies.utils';
import type { FastifyReply } from 'fastify';
import { Service } from 'fastify-decorators';

type Response = Either<HTTPException, void>;

@Service()
export default class SignOutUseCase {
  async execute(response: FastifyReply): Promise<Response> {
    clearCookieTokens(response);
    return right(undefined);
  }
}
