import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { RankingEntry } from '@/lib/interfaces';
import { queryKeys } from './_query-keys';

export function useRanking() {
  return useQuery({
    queryKey: queryKeys.ranking.all(),
    queryFn: async () => {
      const { data } = await api.get<RankingEntry[]>('/ranking');
      return data;
    },
  });
}
