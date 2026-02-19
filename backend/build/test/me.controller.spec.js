import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { kernel } from '@start/kernel';
describe('MeController (GET /authentication/me)', () => {
    const testUser = {
        name: 'Usuario Me Teste',
        phone: '11977770001',
        password: 'MeTest@123',
    };
    let accessTokenCookie;
    beforeAll(async () => {
        await kernel.ready();
        // Criar usuario e obter o cookie de autenticacao
        const signUpResponse = await request(kernel.server)
            .post('/authentication/sign-up')
            .send(testUser);
        expect(signUpResponse.status).toBe(201);
        const cookies = signUpResponse.headers['set-cookie'];
        const cookieArray = Array.isArray(cookies) ? cookies : [cookies];
        const accessCookie = cookieArray.find((c) => c.startsWith('accessToken='));
        expect(accessCookie).toBeDefined();
        accessTokenCookie = accessCookie;
    });
    afterAll(async () => {
        await kernel.close();
    });
    describe('Usuario autenticado', () => {
        it('deve retornar 200 com os dados do usuario autenticado', async () => {
            const response = await request(kernel.server)
                .get('/authentication/me')
                .set('Cookie', accessTokenCookie);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('name', testUser.name);
            expect(response.body).toHaveProperty('phone', testUser.phone);
            expect(response.body).toHaveProperty('role', 'STUDENT');
            expect(response.body).toHaveProperty('active', true);
            expect(response.body).toHaveProperty('created_at');
            expect(response.body).toHaveProperty('updated_at');
            expect(response.body).not.toHaveProperty('password');
        });
        it('deve retornar os mesmos dados do usuario que foi cadastrado', async () => {
            const response = await request(kernel.server)
                .get('/authentication/me')
                .set('Cookie', accessTokenCookie);
            expect(response.status).toBe(200);
            expect(response.body.name).toBe(testUser.name);
            expect(response.body.phone).toBe(testUser.phone);
            expect(response.body.role).toBe('STUDENT');
        });
    });
    describe('Usuario nao autenticado', () => {
        it('deve retornar 401 quando nenhum cookie for enviado', async () => {
            const response = await request(kernel.server)
                .get('/authentication/me');
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'Authentication required');
            expect(response.body).toHaveProperty('code', 401);
            expect(response.body).toHaveProperty('cause', 'AUTHENTICATION_REQUIRED');
        });
        it('deve retornar 401 quando o cookie accessToken for invalido', async () => {
            const response = await request(kernel.server)
                .get('/authentication/me')
                .set('Cookie', 'accessToken=token-invalido-qualquer');
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'Authentication required');
            expect(response.body).toHaveProperty('code', 401);
            expect(response.body).toHaveProperty('cause', 'AUTHENTICATION_REQUIRED');
        });
        it('deve retornar 401 quando o cookie tiver nome diferente de accessToken', async () => {
            const response = await request(kernel.server)
                .get('/authentication/me')
                .set('Cookie', 'outroToken=algum-valor');
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('code', 401);
            expect(response.body).toHaveProperty('cause', 'AUTHENTICATION_REQUIRED');
        });
    });
});
