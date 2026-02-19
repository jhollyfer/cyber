import QuestionMemoryRepository from '@application/repositories/question-repository/question-memory.repository';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import DeleteQuestionUseCase from './delete.use-case';

let useCase: DeleteQuestionUseCase;
let questionRepository: QuestionMemoryRepository;

describe('Delete Question Use Case', () => {
  beforeEach(() => {
    questionRepository = new QuestionMemoryRepository();
    useCase = new DeleteQuestionUseCase(questionRepository as any);
  });

  describe('execute', () => {
    it('deve desativar uma questao com sucesso', async () => {
      const question = await questionRepository.create({
        question: 'Pergunta para deletar?',
        options: ['A', 'B', 'C', 'D'],
        correct: 0,
        explanation: 'Explicacao',
        category: 'Seguranca',
        context: null,
        order: 1,
        active: true,
        module_id: 'module-123',
      });

      const result = await useCase.execute({ id: question.id });

      expect(result.isRight()).toBe(true);
    });

    it('deve retornar erro 404 quando a questao nao for encontrada', async () => {
      const result = await useCase.execute({ id: 'non-existent-id' });

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

      const result = await useCase.execute({ id: 'any-id' });

      expect(result.isLeft()).toBe(true);

      if (result.isLeft()) {
        expect(result.value.code).toBe(500);
        expect(result.value.cause).toBe('DELETE_QUESTION_ERROR');
      }
    });
  });
});
