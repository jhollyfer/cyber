import GameSessionMemoryRepository from '@application/repositories/game-session-repository/game-session-memory.repository';
import ModuleMemoryRepository from '@application/repositories/module-repository/module-memory.repository';
import QuestionMemoryRepository from '@application/repositories/question-repository/question-memory.repository';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import FinishSessionUseCase from './finish-session.use-case';

let useCase: FinishSessionUseCase;
let gameSessionRepository: GameSessionMemoryRepository;
let questionRepository: QuestionMemoryRepository;
let moduleRepository: ModuleMemoryRepository;

describe('Finish Session Use Case', () => {
  beforeEach(() => {
    gameSessionRepository = new GameSessionMemoryRepository();
    questionRepository = new QuestionMemoryRepository();
    moduleRepository = new ModuleMemoryRepository();
    useCase = new FinishSessionUseCase(
      gameSessionRepository as any,
      questionRepository as any,
      moduleRepository as any,
    );
  });

  describe('execute', () => {
    it('deve finalizar uma sessao com sucesso', async () => {
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

      const session = await gameSessionRepository.create({
        user_id: 'user-123',
        module_id: module.id,
      });

      await gameSessionRepository.update({
        id: session.id,
        correct_answers: 1,
        total_answered: 1,
      });

      const result = await useCase.execute({
        session_id: session.id,
        user_id: 'user-123',
      });

      expect(result.isRight()).toBe(true);

      if (result.isRight()) {
        expect(result.value.finished).toBe(true);
        expect(result.value.nota).toBeDefined();
        expect(result.value.is_best).toBe(true);
      }
    });

    it('deve retornar erro 404 quando a sessao nao for encontrada', async () => {
      const result = await useCase.execute({
        session_id: 'non-existent-id',
        user_id: 'user-123',
      });

      expect(result.isLeft()).toBe(true);

      if (result.isLeft()) {
        expect(result.value.code).toBe(404);
        expect(result.value.cause).toBe('SESSION_NOT_FOUND');
      }
    });

    it('deve retornar erro 403 quando o usuario nao for dono da sessao', async () => {
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

      const session = await gameSessionRepository.create({
        user_id: 'user-123',
        module_id: module.id,
      });

      const result = await useCase.execute({
        session_id: session.id,
        user_id: 'another-user',
      });

      expect(result.isLeft()).toBe(true);

      if (result.isLeft()) {
        expect(result.value.code).toBe(403);
        expect(result.value.cause).toBe('SESSION_OWNERSHIP_ERROR');
      }
    });

    it('deve retornar erro 400 quando a sessao ja estiver finalizada', async () => {
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

      const session = await gameSessionRepository.create({
        user_id: 'user-123',
        module_id: module.id,
      });

      await gameSessionRepository.update({
        id: session.id,
        finished: true,
      });

      const result = await useCase.execute({
        session_id: session.id,
        user_id: 'user-123',
      });

      expect(result.isLeft()).toBe(true);

      if (result.isLeft()) {
        expect(result.value.code).toBe(400);
        expect(result.value.cause).toBe('SESSION_ALREADY_FINISHED');
      }
    });

    it('deve retornar erro 500 quando ocorrer erro no repositorio', async () => {
      vi.spyOn(gameSessionRepository, 'findById').mockRejectedValue(
        new Error('Database error'),
      );

      const result = await useCase.execute({
        session_id: 'any-id',
        user_id: 'user-123',
      });

      expect(result.isLeft()).toBe(true);

      if (result.isLeft()) {
        expect(result.value.code).toBe(500);
        expect(result.value.cause).toBe('FINISH_SESSION_ERROR');
      }
    });
  });
});
