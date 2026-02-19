import RankingMemoryRepository from '@application/repositories/ranking-repository/ranking-memory.repository';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import FindAllRankingUseCase from './find-all.use-case';
let useCase;
let rankingRepository;
describe('Find All Ranking Use Case', () => {
    beforeEach(() => {
        rankingRepository = new RankingMemoryRepository();
        useCase = new FindAllRankingUseCase(rankingRepository);
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
                expect(result.value[0].average_nota).toBeGreaterThan(result.value[1].average_nota);
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
            vi.spyOn(rankingRepository, 'findStudentsWithBestSessions').mockRejectedValue(new Error('Database error'));
            const result = await useCase.execute();
            expect(result.isLeft()).toBe(true);
            if (result.isLeft()) {
                expect(result.value.code).toBe(500);
                expect(result.value.cause).toBe('FIND_ALL_RANKING_ERROR');
            }
        });
    });
});
