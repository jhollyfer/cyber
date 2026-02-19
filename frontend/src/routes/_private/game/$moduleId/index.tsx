import { createFileRoute } from '@tanstack/react-router';
import RouteNotFound from '@/components/common/route-not-found';

export const Route = createFileRoute('/_private/game/$moduleId/')({
  notFoundComponent: RouteNotFound,
  head: () => ({
    meta: [{ title: 'Jogo - CyberGuardian' }],
  }),
});
