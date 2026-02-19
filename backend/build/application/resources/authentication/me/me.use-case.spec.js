import UserMemoryRepository from '@application/repositories/user-repository/user-memory.repository';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import MeUseCase from './me.use-case';
let useCase;
let userRepository;
describe('Me Use Case', () => {
    beforeEach(() => {
        userRepository = new UserMemoryRepository();
        useCase = new MeUseCase(userRepository);
    });
    describe('execute', () => {
        it('deve retornar o usuario autenticado com sucesso', async () => {
            const user = await userRepository.create({
                name: 'Test User',
                phone: '11999999999',
                password: 'hashed_password',
                role: 'STUDENT',
                active: true,
            });
            const result = await useCase.execute({ userId: user.id });
            expect(result.isRight()).toBe(true);
            if (result.isRight()) {
                expect(result.value.name).toBe(user.name);
                expect(result.value.phone).toBe(user.phone);
                expect(result.value).not.toHaveProperty('password', expect.any(String));
            }
        });
        it('deve retornar erro 404 quando o usuario nao for encontrado', async () => {
            const result = await useCase.execute({ userId: 'non-existent-id' });
            expect(result.isLeft()).toBe(true);
            if (result.isLeft()) {
                expect(result.value.code).toBe(404);
                expect(result.value.cause).toBe('USER_NOT_FOUND');
            }
        });
        it('deve retornar erro 500 quando ocorrer erro no repositorio', async () => {
            vi.spyOn(userRepository, 'findBy').mockRejectedValue(new Error('Database error'));
            const result = await useCase.execute({ userId: 'any-id' });
            expect(result.isLeft()).toBe(true);
            if (result.isLeft()) {
                expect(result.value.code).toBe(500);
                expect(result.value.cause).toBe('ME_ERROR');
            }
        });
    });
});
