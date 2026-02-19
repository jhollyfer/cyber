import { createFileRoute, redirect } from '@tanstack/react-router';
import { api } from '@/lib/api';
import { queryKeys } from '@/hooks/tanstack-query/_query-keys';
import { useAuthStore } from '@/stores/authentication';
import { adminStudentsSearchSchema } from '@/lib/schemas';

export const Route = createFileRoute('/_private/admin/students/')({
  head: () => ({
    meta: [{ title: 'Alunos - CyberGuardian' }],
  }),
  validateSearch: adminStudentsSearchSchema,
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
      queryKey: queryKeys.stats.students(),
      queryFn: async () => {
        const response = await api.get('/stats/students');
        return response.data;
      },
    });
  },
});
