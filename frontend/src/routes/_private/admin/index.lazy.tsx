import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createLazyFileRoute, Link } from '@tanstack/react-router';
import {
  Users,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  GraduationCap,
  ArrowRight,
  Download,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import DashboardSkeleton from './-components/dashboard-skeleton';
import { api } from '@/lib/api';
import { queryKeys } from '@/hooks/tanstack-query/_query-keys';
import type { Stats } from '@/lib/interfaces';
import { useAuth } from '@/hooks/use-auth';
import { cn, formatNota } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export const Route = createLazyFileRoute('/_private/admin/')({
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  async function handleExportCsv() {
    try {
      const response = await api.get('/stats/export-csv', {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], {
        type: 'text/csv;charset=utf-8;',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'cyberguardian-ranking.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('CSV exportado com sucesso!');
    } catch {
      toast.error('Erro ao exportar CSV.');
    }
  }

  const resetMutation = useMutation({
    mutationFn: async () => {
      await api.delete('/stats/reset');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stats.summary() });
      queryClient.invalidateQueries({ queryKey: queryKeys.stats.students() });
      queryClient.invalidateQueries({ queryKey: queryKeys.ranking.all() });
      toast.success('Dados resetados com sucesso!');
      setResetDialogOpen(false);
    },
    onError: () => {
      toast.error('Erro ao resetar dados.');
    },
  });

  const {
    data: stats,
    isLoading,
    error,
  } = useQuery<Stats>({
    queryKey: queryKeys.stats.summary(),
    queryFn: async () => {
      const response = await api.get('/stats');
      return response.data;
    },
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-muted-foreground">
            Erro ao carregar estatisticas. Tente novamente.
          </p>
        </CardContent>
      </Card>
    );
  }

  const statCards = [
    {
      label: 'Total de Alunos',
      value: stats?.total_students ?? 0,
      icon: Users,
      color: 'text-cyber-green',
      bgColor: 'bg-cyber-green/10',
      borderColor: 'border-cyber-green/20',
    },
    {
      label: 'Media Geral',
      value: formatNota(stats?.average_nota ?? 0),
      icon: BarChart3,
      color:
        stats && stats.average_nota >= 6
          ? 'text-cyber-green'
          : 'text-cyber-red',
      bgColor:
        stats && stats.average_nota >= 6
          ? 'bg-cyber-green/10'
          : 'bg-cyber-red/10',
      borderColor:
        stats && stats.average_nota >= 6
          ? 'border-cyber-green/20'
          : 'border-cyber-red/20',
    },
    {
      label: 'Taxa de Aprovacao',
      value: `${(stats?.approval_rate ?? 0).toFixed(1)}%`,
      icon: TrendingUp,
      color:
        stats && stats.approval_rate >= 70
          ? 'text-cyber-green'
          : stats && stats.approval_rate >= 50
            ? 'text-cyber-yellow'
            : 'text-cyber-red',
      bgColor:
        stats && stats.approval_rate >= 70
          ? 'bg-cyber-green/10'
          : stats && stats.approval_rate >= 50
            ? 'bg-cyber-yellow/10'
            : 'bg-cyber-red/10',
      borderColor:
        stats && stats.approval_rate >= 70
          ? 'border-cyber-green/20'
          : stats && stats.approval_rate >= 50
            ? 'border-cyber-yellow/20'
            : 'border-cyber-red/20',
    },
    {
      label: 'Modulo Mais Dificil',
      value: stats?.hardest_module ? stats.hardest_module.title : 'N/A',
      subtitle: stats?.hardest_module
        ? `Media: ${formatNota(stats.hardest_module.average_nota)}`
        : undefined,
      icon: AlertTriangle,
      color: 'text-cyber-red',
      bgColor: 'bg-cyber-red/10',
      borderColor: 'border-cyber-red/20',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">
          Painel Administrativo
        </h1>
        <p className="text-muted-foreground">
          Bem-vindo, {user?.name}. Aqui esta o resumo da plataforma.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Card
            key={stat.label}
            className={cn('border', stat.borderColor)}
          >
            <CardContent className="pt-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <div className={cn('p-2 rounded-lg', stat.bgColor)}>
                  <stat.icon className={cn('w-5 h-5', stat.color)} />
                </div>
              </div>
              <div>
                <p className={cn('text-3xl font-bold', stat.color)}>
                  {stat.value}
                </p>
                {stat.subtitle && (
                  <p className="text-sm text-muted-foreground mt-1">{stat.subtitle}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="w-5 h-5 text-cyber-purple" />
            <span className="text-muted-foreground text-sm">
              Total de Sessoes Finalizadas
            </span>
          </div>
          <p className="text-2xl font-bold">
            {stats?.total_sessions ?? 0}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="group hover:border-cyber-purple/50 transition-all duration-200" asChild>
          <Link to="/admin/modules">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-cyber-purple/10">
                    <BookOpen className="w-6 h-6 text-cyber-purple" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Gerenciar Modulos
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Criar, editar e remover modulos e questoes
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-cyber-purple transition-colors" />
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="group hover:border-cyber-green/50 transition-all duration-200" asChild>
          <Link to="/admin/students">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-cyber-green/10">
                    <Users className="w-6 h-6 text-cyber-green" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Ver Alunos</h3>
                    <p className="text-sm text-muted-foreground">
                      Visualizar notas e desempenho dos alunos
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-cyber-green transition-colors" />
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>

      <div className="flex flex-wrap gap-4">
        <Button variant="outline" onClick={handleExportCsv}>
          <Download className="w-4 h-4" />
          CSV
        </Button>

        <AlertDialog
          open={resetDialogOpen}
          onOpenChange={setResetDialogOpen}
        >
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="w-4 h-4" />
              Resetar Dados
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="flex justify-center mb-2">
                <AlertTriangle className="w-12 h-12 text-destructive" />
              </div>
              <AlertDialogTitle className="text-center">
                Confirmar Reset
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center">
                Essa acao ira apagar TODOS os dados de jogo (sessoes e
                respostas). Os alunos e modulos serao mantidos. Essa acao nao
                pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="sm:justify-center">
              <AlertDialogCancel>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => resetMutation.mutate()}
                disabled={resetMutation.isPending}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                {resetMutation.isPending ? 'Resetando...' : 'Confirmar Reset'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
