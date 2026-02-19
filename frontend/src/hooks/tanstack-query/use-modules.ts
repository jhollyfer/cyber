import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Module } from '@/lib/interfaces';
import { queryKeys } from './_query-keys';

export function useModules(enabled = true) {
  return useQuery({
    queryKey: queryKeys.modules.all(),
    queryFn: async () => {
      const { data } = await api.get<Module[]>('/modules');
      return data;
    },
    enabled,
  });
}

export function useModule(id: string) {
  return useQuery({
    queryKey: queryKeys.modules.detail(id),
    queryFn: async () => {
      const { data } = await api.get<Module>(`/modules/${id}`);
      return data;
    },
    enabled: !!id,
  });
}
