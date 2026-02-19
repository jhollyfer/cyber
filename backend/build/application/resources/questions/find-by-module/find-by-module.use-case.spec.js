import QuestionMemoryRepository from '@application/repositories/question-repository/question-memory.repository';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import FindByModuleUseCase from './find-by-module.use-case';
let useCase;
let questionRepository;
describe('Find By Module Use Case', () => {
    beforeEach(() => {
        questionRepository = new QuestionMemoryRepository();
        useCase = new FindByModuleUseCase(questionRepository);
    });
    describe('execute', () => {
        it('deve retornar questoes de um modulo com sucesso', async () => {
            const moduleId = 'module-123';
            await questionRepository.create({
                question: 'Pergunta 1?',
                options: ['A', 'B', 'C', 'D'],
                correct: 0,
                explanation: 'Explicacao 1',
                category: 'Seguranca',
                context: null,
                order: 1,
                active: true,
                module_id: moduleId,
            });
            await questionRepository.create({
                question: 'Pergunta 2?',
                options: ['A', 'B', 'C', 'D'],
                correct: 1,
                explanation: 'Explicacao 2',
                category: 'Seguranca',
                context: null,
                order: 2,
                active: true,
                module_id: moduleId,
            });
            const result = await useCase.execute({ moduleId });
            expect(result.isRight()).toBe(true);
            if (result.isRight()) {
                expect(result.value).toHaveLength(2);
                expect(result.value[0].question).toBe('Pergunta 1?');
                expect(result.value[1].question).toBe('Pergunta 2?');
            }
        });
        it('deve retornar lista vazia quando nao houver questoes', async () => {
            const result = await useCase.execute({ moduleId: 'non-existent-module' });
            expect(result.isRight()).toBe(true);
            if (result.isRight()) {
                expect(result.value).toHaveLength(0);
            }
        });
        it('deve retornar erro 500 quando ocorrer erro no repositorio', async () => {
            vi.spyOn(questionRepository, 'findByModuleId').mockRejectedValue(new Error('Database error'));
            const result = await useCase.execute({ moduleId: 'any-id' });
            expect(result.isLeft()).toBe(true);
            if (result.isLeft()) {
                expect(result.value.code).toBe(500);
                expect(result.value.cause).toBe('FIND_BY_MODULE_ERROR');
            }
        });
    });
});
