/* eslint-disable no-unused-vars */
import { left, right, type Either } from '@application/core/either';
import type { IUser } from '@application/core/entities';
import HTTPException from '@application/core/exception';
import { UserContractRepository } from '@application/repositories/user-repository/user-contract.repository';
import { comparePassword } from '@application/utils/password.utils';
import { Service } from 'fastify-decorators';
import type z from 'zod';

import type { SignInBodySchema } from './sign-in.schema';

type Payload = z.infer<typeof SignInBodySchema>;
type Response = Either<HTTPException, Omit<IUser, 'password'>>;

@Service()
export default class SignInUseCase {
  constructor(private readonly userRepository: UserContractRepository) {}

  async execute(payload: Payload): Promise<Response> {
    try {
      const user = await this.userRepository.findBy({
        phone: payload.phone,
        exact: true,
      });

      if (!user)
        return left(
          HTTPException.Unauthorized('Credenciais invalidas', 'USER_NOT_FOUND'),
        );

      if (!user.active)
        return left(
          HTTPException.Unauthorized('Credenciais invalidas', 'USER_INACTIVE'),
        );

      const passwordDoesMatch = await comparePassword(
        payload.password,
        user.password,
      );

      if (!passwordDoesMatch)
        return left(
          HTTPException.Unauthorized(
            'Credenciais invalidas',
            'INVALID_CREDENTIALS',
          ),
        );

      return right({
        ...user,
        password: undefined,
      });
    } catch (error) {
      console.error(error);
      return left(
        HTTPException.InternalServerError(
          'Internal server error',
          'SIGN_IN_ERROR',
        ),
      );
    }
  }
}
