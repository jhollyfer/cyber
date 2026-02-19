import StatsMemoryRepository from '@application/repositories/stats-repository/stats-memory.repository';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ExportCsvUseCase from './export-csv.use-case';

let useCase: ExportCsvUseCase;
let statsRepository: StatsMemoryRepository;

describe('Export CSV Use Case', () => {
  beforeEach(() => {
    statsRepository = new StatsMemoryRepository();
    useCase = new ExportCsvUseCase(statsRepository as any);
  });

  describe('execute', () => {
    it('deve gerar o CSV com sucesso', async () => {
      statsRepository.setModules([
        { id: 'mod-1', title: 'Modulo 1', order: 1 },
        { id: 'mod-2', title: 'Modulo 2', order: 2 },
      ]);

      statsRepository.setStudentsForExport([
        {
          id: 'user-1',
          name: 'Aluno 1',
          phone: '11999999999',
          created_at: new Date('2024-01-01'),
          game_sessions: [
            {
              nota: 8.5,
              score: 850,
              module_id: 'mod-1',
              correct_answers: 8,
              total_answered: 10,
              max_streak: 5,
              finished_at: new Date('2024-01-15'),
            },
          ],
        },
      ]);

      const result = await useCase.execute();

      expect(result.isRight()).toBe(true);

      if (result.isRight()) {
        expect(result.value).toContain('Pos;Nome;Telefone;Nota Geral');
        expect(result.value).toContain('Aluno 1');
        expect(result.value).toContain('11999999999');
        expect(result.value).toContain('\uFEFF');
      }
    });

    it('deve gerar CSV vazio quando nao houver alunos', async () => {
      statsRepository.setModules([
        { id: 'mod-1', title: 'Modulo 1', order: 1 },
      ]);
      statsRepository.setStudentsForExport([]);

      const result = await useCase.execute();

      expect(result.isRight()).toBe(true);

      if (result.isRight()) {
        expect(result.value).toContain('Pos;Nome;Telefone;Nota Geral');
      }
    });

    it('deve retornar erro 500 quando ocorrer erro no repositorio', async () => {
      vi.spyOn(statsRepository, 'findModulesOrdered').mockRejectedValue(
        new Error('Database error'),
      );

      const result = await useCase.execute();

      expect(result.isLeft()).toBe(true);

      if (result.isLeft()) {
        expect(result.value.code).toBe(500);
        expect(result.value.cause).toBe('EXPORT_CSV_ERROR');
      }
    });
  });
});
