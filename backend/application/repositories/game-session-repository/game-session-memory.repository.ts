import crypto from 'node:crypto';

import type { IAnswer, IGameSession } from '@application/core/entities';

import {
  GameSessionContractRepository,
  type GameSessionCreatePayload,
  type GameSessionUpdatePayload,
} from './game-session-contract.repository';

export default class GameSessionMemoryRepository extends GameSessionContractRepository {
  private sessions: IGameSession[] = [];
  private answers: IAnswer[] = [];

  reset(): void {
    this.sessions = [];
    this.answers = [];
  }

  /**
   * Allows injecting a reference to the same answers array used by
   * AnswerMemoryRepository so that `findByIdWithAnswers` works correctly
   * when both repositories are used together in tests.
   */
  setAnswersRef(answers: IAnswer[]): void {
    this.answers = answers;
  }

  async create(payload: GameSessionCreatePayload): Promise<IGameSession> {
    const now = new Date();
    const session: IGameSession = {
      id: crypto.randomUUID(),
      score: 0,
      correct_answers: 0,
      total_answered: 0,
      streak: 0,
      max_streak: 0,
      nota: null,
      finished: false,
      is_best: false,
      finished_at: null,
      created_at: now,
      updated_at: now,
      ...payload,
    };
    this.sessions.push(session);
    return session;
  }

  async update({ id, ...payload }: GameSessionUpdatePayload): Promise<IGameSession> {
    const index = this.sessions.findIndex((s) => s.id === id);
    if (index === -1) throw new Error(`GameSession with id "${id}" not found`);

    const updated: IGameSession = {
      ...this.sessions[index],
      ...payload,
      updated_at: new Date(),
    };
    this.sessions[index] = updated;
    return updated;
  }

  async findById(id: string): Promise<IGameSession | null> {
    return this.sessions.find((s) => s.id === id) ?? null;
  }

  async findByIdWithAnswers(
    id: string,
  ): Promise<(IGameSession & { answers: { question_id: string }[] }) | null> {
    const session = this.sessions.find((s) => s.id === id);
    if (!session) return null;

    const sessionAnswers = this.answers
      .filter((a) => a.session_id === id)
      .map((a) => ({ question_id: a.question_id }));

    return { ...session, answers: sessionAnswers };
  }

  async findBestByUserAndModule(userId: string, moduleId: string): Promise<IGameSession | null> {
    return (
      this.sessions.find(
        (s) =>
          s.user_id === userId &&
          s.module_id === moduleId &&
          s.is_best === true &&
          s.finished === true,
      ) ?? null
    );
  }

  async findByUserAndModule(userId: string, moduleId: string): Promise<IGameSession[]> {
    return this.sessions
      .filter(
        (s) => s.user_id === userId && s.module_id === moduleId && s.finished === true,
      )
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
  }

  async clearBestFlag(userId: string, moduleId: string): Promise<void> {
    for (const session of this.sessions) {
      if (session.user_id === userId && session.module_id === moduleId && session.is_best) {
        session.is_best = false;
      }
    }
  }

  async findBestSessionsByUser(userId: string): Promise<IGameSession[]> {
    return this.sessions.filter(
      (s) => s.user_id === userId && s.is_best === true && s.finished === true,
    );
  }
}
