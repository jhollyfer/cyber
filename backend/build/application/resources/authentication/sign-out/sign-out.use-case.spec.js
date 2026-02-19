import { beforeEach, describe, expect, it, vi } from 'vitest';
import SignOutUseCase from './sign-out.use-case';
vi.mock('@application/utils/cookies.utils', () => ({
    clearCookieTokens: vi.fn(),
}));
let useCase;
describe('Sign Out Use Case', () => {
    beforeEach(() => {
        useCase = new SignOutUseCase();
    });
    describe('execute', () => {
        it('deve realizar logout com sucesso', async () => {
            const mockResponse = {
                clearCookie: vi.fn().mockReturnThis(),
            };
            const result = await useCase.execute(mockResponse);
            expect(result.isRight()).toBe(true);
        });
    });
});
