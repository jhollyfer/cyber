import QuestionMemoryRepository from '@application/repositories/question-repository/question-memory.repository';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import CreateQuestionUseCase from './create.use-case';

let useCase: CreateQuestionUseCase;
let questionRepository: QuestionMemoryRepository;

describe('Create Question Use Case', () => {
  beforeEach(() => {
    questionRepository = new QuestionMemoryRepository();
    useCase = new CreateQuestionUseCase(questionRepository as any);
  });

  describe('execute', () => {
    it('deve criar uma questao com sucesso', async () => {
      const payload = {
        question: 'Qual e a melhor pratica de seguranca?',
        options: ['Opcao A', 'Opcao B', 'Opcao C', 'Opcao D'],
        correct: 0,
        explanation: 'A opcao A e a correta porque...',
        category: 'Seguranca',
        context: 'Contexto da questao',
        order: 1,
        module_id: 'module-123',
      };

      const result = await useCase.execute(payload);

      expect(result.isRight()).toBe(true);

      if (result.isRight()) {
        expect(result.value.question).toBe(payload.question);
        expect(result.value.options).toEqual(payload.options);
        expect(result.value.correct).toBe(payload.correct);
        expect(result.value.module_id).toBe(payload.module_id);
        expect(result.value.active).toBe(true);
        expect(result.value.id).toBeDefined();
      }
    });

    it('deve criar uma questao sem contexto', async () => {
      const payload = {
        question: 'Pergunta sem contexto?',
        options: ['A', 'B', 'C', 'D'],
        correct: 2,
        explanation: 'Explicacao',
        category: 'Privacidade',
        context: null,
        order: 1,
        module_id: 'module-123',
      };

      const result = await useCase.execute(payload);

      expect(result.isRight()).toBe(true);

      if (result.isRight()) {
        expect(result.value.context).toBeNull();
      }
    });

    it('deve retornar erro 500 quando ocorrer erro no repositorio', async () => {
      vi.spyOn(questionRepository, 'create').mockRejectedValue(
        new Error('Database error'),
      );

      const result = await useCase.execute({
        question: 'Pergunta?',
        options: ['A', 'B', 'C', 'D'],
        correct: 0,
        explanation: 'Explicacao',
        category: 'Seguranca',
        context: null,
        order: 1,
        module_id: 'module-123',
      });

      expect(result.isLeft()).toBe(true);

      if (result.isLeft()) {
        expect(result.value.code).toBe(500);
        expect(result.value.cause).toBe('CREATE_QUESTION_ERROR');
      }
    });
  });
});
