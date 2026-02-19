import QuestionMemoryRepository from '@application/repositories/question-repository/question-memory.repository';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import UpdateQuestionUseCase from './update.use-case';

let useCase: UpdateQuestionUseCase;
let questionRepository: QuestionMemoryRepository;

describe('Update Question Use Case', () => {
  beforeEach(() => {
    questionRepository = new QuestionMemoryRepository();
    useCase = new UpdateQuestionUseCase(questionRepository as any);
  });

  describe('execute', () => {
    it('deve atualizar uma questao com sucesso', async () => {
      const question = await questionRepository.create({
        question: 'Pergunta original?',
        options: ['A', 'B', 'C', 'D'],
        correct: 0,
        explanation: 'Explicacao original',
        category: 'Seguranca',
        context: null,
        order: 1,
        active: true,
        module_id: 'module-123',
      });

      const result = await useCase.execute({
        id: question.id,
        question: 'Pergunta atualizada?',
        explanation: 'Explicacao atualizada',
      });

      expect(result.isRight()).toBe(true);

      if (result.isRight()) {
        expect(result.value.question).toBe('Pergunta atualizada?');
        expect(result.value.explanation).toBe('Explicacao atualizada');
      }
    });

    it('deve retornar erro 404 quando a questao nao for encontrada', async () => {
      const result = await useCase.execute({
        id: 'non-existent-id',
        question: 'Nova pergunta?',
      });

      expect(result.isLeft()).toBe(true);

      if (result.isLeft()) {
        expect(result.value.code).toBe(404);
        expect(result.value.cause).toBe('QUESTION_NOT_FOUND');
      }
    });

    it('deve retornar erro 500 quando ocorrer erro no repositorio', async () => {
      vi.spyOn(questionRepository, 'findById').mockRejectedValue(
        new Error('Database error'),
      );

      const result = await useCase.execute({
        id: 'any-id',
        question: 'Nova pergunta?',
      });

      expect(result.isLeft()).toBe(true);

      if (result.isLeft()) {
        expect(result.value.code).toBe(500);
        expect(result.value.cause).toBe('UPDATE_QUESTION_ERROR');
      }
    });
  });
});
