import { createFileRoute, redirect } from '@tanstack/react-router';
import { api } from '@/lib/api';
import { queryKeys } from '@/hooks/tanstack-query/_query-keys';
import { useAuthStore } from '@/stores/authentication';

export const Route = createFileRoute('/_private/admin/')({
  head: () => ({
    meta: [{ title: 'Admin - CyberGuardian' }],
  }),
  beforeLoad: async () => {
    const { user } = useAuthStore.getState();
    if (user?.role !== 'ADMINISTRATOR') {
      throw redirect({ to: '/' });
    }
  },
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: queryKeys.stats.summary(),
      queryFn: async () => {
        const response = await api.get('/stats');
        return response.data;
      },
    });
  },
});
