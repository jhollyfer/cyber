import GameSessionMemoryRepository from '@application/repositories/game-session-repository/game-session-memory.repository';
import ModuleMemoryRepository from '@application/repositories/module-repository/module-memory.repository';
import QuestionMemoryRepository from '@application/repositories/question-repository/question-memory.repository';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import StartSessionUseCase from './start-session.use-case';

let useCase: StartSessionUseCase;
let gameSessionRepository: GameSessionMemoryRepository;
let moduleRepository: ModuleMemoryRepository;
let questionRepository: QuestionMemoryRepository;

describe('Start Session Use Case', () => {
  beforeEach(() => {
    gameSessionRepository = new GameSessionMemoryRepository();
    moduleRepository = new ModuleMemoryRepository();
    questionRepository = new QuestionMemoryRepository();
    useCase = new StartSessionUseCase(
      gameSessionRepository as any,
      moduleRepository as any,
      questionRepository as any,
    );
  });

  describe('execute', () => {
    it('deve iniciar uma sessao de jogo com sucesso', async () => {
      const module = await moduleRepository.create({
        title: 'Modulo 1',
        description: 'Descricao',
        icon: 'shield',
        label: 'Seguranca',
        order: 1,
        time_per_question: 30,
        gradient: 'from-blue-500 to-blue-700',
        category_color: '#3B82F6',
        active: true,
      });

      await questionRepository.create({
        question: 'Pergunta 1?',
        options: ['A', 'B', 'C', 'D'],
        correct: 0,
        explanation: 'Explicacao',
        category: 'Seguranca',
        context: null,
        order: 1,
        active: true,
        module_id: module.id,
      });

      const result = await useCase.execute({
        module_id: module.id,
        user_id: 'user-123',
      });

      expect(result.isRight()).toBe(true);

      if (result.isRight()) {
        expect(result.value.session).toBeDefined();
        expect(result.value.session.module_id).toBe(module.id);
        expect(result.value.session.user_id).toBe('user-123');
        expect(result.value.questions).toHaveLength(1);
        expect((result.value.questions[0] as any).correct).toBeUndefined();
        expect((result.value.questions[0] as any).explanation).toBeUndefined();
      }
    });

    it('deve retornar erro 404 quando o modulo nao for encontrado', async () => {
      const result = await useCase.execute({
        module_id: 'non-existent-id',
        user_id: 'user-123',
      });

      expect(result.isLeft()).toBe(true);

      if (result.isLeft()) {
        expect(result.value.code).toBe(404);
        expect(result.value.cause).toBe('MODULE_NOT_FOUND');
      }
    });

    it('deve retornar erro 400 quando o modulo estiver inativo', async () => {
      const module = await moduleRepository.create({
        title: 'Modulo Inativo',
        description: 'Descricao',
        icon: 'shield',
        label: 'Seguranca',
        order: 1,
        time_per_question: 30,
        gradient: 'from-blue-500 to-blue-700',
        category_color: '#3B82F6',
        active: false,
      });

      const result = await useCase.execute({
        module_id: module.id,
        user_id: 'user-123',
      });

      expect(result.isLeft()).toBe(true);

      if (result.isLeft()) {
        expect(result.value.code).toBe(400);
        expect(result.value.cause).toBe('MODULE_NOT_ACTIVE');
      }
    });

    it('deve retornar erro 400 quando o modulo anterior nao foi completado', async () => {
      await moduleRepository.create({
        title: 'Modulo 1',
        description: 'Descricao',
        icon: 'shield',
        label: 'Seguranca',
        order: 1,
        time_per_question: 30,
        gradient: 'from-blue-500 to-blue-700',
        category_color: '#3B82F6',
        active: true,
      });

      const module2 = await moduleRepository.create({
        title: 'Modulo 2',
        description: 'Descricao 2',
        icon: 'lock',
        label: 'Privacidade',
        order: 2,
        time_per_question: 30,
        gradient: 'from-green-500 to-green-700',
        category_color: '#10B981',
        active: true,
      });

      const result = await useCase.execute({
        module_id: module2.id,
        user_id: 'user-123',
      });

      expect(result.isLeft()).toBe(true);

      if (result.isLeft()) {
        expect(result.value.code).toBe(400);
        expect(result.value.cause).toBe('PREVIOUS_MODULE_NOT_COMPLETED');
      }
    });

    it('deve retornar erro 500 quando ocorrer erro no repositorio', async () => {
      vi.spyOn(moduleRepository, 'findById').mockRejectedValue(
        new Error('Database error'),
      );

      const result = await useCase.execute({
        module_id: 'any-id',
        user_id: 'user-123',
      });

      expect(result.isLeft()).toBe(true);

      if (result.isLeft()) {
        expect(result.value.code).toBe(500);
        expect(result.value.cause).toBe('START_SESSION_ERROR');
      }
    });
  });
});
