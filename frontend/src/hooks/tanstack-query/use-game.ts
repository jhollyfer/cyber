import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { GameSession, SubmitAnswerResponse } from '@/lib/interfaces';
import { queryKeys } from './_query-keys';

export function useSession(sessionId: string) {
  return useQuery({
    queryKey: queryKeys.game.session(sessionId),
    queryFn: async () => {
      const { data } = await api.get<GameSession>(`/game/sessions/${sessionId}`);
      return data;
    },
    enabled: !!sessionId,
  });
}

export function useBestSessions(enabled = true) {
  return useQuery({
    queryKey: queryKeys.game.bestSessions(),
    queryFn: async () => {
      const { data } = await api.get<GameSession[]>('/game/sessions/best');
      return data;
    },
    enabled,
    retry: false,
  });
}

export function useStartSession() {
  return useMutation({
    mutationFn: async (moduleId: string) => {
      const { data } = await api.post('/game/sessions', { module_id: moduleId });
      return data;
    },
  });
}

export function useSubmitAnswer(sessionId: string) {
  return useMutation({
    mutationFn: async (payload: { question_id: string; selected_option: number }) => {
      const { data } = await api.post<SubmitAnswerResponse>(
        `/game/sessions/${sessionId}/answer`,
        payload,
      );
      return data;
    },
  });
}

export function useFinishSession(sessionId: string) {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post(`/game/sessions/${sessionId}/finish`);
      return data;
    },
  });
}
