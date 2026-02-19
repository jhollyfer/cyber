import UserMemoryRepository from '@application/repositories/user-repository/user-memory.repository';
import { hashPassword } from '@application/utils/password.utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SignInUseCase from './sign-in.use-case';
let useCase;
let userRepository;
describe('Sign In Use Case', () => {
    beforeEach(async () => {
        userRepository = new UserMemoryRepository();
        useCase = new SignInUseCase(userRepository);
    });
    describe('execute', () => {
        it('should sign in successfully with valid credentials', async () => {
            const user = {
                name: 'Test User',
                phone: '11999999999',
                password: 'Password1!',
                role: 'STUDENT',
                active: true,
            };
            const passwordHash = await hashPassword(user.password);
            await userRepository.create({
                ...user,
                password: passwordHash,
            });
            const result = await useCase.execute({
                phone: user.phone,
                password: user.password,
            });
            expect(result.isRight()).toBe(true);
            if (result.isRight()) {
                expect(result.value.phone).toBe(user.phone);
                expect(result.value.name).toBe(user.name);
            }
        });
        it('should return error when user not found', async () => {
            const result = await useCase.execute({
                phone: '11000000000',
                password: 'Password1!',
            });
            expect(result.isLeft()).toBe(true);
            if (result.isLeft()) {
                expect(result.value.code).toBe(401);
            }
        });
        it('should return error when password is incorrect', async () => {
            const user = {
                name: 'Test User',
                phone: '11999999999',
                password: 'Password1!',
                role: 'STUDENT',
                active: true,
            };
            const passwordHash = await hashPassword(user.password);
            await userRepository.create({
                ...user,
                password: passwordHash,
            });
            const result = await useCase.execute({
                phone: user.phone,
                password: 'WrongPass1!',
            });
            expect(result.isLeft()).toBe(true);
            if (result.isLeft()) {
                expect(result.value.code).toBe(401);
                expect(result.value.message).toBe('Credenciais invalidas');
            }
        });
        it('should return error when user is inactive', async () => {
            const user = {
                name: 'Inactive User',
                phone: '11888888888',
                password: 'Password1!',
                role: 'STUDENT',
                active: false,
            };
            const passwordHash = await hashPassword(user.password);
            await userRepository.create({
                ...user,
                password: passwordHash,
            });
            const result = await useCase.execute({
                phone: user.phone,
                password: user.password,
            });
            expect(result.isLeft()).toBe(true);
            if (result.isLeft()) {
                expect(result.value.code).toBe(401);
            }
        });
        it('should handle repository errors gracefully', async () => {
            vi.spyOn(userRepository, 'findBy').mockRejectedValue(new Error('Database error'));
            const result = await useCase.execute({
                phone: '11999999999',
                password: 'Password1!',
            });
            expect(result.isLeft()).toBe(true);
            if (result.isLeft()) {
                expect(result.value.code).toBe(500);
                expect(result.value.cause).toBe('SIGN_IN_ERROR');
            }
        });
        it('should sign in successfully as ADMINISTRATOR', async () => {
            const user = {
                name: 'Admin User',
                phone: '11777777777',
                password: 'Admin123!',
                role: 'ADMINISTRATOR',
                active: true,
            };
            const passwordHash = await hashPassword(user.password);
            await userRepository.create({
                ...user,
                password: passwordHash,
            });
            const result = await useCase.execute({
                phone: user.phone,
                password: user.password,
            });
            expect(result.isRight()).toBe(true);
            if (result.isRight()) {
                expect(result.value.phone).toBe(user.phone);
                expect(result.value.role).toBe('ADMINISTRATOR');
            }
        });
    });
});
