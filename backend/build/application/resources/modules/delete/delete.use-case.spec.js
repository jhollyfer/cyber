import ModuleMemoryRepository from '@application/repositories/module-repository/module-memory.repository';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import DeleteModuleUseCase from './delete.use-case';
let useCase;
let moduleRepository;
describe('Delete Module Use Case', () => {
    beforeEach(() => {
        moduleRepository = new ModuleMemoryRepository();
        useCase = new DeleteModuleUseCase(moduleRepository);
    });
    describe('execute', () => {
        it('deve desativar um modulo com sucesso', async () => {
            const module = await moduleRepository.create({
                title: 'Modulo para deletar',
                description: 'Descricao',
                icon: 'shield',
                label: 'Seguranca',
                order: 1,
                time_per_question: 30,
                gradient: 'from-blue-500 to-blue-700',
                category_color: '#3B82F6',
                active: true,
            });
            const result = await useCase.execute({ id: module.id });
            expect(result.isRight()).toBe(true);
        });
        it('deve retornar erro 404 quando o modulo nao for encontrado', async () => {
            const result = await useCase.execute({ id: 'non-existent-id' });
            expect(result.isLeft()).toBe(true);
            if (result.isLeft()) {
                expect(result.value.code).toBe(404);
                expect(result.value.cause).toBe('MODULE_NOT_FOUND');
            }
        });
        it('deve retornar erro 500 quando ocorrer erro no repositorio', async () => {
            vi.spyOn(moduleRepository, 'findById').mockRejectedValue(new Error('Database error'));
            const result = await useCase.execute({ id: 'any-id' });
            expect(result.isLeft()).toBe(true);
            if (result.isLeft()) {
                expect(result.value.code).toBe(500);
                expect(result.value.cause).toBe('DELETE_MODULE_ERROR');
            }
        });
    });
});
