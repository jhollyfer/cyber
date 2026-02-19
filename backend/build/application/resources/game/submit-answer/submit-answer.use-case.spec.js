import AnswerMemoryRepository from '@application/repositories/answer-repository/answer-memory.repository';
import GameSessionMemoryRepository from '@application/repositories/game-session-repository/game-session-memory.repository';
import ModuleMemoryRepository from '@application/repositories/module-repository/module-memory.repository';
import QuestionMemoryRepository from '@application/repositories/question-repository/question-memory.repository';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SubmitAnswerUseCase from './submit-answer.use-case';
let useCase;
let gameSessionRepository;
let moduleRepository;
let questionRepository;
let answerRepository;
describe('Submit Answer Use Case', () => {
    beforeEach(() => {
        gameSessionRepository = new GameSessionMemoryRepository();
        moduleRepository = new ModuleMemoryRepository();
        questionRepository = new QuestionMemoryRepository();
        answerRepository = new AnswerMemoryRepository();
        gameSessionRepository.setAnswersRef(answerRepository.answers);
        useCase = new SubmitAnswerUseCase(gameSessionRepository, moduleRepository, questionRepository, answerRepository);
    });
    describe('execute', () => {
        it('deve submeter uma resposta correta com sucesso', async () => {
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
            const question = await questionRepository.create({
                question: 'Pergunta 1?',
                options: ['A', 'B', 'C', 'D'],
                correct: 0,
                explanation: 'A opcao A e a correta',
                category: 'Seguranca',
                context: null,
                order: 1,
                active: true,
                module_id: module.id,
            });
            const result = await useCase.execute({
                session_id: session.id,
                user_id: 'user-123',
                question_id: question.id,
                selected_option: 0,
                time_spent: 15,
            });
            expect(result.isRight()).toBe(true);
            if (result.isRight()) {
                expect(result.value.is_correct).toBe(true);
                expect(result.value.correct_option).toBe(0);
                expect(result.value.explanation).toBe('A opcao A e a correta');
                expect(result.value.points).toBeGreaterThan(0);
            }
        });
        it('deve submeter uma resposta incorreta com sucesso', async () => {
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
            const question = await questionRepository.create({
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
                session_id: session.id,
                user_id: 'user-123',
                question_id: question.id,
                selected_option: 2,
                time_spent: 10,
            });
            expect(result.isRight()).toBe(true);
            if (result.isRight()) {
                expect(result.value.is_correct).toBe(false);
                expect(result.value.points).toBe(0);
                expect(result.value.streak).toBe(0);
            }
        });
        it('deve retornar erro 404 quando a sessao nao for encontrada', async () => {
            const result = await useCase.execute({
                session_id: 'non-existent-id',
                user_id: 'user-123',
                question_id: 'question-123',
                selected_option: 0,
                time_spent: 10,
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
                question_id: 'question-123',
                selected_option: 0,
                time_spent: 10,
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
                question_id: 'question-123',
                selected_option: 0,
                time_spent: 10,
            });
            expect(result.isLeft()).toBe(true);
            if (result.isLeft()) {
                expect(result.value.code).toBe(400);
                expect(result.value.cause).toBe('SESSION_ALREADY_FINISHED');
            }
        });
        it('deve retornar erro 404 quando a questao nao for encontrada', async () => {
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
                user_id: 'user-123',
                question_id: 'non-existent-question',
                selected_option: 0,
                time_spent: 10,
            });
            expect(result.isLeft()).toBe(true);
            if (result.isLeft()) {
                expect(result.value.code).toBe(404);
                expect(result.value.cause).toBe('QUESTION_NOT_FOUND');
            }
        });
        it('deve retornar erro 400 quando a questao nao pertence ao modulo da sessao', async () => {
            const module1 = await moduleRepository.create({
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
            const session = await gameSessionRepository.create({
                user_id: 'user-123',
                module_id: module1.id,
            });
            const question = await questionRepository.create({
                question: 'Pergunta do modulo 2?',
                options: ['A', 'B', 'C', 'D'],
                correct: 0,
                explanation: 'Explicacao',
                category: 'Privacidade',
                context: null,
                order: 1,
                active: true,
                module_id: module2.id,
            });
            const result = await useCase.execute({
                session_id: session.id,
                user_id: 'user-123',
                question_id: question.id,
                selected_option: 0,
                time_spent: 10,
            });
            expect(result.isLeft()).toBe(true);
            if (result.isLeft()) {
                expect(result.value.code).toBe(400);
                expect(result.value.cause).toBe('QUESTION_MODULE_MISMATCH');
            }
        });
        it('deve retornar erro 409 quando a questao ja foi respondida na sessao', async () => {
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
            const question = await questionRepository.create({
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
            // Primeira resposta
            await useCase.execute({
                session_id: session.id,
                user_id: 'user-123',
                question_id: question.id,
                selected_option: 0,
                time_spent: 10,
            });
            // Segunda resposta para mesma questao
            const result = await useCase.execute({
                session_id: session.id,
                user_id: 'user-123',
                question_id: question.id,
                selected_option: 1,
                time_spent: 10,
            });
            expect(result.isLeft()).toBe(true);
            if (result.isLeft()) {
                expect(result.value.code).toBe(409);
                expect(result.value.cause).toBe('ANSWER_ALREADY_EXISTS');
            }
        });
        it('deve retornar erro 500 quando ocorrer erro no repositorio', async () => {
            vi.spyOn(gameSessionRepository, 'findByIdWithAnswers').mockRejectedValue(new Error('Database error'));
            const result = await useCase.execute({
                session_id: 'any-id',
                user_id: 'user-123',
                question_id: 'question-123',
                selected_option: 0,
                time_spent: 10,
            });
            expect(result.isLeft()).toBe(true);
            if (result.isLeft()) {
                expect(result.value.code).toBe(500);
                expect(result.value.cause).toBe('SUBMIT_ANSWER_ERROR');
            }
        });
    });
});
