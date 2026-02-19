import ModuleMemoryRepository from '@application/repositories/module-repository/module-memory.repository';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CreateModuleUseCase from './create.use-case';
let useCase;
let moduleRepository;
describe('Create Module Use Case', () => {
    beforeEach(() => {
        moduleRepository = new ModuleMemoryRepository();
        useCase = new CreateModuleUseCase(moduleRepository);
    });
    describe('execute', () => {
        it('deve criar um modulo com sucesso', async () => {
            const payload = {
                title: 'Modulo 1',
                description: 'Descricao do modulo',
                icon: 'shield',
                label: 'Seguranca',
                order: 1,
                time_per_question: 30,
                gradient: 'from-blue-500 to-blue-700',
                category_color: '#3B82F6',
            };
            const result = await useCase.execute(payload);
            expect(result.isRight()).toBe(true);
            if (result.isRight()) {
                expect(result.value.title).toBe(payload.title);
                expect(result.value.description).toBe(payload.description);
                expect(result.value.active).toBe(true);
                expect(result.value.id).toBeDefined();
            }
        });
        it('deve retornar erro 500 quando ocorrer erro no repositorio', async () => {
            vi.spyOn(moduleRepository, 'create').mockRejectedValue(new Error('Database error'));
            const result = await useCase.execute({
                title: 'Modulo 1',
                description: 'Descricao',
                icon: 'shield',
                label: 'Seguranca',
                order: 1,
                time_per_question: 30,
                gradient: 'from-blue-500 to-blue-700',
                category_color: '#3B82F6',
            });
            expect(result.isLeft()).toBe(true);
            if (result.isLeft()) {
                expect(result.value.code).toBe(500);
                expect(result.value.cause).toBe('CREATE_MODULE_ERROR');
            }
        });
    });
});
