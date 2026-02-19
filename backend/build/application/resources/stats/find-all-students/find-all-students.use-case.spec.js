import StatsMemoryRepository from '@application/repositories/stats-repository/stats-memory.repository';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import FindAllStudentsUseCase from './find-all-students.use-case';
let useCase;
let statsRepository;
describe('Find All Students Use Case', () => {
    beforeEach(() => {
        statsRepository = new StatsMemoryRepository();
        useCase = new FindAllStudentsUseCase(statsRepository);
    });
    describe('execute', () => {
        it('deve retornar todos os alunos com detalhes dos modulos', async () => {
            statsRepository.setStudentsWithModules([
                {
                    id: 'user-1',
                    name: 'Aluno 1',
                    phone: '11999999999',
                    created_at: new Date('2024-01-01'),
                    game_sessions: [
                        {
                            nota: 8,
                            score: 800,
                            module_id: 'mod-1',
                            module_title: 'Modulo 1',
                            correct_answers: 8,
                            total_answered: 10,
                            finished_at: new Date('2024-01-15'),
                        },
                    ],
                },
                {
                    id: 'user-2',
                    name: 'Aluno 2',
                    phone: '11888888888',
                    created_at: new Date('2024-02-01'),
                    game_sessions: [],
                },
            ]);
            const result = await useCase.execute();
            expect(result.isRight()).toBe(true);
            if (result.isRight()) {
                expect(result.value).toHaveLength(2);
                expect(result.value[0].name).toBe('Aluno 1');
                expect(result.value[0].modules_completed).toBe(1);
                expect(result.value[0].average_nota).toBe(8);
                expect(result.value[1].modules_completed).toBe(0);
                expect(result.value[1].average_nota).toBe(0);
            }
        });
        it('deve retornar lista vazia quando nao houver alunos', async () => {
            statsRepository.setStudentsWithModules([]);
            const result = await useCase.execute();
            expect(result.isRight()).toBe(true);
            if (result.isRight()) {
                expect(result.value).toHaveLength(0);
            }
        });
        it('deve retornar erro 500 quando ocorrer erro no repositorio', async () => {
            vi.spyOn(statsRepository, 'findStudentsWithModuleDetails').mockRejectedValue(new Error('Database error'));
            const result = await useCase.execute();
            expect(result.isLeft()).toBe(true);
            if (result.isLeft()) {
                expect(result.value.code).toBe(500);
                expect(result.value.cause).toBe('FIND_ALL_STUDENTS_ERROR');
            }
        });
    });
});
