import { left, right, type Either } from '@application/core/either';
import HTTPException from '@application/core/exception';
import { StatsContractRepository } from '@application/repositories/stats-repository/stats-contract.repository';
import { Service } from 'fastify-decorators';

type Response = Either<HTTPException, { message: string }>;

@Service()
export default class ResetGameDataUseCase {
  constructor(private readonly statsRepository: StatsContractRepository) {}

  async execute(): Promise<Response> {
    try {
      await this.statsRepository.resetGameData();

      return right({
        message: 'Todos os dados de jogo foram resetados com sucesso.',
      });
    } catch (_error) {
      return left(HTTPException.InternalServerError('Internal server error', 'RESET_GAME_DATA_ERROR'));
    }
  }
}
