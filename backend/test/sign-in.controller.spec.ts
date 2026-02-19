import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { kernel } from '@start/kernel';

describe('SignInController (POST /authentication/sign-in)', () => {
  const testUser = {
    name: 'Usuario Login Teste',
    phone: '11988880001',
    password: 'Login@123',
  };

  beforeAll(async () => {
    await kernel.ready();

    // Criar usuario para os testes de sign-in
    await request(kernel.server)
      .post('/authentication/sign-up')
      .send(testUser);
  });

  afterAll(async () => {
    await kernel.close();
  });

  describe('Login com sucesso', () => {
    it('deve autenticar o usuario e retornar 200', async () => {
      const response = await request(kernel.server)
        .post('/authentication/sign-in')
        .send({
          phone: testUser.phone,
          password: testUser.password,
        });

      expect(response.status).toBe(200);
    });

    it('deve definir cookies httpOnly de autenticacao ao fazer login', async () => {
      const response = await request(kernel.server)
        .post('/authentication/sign-in')
        .send({
          phone: testUser.phone,
          password: testUser.password,
        });

      expect(response.status).toBe(200);

      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();

      const cookieString = Array.isArray(cookies) ? cookies.join('; ') : cookies;
      expect(cookieString).toContain('accessToken');
      expect(cookieString).toContain('refreshToken');
    });

    it('deve aceitar telefone com mascara e autenticar normalmente', async () => {
      const response = await request(kernel.server)
        .post('/authentication/sign-in')
        .send({
          phone: '(11) 98888-0001',
          password: testUser.password,
        });

      expect(response.status).toBe(200);
    });
  });

  describe('Credenciais invalidas', () => {
    it('deve retornar 401 quando o telefone nao existir', async () => {
      const response = await request(kernel.server)
        .post('/authentication/sign-in')
        .send({
          phone: '11900000000',
          password: 'Qualquer@1',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Credenciais invalidas');
      expect(response.body).toHaveProperty('code', 401);
    });

    it('deve retornar 401 quando a senha estiver incorreta', async () => {
      const response = await request(kernel.server)
        .post('/authentication/sign-in')
        .send({
          phone: testUser.phone,
          password: 'SenhaErrada@1',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Credenciais invalidas');
      expect(response.body).toHaveProperty('code', 401);
    });
  });

  describe('Erros de validacao', () => {
    it('deve retornar 400 quando o body estiver vazio', async () => {
      const response = await request(kernel.server)
        .post('/authentication/sign-in')
        .send({});

      expect(response.status).toBe(400);
    });

    it('deve retornar 400 quando o telefone estiver ausente', async () => {
      const response = await request(kernel.server)
        .post('/authentication/sign-in')
        .send({
          password: 'Login@123',
        });

      expect(response.status).toBe(400);
    });

    it('deve retornar 400 quando a senha estiver ausente', async () => {
      const response = await request(kernel.server)
        .post('/authentication/sign-in')
        .send({
          phone: '11988880001',
        });

      expect(response.status).toBe(400);
    });

    it('deve retornar 400 quando o telefone tiver menos de 10 digitos', async () => {
      const response = await request(kernel.server)
        .post('/authentication/sign-in')
        .send({
          phone: '1199999',
          password: 'Login@123',
        });

      expect(response.status).toBe(400);
    });
  });
});
