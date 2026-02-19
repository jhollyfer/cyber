import { createFileRoute } from '@tanstack/react-router';
import { api } from '@/lib/api';
import { queryKeys } from '@/hooks/tanstack-query/_query-keys';
import type { RankingEntry } from '@/lib/interfaces';

export const Route = createFileRoute('/ranking/')({
  head: () => ({
    meta: [
      { title: 'Ranking - CyberGuardian' },
      { name: 'description', content: 'Ranking dos melhores alunos do CyberGuardian - veja quem lidera em seguranca da informacao' },
      { property: 'og:title', content: 'Ranking - CyberGuardian' },
      { property: 'og:description', content: 'Ranking dos melhores alunos do CyberGuardian - veja quem lidera em seguranca da informacao' },
      { property: 'og:type', content: 'website' },
    ],
  }),
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: queryKeys.ranking.all(),
      queryFn: async () => {
        const { data } = await api.get<RankingEntry[]>('/ranking');
        return data;
      },
      staleTime: 1000 * 60 * 10,
    });
  },
});
