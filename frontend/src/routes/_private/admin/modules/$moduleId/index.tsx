import { createFileRoute, notFound, redirect } from '@tanstack/react-router';

import { queryKeys } from '@/hooks/tanstack-query/_query-keys';
import { api } from '@/lib/api';
import type { Module } from '@/lib/interfaces';
import { useAuthStore } from '@/stores/authentication';

export const Route = createFileRoute('/_private/admin/modules/$moduleId/')({
  head: () => ({
    meta: [{ title: 'Editar Modulo - CyberGuardian' }],
  }),
  beforeLoad: async () => {
    const { user } = useAuthStore.getState();
    if (user?.role !== 'ADMINISTRATOR') {
      throw redirect({ to: '/' });
    }
  },
  loader: async ({ context, params }) => {
    const [moduleData] = await Promise.all([
      context.queryClient.ensureQueryData<Module>({
        queryKey: queryKeys.modules.detail(params.moduleId),
        queryFn: async () => {
          const response = await api.get(`/modules/${params.moduleId}`);
          return response.data;
        },
      }),
      context.queryClient.ensureQueryData({
        queryKey: queryKeys.questions.byModule(params.moduleId),
        queryFn: async () => {
          const response = await api.get(
            `/modules/${params.moduleId}/questions`,
          );
          return response.data;
        },
      }),
    ]);

    if (!moduleData) {
      throw notFound();
    }
  },
});
