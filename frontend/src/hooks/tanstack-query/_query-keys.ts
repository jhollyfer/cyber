export const queryKeys = {
  auth: {
    all: () => ['auth'] as const,
    me: () => [...queryKeys.auth.all(), 'me'] as const,
  },
  modules: {
    all: () => ['modules'] as const,
    lists: () => [...queryKeys.modules.all(), 'list'] as const,
    list: (search?: Record<string, unknown>) =>
      [...queryKeys.modules.lists(), search ?? {}] as const,
    details: () => [...queryKeys.modules.all(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.modules.details(), id] as const,
  },
  questions: {
    all: () => ['questions'] as const,
    lists: () => [...queryKeys.questions.all(), 'list'] as const,
    byModule: (moduleId: string) =>
      [...queryKeys.questions.lists(), 'module', moduleId] as const,
  },
  game: {
    all: () => ['game'] as const,
    sessions: () => [...queryKeys.game.all(), 'session'] as const,
    session: (id: string) => [...queryKeys.game.sessions(), id] as const,
    bestSessions: () => [...queryKeys.game.all(), 'best-sessions'] as const,
    unfinishedSessions: () => [...queryKeys.game.all(), 'unfinished-sessions'] as const,
  },
  ranking: {
    all: () => ['ranking'] as const,
    list: () => [...queryKeys.ranking.all(), 'list'] as const,
  },
  stats: {
    all: () => ['stats'] as const,
    summary: () => [...queryKeys.stats.all(), 'summary'] as const,
    students: () => [...queryKeys.stats.all(), 'students'] as const,
  },
} as const;
