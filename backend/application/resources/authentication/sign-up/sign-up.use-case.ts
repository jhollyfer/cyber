/* eslint-disable no-unused-vars */
import { left, right, type Either } from '@application/core/either';
import type { IUser } from '@application/core/entities';
import HTTPException from '@application/core/exception';
import { UserContractRepository } from '@application/repositories/user-repository/user-contract.repository';
import { hashPassword } from '@application/utils/password.utils';
import { Service } from 'fastify-decorators';
import type z from 'zod';

import type { SignUpBodySchema } from './sign-up.schema';

type Payload = z.infer<typeof SignUpBodySchema>;
type Response = Either<HTTPException, Omit<IUser, 'password'>>;

@Service()
export default class SignUpUseCase {
  constructor(private readonly userRepository: UserContractRepository) {}

  async execute(payload: Payload): Promise<Response> {
    try {
      const userExists = await this.userRepository.findBy({
        phone: payload.phone,
        exact: true,
      });

      if (userExists)
        return left(
          HTTPException.Conflict('User already exists', 'USER_ALREADY_EXISTS'),
        );

      const passwordHash = await hashPassword(payload.password);

      const user = await this.userRepository.create({
        name: payload.name,
        phone: payload.phone,
        password: passwordHash,
        role: 'STUDENT',
        active: true,
      });

      return right({ ...user, password: undefined });
    } catch (error) {
      console.error(error);
      return left(
        HTTPException.InternalServerError(
          'Internal server error',
          'SIGN_UP_ERROR',
        ),
      );
    }
  }
}
