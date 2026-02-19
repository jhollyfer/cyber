import { createFileRoute, redirect } from '@tanstack/react-router';
import { api } from '@/lib/api';
import { queryKeys } from '@/hooks/tanstack-query/_query-keys';
import { useAuthStore } from '@/stores/authentication';
import { adminModulesSearchSchema } from '@/lib/schemas';

export const Route = createFileRoute('/_private/admin/modules/')({
  head: () => ({
    meta: [{ title: 'Modulos - CyberGuardian' }],
  }),
  validateSearch: adminModulesSearchSchema,
  beforeLoad: async () => {
    const { user } = useAuthStore.getState();
    if (user?.role !== 'ADMINISTRATOR') {
      throw redirect({ to: '/' });
    }
  },
  loaderDeps: ({ search }) => ({
    search: search.search,
    page: search.page,
  }),
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: queryKeys.modules.lists(),
      queryFn: async () => {
        const response = await api.get('/modules');
        return response.data;
      },
    });
  },
});
