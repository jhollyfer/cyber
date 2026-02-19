import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Stats, StudentDetail } from '@/lib/interfaces';
import { queryKeys } from './_query-keys';

export function useStats() {
  return useQuery<Stats>({
    queryKey: queryKeys.stats.all(),
    queryFn: async () => {
      const { data } = await api.get('/stats');
      return data;
    },
  });
}

export function useStudents() {
  return useQuery<StudentDetail[]>({
    queryKey: queryKeys.stats.students(),
    queryFn: async () => {
      const { data } = await api.get('/stats/students');
      return data;
    },
  });
}
