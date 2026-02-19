import StatsMemoryRepository from '@application/repositories/stats-repository/stats-memory.repository';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ResetGameDataUseCase from './reset-game-data.use-case';

let useCase: ResetGameDataUseCase;
let statsRepository: StatsMemoryRepository;

describe('Reset Game Data Use Case', () => {
  beforeEach(() => {
    statsRepository = new StatsMemoryRepository();
    useCase = new ResetGameDataUseCase(statsRepository as any);
  });

  describe('execute', () => {
    it('deve resetar os dados de jogo com sucesso', async () => {
      const result = await useCase.execute();

      expect(result.isRight()).toBe(true);

      if (result.isRight()) {
        expect(result.value.message).toBe(
          'Todos os dados de jogo foram resetados com sucesso.',
        );
      }
    });

    it('deve retornar erro 500 quando ocorrer erro no repositorio', async () => {
      vi.spyOn(statsRepository, 'resetGameData').mockRejectedValue(
        new Error('Database error'),
      );

      const result = await useCase.execute();

      expect(result.isLeft()).toBe(true);

      if (result.isLeft()) {
        expect(result.value.code).toBe(500);
        expect(result.value.cause).toBe('RESET_GAME_DATA_ERROR');
      }
    });
  });
});
