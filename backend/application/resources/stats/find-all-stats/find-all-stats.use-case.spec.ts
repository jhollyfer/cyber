import StatsMemoryRepository from '@application/repositories/stats-repository/stats-memory.repository';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import FindAllStatsUseCase from './find-all-stats.use-case';

let useCase: FindAllStatsUseCase;
let statsRepository: StatsMemoryRepository;

describe('Find All Stats Use Case', () => {
  beforeEach(() => {
    statsRepository = new StatsMemoryRepository();
    useCase = new FindAllStatsUseCase(statsRepository as any);
  });

  describe('execute', () => {
    it('deve retornar as estatisticas com sucesso', async () => {
      statsRepository.setActiveStudentCount(10);
      statsRepository.setFinishedSessions([
        { nota: 8, module_id: 'mod-1' },
        { nota: 6, module_id: 'mod-1' },
        { nota: 4, module_id: 'mod-2' },
      ]);
      statsRepository.setModules([
        { id: 'mod-1', title: 'Modulo 1', order: 1 },
        { id: 'mod-2', title: 'Modulo 2', order: 2 },
      ]);

      const result = await useCase.execute();

      expect(result.isRight()).toBe(true);

      if (result.isRight()) {
        expect(result.value.total_students).toBe(10);
        expect(result.value.total_sessions).toBe(3);
        expect(result.value.average_nota).toBeGreaterThan(0);
        expect(result.value.approval_rate).toBeGreaterThan(0);
        expect(result.value.hardest_module).toBeDefined();
        expect(result.value.hardest_module?.title).toBe('Modulo 2');
      }
    });

    it('deve retornar estatisticas zeradas quando nao houver sessoes', async () => {
      statsRepository.setActiveStudentCount(5);
      statsRepository.setFinishedSessions([]);

      const result = await useCase.execute();

      expect(result.isRight()).toBe(true);

      if (result.isRight()) {
        expect(result.value.total_students).toBe(5);
        expect(result.value.total_sessions).toBe(0);
        expect(result.value.average_nota).toBe(0);
        expect(result.value.approval_rate).toBe(0);
        expect(result.value.hardest_module).toBeNull();
      }
    });

    it('deve retornar erro 500 quando ocorrer erro no repositorio', async () => {
      vi.spyOn(statsRepository, 'countActiveStudents').mockRejectedValue(
        new Error('Database error'),
      );

      const result = await useCase.execute();

      expect(result.isLeft()).toBe(true);

      if (result.isLeft()) {
        expect(result.value.code).toBe(500);
        expect(result.value.cause).toBe('FIND_ALL_STATS_ERROR');
      }
    });
  });
});
