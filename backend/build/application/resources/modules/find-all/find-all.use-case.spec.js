import ModuleMemoryRepository from '@application/repositories/module-repository/module-memory.repository';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import FindAllModulesUseCase from './find-all.use-case';
let useCase;
let moduleRepository;
describe('Find All Modules Use Case', () => {
    beforeEach(() => {
        moduleRepository = new ModuleMemoryRepository();
        useCase = new FindAllModulesUseCase(moduleRepository);
    });
    describe('execute', () => {
        it('deve retornar todos os modulos com sucesso', async () => {
            await moduleRepository.create({
                title: 'Modulo 1',
                description: 'Descricao 1',
                icon: 'shield',
                label: 'Seguranca',
                order: 1,
                time_per_question: 30,
                gradient: 'from-blue-500 to-blue-700',
                category_color: '#3B82F6',
                active: true,
            });
            await moduleRepository.create({
                title: 'Modulo 2',
                description: 'Descricao 2',
                icon: 'lock',
                label: 'Privacidade',
                order: 2,
                time_per_question: 45,
                gradient: 'from-green-500 to-green-700',
                category_color: '#10B981',
                active: true,
            });
            const result = await useCase.execute();
            expect(result.isRight()).toBe(true);
            if (result.isRight()) {
                expect(result.value).toHaveLength(2);
                expect(result.value[0].title).toBe('Modulo 1');
                expect(result.value[1].title).toBe('Modulo 2');
            }
        });
        it('deve retornar lista vazia quando nao houver modulos', async () => {
            const result = await useCase.execute();
            expect(result.isRight()).toBe(true);
            if (result.isRight()) {
                expect(result.value).toHaveLength(0);
            }
        });
        it('deve retornar erro 500 quando ocorrer erro no repositorio', async () => {
            vi.spyOn(moduleRepository, 'findAll').mockRejectedValue(new Error('Database error'));
            const result = await useCase.execute();
            expect(result.isLeft()).toBe(true);
            if (result.isLeft()) {
                expect(result.value.code).toBe(500);
                expect(result.value.cause).toBe('FIND_ALL_MODULES_ERROR');
            }
        });
    });
});
