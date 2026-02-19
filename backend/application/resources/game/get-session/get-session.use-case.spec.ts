import GameSessionMemoryRepository from '@application/repositories/game-session-repository/game-session-memory.repository';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import GetSessionUseCase from './get-session.use-case';

let useCase: GetSessionUseCase;
let gameSessionRepository: GameSessionMemoryRepository;

describe('Get Session Use Case', () => {
  beforeEach(() => {
    gameSessionRepository = new GameSessionMemoryRepository();
    useCase = new GetSessionUseCase(gameSessionRepository as any);
  });

  describe('execute', () => {
    it('deve retornar uma sessao com sucesso', async () => {
      const session = await gameSessionRepository.create({
        user_id: 'user-123',
        module_id: 'module-123',
      });

      const result = await useCase.execute({
        session_id: session.id,
        user_id: 'user-123',
      });

      expect(result.isRight()).toBe(true);

      if (result.isRight()) {
        expect(result.value).toBeDefined();
      }
    });

    it('deve retornar erro 404 quando a sessao nao for encontrada', async () => {
      const result = await useCase.execute({
        session_id: 'non-existent-id',
        user_id: 'user-123',
      });

      expect(result.isLeft()).toBe(true);

      if (result.isLeft()) {
        expect(result.value.code).toBe(404);
        expect(result.value.cause).toBe('SESSION_NOT_FOUND');
      }
    });

    it('deve retornar erro 403 quando o usuario nao for dono da sessao', async () => {
      const session = await gameSessionRepository.create({
        user_id: 'user-123',
        module_id: 'module-123',
      });

      const result = await useCase.execute({
        session_id: session.id,
        user_id: 'another-user',
      });

      expect(result.isLeft()).toBe(true);

      if (result.isLeft()) {
        expect(result.value.code).toBe(403);
        expect(result.value.cause).toBe('SESSION_OWNERSHIP_ERROR');
      }
    });
  });
});
