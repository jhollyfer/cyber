import { useQuery } from '@tanstack/react-query';
import { createLazyFileRoute } from '@tanstack/react-router';
import {
  Trophy,
  Loader2,
  Users,
  BarChart3,
  TrendingUp,
  Award,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api';
import { queryKeys } from '@/hooks/tanstack-query/_query-keys';
import type { RankingEntry } from '@/lib/interfaces';
import { useAuth } from '@/hooks/use-auth';
import RankingTable from '@/components/common/ranking-table';
import { cn, formatNota } from '@/lib/utils';

export const Route = createLazyFileRoute('/ranking/')({
  component: RankingPage,
});

function RankingPage() {
  const { user } = useAuth();

  const {
    data: ranking,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.ranking.all(),
    queryFn: async () => {
      const { data } = await api.get<RankingEntry[]>('/ranking');
      return data;
    },
    staleTime: 1000 * 60 * 10,
  });

  const totalPlayers = ranking?.length ?? 0;
  const averageNota =
    totalPlayers > 0
      ? ranking!.reduce((sum, e) => sum + e.average_nota, 0) / totalPlayers
      : 0;
  const approvedCount = ranking?.filter((e) => e.average_nota >= 6).length ?? 0;
  const approvedPercent =
    totalPlayers > 0 ? Math.round((approvedCount / totalPlayers) * 100) : 0;
  const highestNota =
    totalPlayers > 0 ? Math.max(...ranking!.map((e) => e.average_nota)) : 0;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-8 h-8 text-warning" />
          <h1 className="text-3xl font-bold text-primary">Ranking</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          {user
            ? 'Veja como voce se compara com os outros alunos. Continue jogando para subir no ranking!'
            : 'Confira o ranking dos alunos na plataforma CyberGuardian.'}
        </p>
      </div>

      {/* Stats Cards */}
      {!isLoading && !isError && ranking && ranking.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground mb-1">Total Jogadores</p>
              <p className="text-2xl font-bold">{totalPlayers}</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <BarChart3 className="w-5 h-5 text-secondary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground mb-1">Media Geral</p>
              <p
                className={cn(
                  'text-2xl font-bold',
                  averageNota >= 6 ? 'text-success' : 'text-destructive',
                )}
              >
                {formatNota(averageNota)}
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <TrendingUp className="w-5 h-5 text-success mx-auto mb-2" />
              <p className="text-xs text-muted-foreground mb-1">Aprovados</p>
              <p className="text-2xl font-bold text-success">
                {approvedPercent}%
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Award className="w-5 h-5 text-warning mx-auto mb-2" />
              <p className="text-xs text-muted-foreground mb-1">Maior Nota</p>
              <p className="text-2xl font-bold text-warning">
                {formatNota(highestNota)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Content */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando ranking...</p>
          </div>
        </div>
      )}

      {isError && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">
              Erro ao carregar o ranking. Tente novamente mais tarde.
            </p>
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && ranking && (
        <RankingTable
          entries={ranking}
          currentUserId={user?.id}
        />
      )}
    </div>
  );
}
