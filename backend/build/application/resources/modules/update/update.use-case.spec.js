import ModuleMemoryRepository from '@application/repositories/module-repository/module-memory.repository';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import UpdateModuleUseCase from './update.use-case';
let useCase;
let moduleRepository;
describe('Update Module Use Case', () => {
    beforeEach(() => {
        moduleRepository = new ModuleMemoryRepository();
        useCase = new UpdateModuleUseCase(moduleRepository);
    });
    describe('execute', () => {
        it('deve atualizar um modulo com sucesso', async () => {
            const module = await moduleRepository.create({
                title: 'Modulo Original',
                description: 'Descricao original',
                icon: 'shield',
                label: 'Seguranca',
                order: 1,
                time_per_question: 30,
                gradient: 'from-blue-500 to-blue-700',
                category_color: '#3B82F6',
                active: true,
            });
            const result = await useCase.execute({
                id: module.id,
                title: 'Modulo Atualizado',
                description: 'Descricao atualizada',
            });
            expect(result.isRight()).toBe(true);
            if (result.isRight()) {
                expect(result.value.title).toBe('Modulo Atualizado');
                expect(result.value.description).toBe('Descricao atualizada');
            }
        });
        it('deve retornar erro 404 quando o modulo nao for encontrado', async () => {
            const result = await useCase.execute({
                id: 'non-existent-id',
                title: 'Novo Titulo',
            });
            expect(result.isLeft()).toBe(true);
            if (result.isLeft()) {
                expect(result.value.code).toBe(404);
                expect(result.value.cause).toBe('MODULE_NOT_FOUND');
            }
        });
        it('deve retornar erro 500 quando ocorrer erro no repositorio', async () => {
            vi.spyOn(moduleRepository, 'findById').mockRejectedValue(new Error('Database error'));
            const result = await useCase.execute({
                id: 'any-id',
                title: 'Novo Titulo',
            });
            expect(result.isLeft()).toBe(true);
            if (result.isLeft()) {
                expect(result.value.code).toBe(500);
                expect(result.value.cause).toBe('UPDATE_MODULE_ERROR');
            }
        });
    });
});
