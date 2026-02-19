import { left, right, type Either } from '@application/core/either';
import type { IGameSession } from '@application/core/entities';
import HTTPException from '@application/core/exception';
import { GameSessionContractRepository } from '@application/repositories/game-session-repository/game-session-contract.repository';
import { Service } from 'fastify-decorators';

interface Payload {
  session_id: string;
  user_id: string;
}

type Response = Either<HTTPException, IGameSession & { answers: { question_id: string }[] }>;

@Service()
export default class GetSessionUseCase {
  constructor(
    private readonly gameSessionRepository: GameSessionContractRepository,
  ) {}

  async execute(payload: Payload): Promise<Response> {
    const session = await this.gameSessionRepository.findByIdWithAnswers(payload.session_id);

    if (!session) {
      return left(
        HTTPException.NotFound('Session not found', 'SESSION_NOT_FOUND'),
      );
    }

    if (session.user_id !== payload.user_id) {
      return left(
        HTTPException.Forbidden('You do not own this session', 'SESSION_OWNERSHIP_ERROR'),
      );
    }

    return right(session);
  }
}
