import { createFileRoute, notFound } from '@tanstack/react-router';

import RouteNotFound from '@/components/common/route-not-found';
import { queryKeys } from '@/hooks/tanstack-query/_query-keys';
import { api } from '@/lib/api';
import type { GameSession } from '@/lib/interfaces';

export const Route = createFileRoute('/_private/result/$sessionId/')({
  notFoundComponent: RouteNotFound,
  head: () => ({
    meta: [{ title: 'Resultado - CyberGuardian' }],
  }),
  loader: async ({ context, params }) => {
    const session = await context.queryClient.ensureQueryData<GameSession>({
      queryKey: queryKeys.game.session(params.sessionId),
      queryFn: async () => {
        const { data } = await api.get<GameSession>(
          `/game/sessions/${params.sessionId}`,
        );
        return data;
      },
    });

    if (!session) {
      throw notFound();
    }
  },
});
