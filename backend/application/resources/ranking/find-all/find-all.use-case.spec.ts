import RankingMemoryRepository from '@application/repositories/ranking-repository/ranking-memory.repository';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import FindAllRankingUseCase from './find-all.use-case';

let useCase: FindAllRankingUseCase;
let rankingRepository: RankingMemoryRepository;

describe('Find All Ranking Use Case', () => {
  beforeEach(() => {
    rankingRepository = new RankingMemoryRepository();
    useCase = new FindAllRankingUseCase(rankingRepository as any);
  });

  describe('execute', () => {
    it('deve retornar o ranking com sucesso', async () => {
      rankingRepository.setStudents([
        {
          id: 'user-1',
          name: 'Aluno 1',
          game_sessions: [
            {
              nota: 8,
              module_id: 'mod-1',
              correct_answers: 8,
              total_answered: 10,
              score: 800,
              max_streak: 5,
            },
          ],
        },
        {
          id: 'user-2',
          name: 'Aluno 2',
          game_sessions: [
            {
              nota: 6,
              module_id: 'mod-1',
              correct_answers: 6,
              total_answered: 10,
              score: 600,
              max_streak: 3,
            },
          ],
        },
      ]);

      const result = await useCase.execute();

      expect(result.isRight()).toBe(true);

      if (result.isRight()) {
        expect(result.value).toHaveLength(2);
        expect(result.value[0].name).toBe('Aluno 1');
        expect(result.value[0].total_score).toBeGreaterThan(result.value[1].total_score);
      }
    });

    it('deve priorizar pontuação total sobre nota média', async () => {
      rankingRepository.setStudents([
        {
          id: 'user-a',
          name: 'Aluno A',
          game_sessions: [
            {
              nota: 10,
              module_id: 'mod-1',
              correct_answers: 10,
              total_answered: 10,
              score: 1000,
              max_streak: 10,
            },
          ],
        },
        {
          id: 'user-b',
          name: 'Aluno B',
          game_sessions: [
            {
              nota: 9,
              module_id: 'mod-1',
              correct_answers: 9,
              total_answered: 10,
              score: 900,
              max_streak: 7,
            },
            {
              nota: 9,
              module_id: 'mod-2',
              correct_answers: 9,
              total_answered: 10,
              score: 900,
              max_streak: 8,
            },
            {
              nota: 9,
              module_id: 'mod-3',
              correct_answers: 9,
              total_answered: 10,
              score: 900,
              max_streak: 6,
            },
          ],
        },
      ]);

      const result = await useCase.execute();

      expect(result.isRight()).toBe(true);

      if (result.isRight()) {
        expect(result.value).toHaveLength(2);
        expect(result.value[0].name).toBe('Aluno B');
        expect(result.value[0].total_score).toBe(2700);
        expect(result.value[1].name).toBe('Aluno A');
        expect(result.value[1].total_score).toBe(1000);
      }
    });

    it('deve retornar lista vazia quando nao houver alunos com sessoes', async () => {
      rankingRepository.setStudents([
        {
          id: 'user-1',
          name: 'Aluno sem sessoes',
          game_sessions: [],
        },
      ]);

      const result = await useCase.execute();

      expect(result.isRight()).toBe(true);

      if (result.isRight()) {
        expect(result.value).toHaveLength(0);
      }
    });

    it('deve retornar erro 500 quando ocorrer erro no repositorio', async () => {
      vi.spyOn(rankingRepository, 'findStudentsWithBestSessions').mockRejectedValue(
        new Error('Database error'),
      );

      const result = await useCase.execute();

      expect(result.isLeft()).toBe(true);

      if (result.isLeft()) {
        expect(result.value.code).toBe(500);
        expect(result.value.cause).toBe('FIND_ALL_RANKING_ERROR');
      }
    });
  });
});
