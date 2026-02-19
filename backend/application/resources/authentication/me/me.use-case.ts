/* eslint-disable no-unused-vars */
import { left, right, type Either } from '@application/core/either';
import type { IUser } from '@application/core/entities';
import HTTPException from '@application/core/exception';
import { UserContractRepository } from '@application/repositories/user-repository/user-contract.repository';
import { Service } from 'fastify-decorators';

type Payload = { userId: string };
type Response = Either<HTTPException, Omit<IUser, 'password'>>;

@Service()
export default class MeUseCase {
  constructor(private readonly userRepository: UserContractRepository) {}

  async execute(payload: Payload): Promise<Response> {
    try {
      const user = await this.userRepository.findBy({
        id: payload.userId,
        exact: true,
      });

      if (!user)
        return left(HTTPException.NotFound('User not found', 'USER_NOT_FOUND'));

      return right({
        ...user,
        password: undefined,
      });
    } catch (error) {
      console.error(error);
      return left(
        HTTPException.InternalServerError('Internal server error', 'ME_ERROR'),
      );
    }
  }
}
