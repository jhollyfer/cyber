import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { kernel } from '@start/kernel';
describe('SignUpController (POST /authentication/sign-up)', () => {
    beforeAll(async () => {
        await kernel.ready();
    });
    afterAll(async () => {
        await kernel.close();
    });
    const validPayload = {
        name: 'Usuario Teste',
        phone: '11999990001',
        password: 'Senha@123',
    };
    describe('Cadastro com sucesso', () => {
        it('deve cadastrar um novo usuario e retornar 201 com dados do usuario', async () => {
            const response = await request(kernel.server)
                .post('/authentication/sign-up')
                .send(validPayload);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('name', validPayload.name);
            expect(response.body).toHaveProperty('phone', validPayload.phone);
            expect(response.body).toHaveProperty('role', 'STUDENT');
            expect(response.body).toHaveProperty('active', true);
            expect(response.body).toHaveProperty('created_at');
            expect(response.body).toHaveProperty('updated_at');
            expect(response.body).not.toHaveProperty('password');
        });
        it('deve definir cookies httpOnly de autenticacao ao cadastrar', async () => {
            const payload = {
                name: 'Usuario Cookies',
                phone: '11999990002',
                password: 'Senha@123',
            };
            const response = await request(kernel.server)
                .post('/authentication/sign-up')
                .send(payload);
            expect(response.status).toBe(201);
            const cookies = response.headers['set-cookie'];
            expect(cookies).toBeDefined();
            const cookieString = Array.isArray(cookies) ? cookies.join('; ') : cookies;
            expect(cookieString).toContain('accessToken');
            expect(cookieString).toContain('refreshToken');
        });
    });
    describe('Telefone duplicado', () => {
        it('deve retornar 409 ao tentar cadastrar com telefone ja existente', async () => {
            const payload = {
                name: 'Usuario Duplicado',
                phone: '11999990003',
                password: 'Senha@123',
            };
            // Primeiro cadastro deve funcionar
            const firstResponse = await request(kernel.server)
                .post('/authentication/sign-up')
                .send(payload);
            expect(firstResponse.status).toBe(201);
            // Segundo cadastro com mesmo telefone deve falhar
            const secondResponse = await request(kernel.server)
                .post('/authentication/sign-up')
                .send({
                name: 'Outro Nome',
                phone: '11999990003',
                password: 'Senha@456!',
            });
            expect(secondResponse.status).toBe(409);
            expect(secondResponse.body).toHaveProperty('message', 'User already exists');
            expect(secondResponse.body).toHaveProperty('code', 409);
            expect(secondResponse.body).toHaveProperty('cause', 'USER_ALREADY_EXISTS');
        });
    });
    describe('Erros de validacao', () => {
        it('deve retornar 400 quando o body estiver vazio', async () => {
            const response = await request(kernel.server)
                .post('/authentication/sign-up')
                .send({});
            expect(response.status).toBe(400);
        });
        it('deve retornar 400 quando o nome estiver ausente', async () => {
            const response = await request(kernel.server)
                .post('/authentication/sign-up')
                .send({
                phone: '11999990004',
                password: 'Senha@123',
            });
            expect(response.status).toBe(400);
        });
        it('deve retornar 400 quando o telefone estiver ausente', async () => {
            const response = await request(kernel.server)
                .post('/authentication/sign-up')
                .send({
                name: 'Usuario Sem Telefone',
                password: 'Senha@123',
            });
            expect(response.status).toBe(400);
        });
        it('deve retornar 400 quando a senha estiver ausente', async () => {
            const response = await request(kernel.server)
                .post('/authentication/sign-up')
                .send({
                name: 'Usuario Sem Senha',
                phone: '11999990005',
            });
            expect(response.status).toBe(400);
        });
        it('deve retornar 400 quando o nome tiver menos de 2 caracteres', async () => {
            const response = await request(kernel.server)
                .post('/authentication/sign-up')
                .send({
                name: 'A',
                phone: '11999990006',
                password: 'Senha@123',
            });
            expect(response.status).toBe(400);
        });
        it('deve retornar 400 quando o telefone nao tiver 11 digitos', async () => {
            const response = await request(kernel.server)
                .post('/authentication/sign-up')
                .send({
                name: 'Usuario Telefone Curto',
                phone: '1199999',
                password: 'Senha@123',
            });
            expect(response.status).toBe(400);
        });
        it('deve retornar 400 quando a senha nao atender requisitos de complexidade', async () => {
            const response = await request(kernel.server)
                .post('/authentication/sign-up')
                .send({
                name: 'Usuario Senha Fraca',
                phone: '11999990007',
                password: 'senhasimples',
            });
            expect(response.status).toBe(400);
        });
        it('deve retornar 400 quando a senha tiver menos de 6 caracteres', async () => {
            const response = await request(kernel.server)
                .post('/authentication/sign-up')
                .send({
                name: 'Usuario Senha Curta',
                phone: '11999990008',
                password: 'Ab1!',
            });
            expect(response.status).toBe(400);
        });
        it('deve retornar 400 quando a senha nao tiver letra maiuscula', async () => {
            const response = await request(kernel.server)
                .post('/authentication/sign-up')
                .send({
                name: 'Usuario Sem Maiuscula',
                phone: '11999990009',
                password: 'senha@123',
            });
            expect(response.status).toBe(400);
        });
        it('deve retornar 400 quando a senha nao tiver caractere especial', async () => {
            const response = await request(kernel.server)
                .post('/authentication/sign-up')
                .send({
                name: 'Usuario Sem Especial',
                phone: '11999990010',
                password: 'Senha1234',
            });
            expect(response.status).toBe(400);
        });
    });
});
