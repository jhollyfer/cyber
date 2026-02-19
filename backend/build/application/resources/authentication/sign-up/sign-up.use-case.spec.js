import UserMemoryRepository from '@application/repositories/user-repository/user-memory.repository';
import { hashPassword } from '@application/utils/password.utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SignUpUseCase from './sign-up.use-case';
let useCase;
let userRepository;
describe('Sign Up Use Case', () => {
    beforeEach(() => {
        userRepository = new UserMemoryRepository();
        useCase = new SignUpUseCase(userRepository);
    });
    describe('execute', () => {
        it('deve cadastrar um novo usuario com sucesso', async () => {
            const payload = {
                name: 'Novo Usuario',
                phone: '11999999999',
                password: 'Password1!',
            };
            const result = await useCase.execute(payload);
            expect(result.isRight()).toBe(true);
            if (result.isRight()) {
                expect(result.value.name).toBe(payload.name);
                expect(result.value.phone).toBe(payload.phone);
                expect('password' in result.value).toBe(false);
            }
        });
        it('deve retornar erro 409 quando o usuario ja existe', async () => {
            const user = {
                name: 'Usuario Existente',
                phone: '11999999999',
                password: await hashPassword('Password1!'),
                role: 'STUDENT',
                active: true,
            };
            await userRepository.create(user);
            const result = await useCase.execute({
                name: 'Outro Usuario',
                phone: '11999999999',
                password: 'Password1!',
            });
            expect(result.isLeft()).toBe(true);
            if (result.isLeft()) {
                expect(result.value.code).toBe(409);
                expect(result.value.cause).toBe('USER_ALREADY_EXISTS');
            }
        });
        it('deve retornar erro 500 quando ocorrer erro no repositorio', async () => {
            vi.spyOn(userRepository, 'findBy').mockRejectedValue(new Error('Database error'));
            const result = await useCase.execute({
                name: 'Test User',
                phone: '11999999999',
                password: 'Password1!',
            });
            expect(result.isLeft()).toBe(true);
            if (result.isLeft()) {
                expect(result.value.code).toBe(500);
                expect(result.value.cause).toBe('SIGN_UP_ERROR');
            }
        });
    });
});
