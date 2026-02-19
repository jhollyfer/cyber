import { useQuery } from '@tanstack/react-query';
import { Link, createFileRoute, redirect } from '@tanstack/react-router';
import { BookOpen, CheckCircle, Lock, Trophy, Zap } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { queryKeys } from '@/hooks/tanstack-query/_query-keys';
import { useAuth } from '@/hooks/use-auth';
import { api } from '@/lib/api';
import type { GameSession, Module, RankingEntry } from '@/lib/interfaces';
import { cn, formatNota, getGradientClass } from '@/lib/utils';
import { useAuthStore } from '@/stores/authentication';

export const Route = createFileRoute('/_private/')({
  component: DashboardPage,
  beforeLoad: async (): Promise<void> => {
    const { user } = useAuthStore.getState();
    if (user?.role === 'ADMINISTRATOR') {
      throw redirect({ to: '/admin' });
    }
  },
  head: () => ({
    meta: [{ title: 'Dashboard - CyberGuardian' }],
  }),
});

export default function DashboardPage(): React.JSX.Element | null {
  const { user, isAdmin } = useAuth();

  const { data: modules, isLoading: modulesLoading } = useQuery({
    queryKey: queryKeys.modules.all(),
    queryFn: async () => {
      const { data } = await api.get<Array<Module>>('/modules');
      return data;
    },
    enabled: !isAdmin,
  });

  const { data: ranking } = useQuery({
    queryKey: queryKeys.ranking.all(),
    queryFn: async () => {
      const { data } = await api.get<Array<RankingEntry>>('/ranking');
      return data;
    },
    enabled: !isAdmin,
  });

  // Fetch user's best sessions to determine module completion
  const { data: bestSessions } = useQuery({
    queryKey: queryKeys.game.bestSessions(),
    queryFn: async () => {
      const { data } = await api.get<Array<GameSession>>('/game/sessions/best');
      return data;
    },
    enabled: !isAdmin,
  });

  const userRanking = ranking?.find((entry) => entry.user_id === user?.id);
  const userPosition = ranking?.findIndex(
    (entry) => entry.user_id === user?.id,
  );

  // Build completion map: module_id -> best session
  const completionMap = new Map<string, GameSession>();
  bestSessions?.forEach((s) => {
    if (s.finished) {
      completionMap.set(s.module_id, s);
    }
  });

  // Check if all modules completed
  const sortedModules = modules?.sort((a, b) => a.order - b.order) ?? [];
  const allModulesCompleted =
    sortedModules.length > 0 &&
    sortedModules.every((m) => completionMap.has(m.id));

  if (isAdmin) return null;

  if (modulesLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-72 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // If all modules completed, show final result
  if (allModulesCompleted && bestSessions && bestSessions.length > 0) {
    const lastSession = bestSessions.find((s) => {
      const mod = sortedModules.find((m) => m.id === s.module_id);
      return mod?.order === sortedModules.length;
    });
    if (lastSession) {
      return (
        <div className="max-w-3xl mx-auto text-center py-8">
          <div className="text-6xl mb-6">{'\u{1F3C6}'}</div>
          <h1 className="text-3xl font-bold gradient-text mb-4">
            Parabens, {user?.name}!
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Voce completou todas as fases do CyberGuardian!
          </p>

          {/* Phase results */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {sortedModules.map((mod) => {
              const session = completionMap.get(mod.id);
              const nota = session?.nota ?? 0;
              const passed = nota >= 6;
              return (
                <Card key={mod.id}>
                  <CardContent className="pt-6 text-left">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{mod.icon}</span>
                      <div>
                        <p className="text-xs text-muted-foreground">{mod.label}</p>
                        <p className="font-semibold">{mod.title}</p>
                      </div>
                    </div>
                    <p
                      className={cn(
                        'text-2xl font-bold',
                        passed ? 'text-cyber-green' : 'text-cyber-red',
                      )}
                    >
                      {formatNota(nota)}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Button asChild size="lg">
            <Link to="/ranking">
              <Trophy className="w-5 h-5" />
              Ver Ranking
            </Link>
          </Button>
        </div>
      );
    }
  }

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          Bem-vindo, <span className="gradient-text">{user?.name}</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Complete as fases em ordem para testar seus conhecimentos em
          ciberseguranca.
        </p>
      </div>

      {/* User Stats Banner */}
      {userRanking && (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-purple flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sua posicao</p>
                  <p className="text-xl font-bold">
                    {userPosition !== undefined && userPosition >= 0
                      ? `${userPosition + 1}o lugar`
                      : '-'}
                  </p>
                </div>
              </div>

              <div className="h-10 w-px bg-border hidden sm:block" />

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-pink flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nota media</p>
                  <p
                    className={cn(
                      'text-xl font-bold',
                      userRanking.average_nota >= 6
                        ? 'text-cyber-green'
                        : 'text-cyber-red',
                    )}
                  >
                    {formatNota(userRanking.average_nota)}
                  </p>
                </div>
              </div>

              <div className="h-10 w-px bg-border hidden sm:block" />

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-cyan flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Modulos completos</p>
                  <p className="text-xl font-bold">
                    {userRanking.modules_completed}
                    {modules && (
                      <span className="text-sm text-muted-foreground font-normal ml-1">
                        / {modules.length}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="h-10 w-px bg-border hidden sm:block" />

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl">
                  {'\u{1F525}'}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Melhor sequencia</p>
                  <p className="text-xl font-bold text-cyber-purple">
                    {userRanking.best_streak}x
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modules Grid */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1">Fases</h2>
        <p className="text-muted-foreground text-sm">
          Complete cada fase em ordem para desbloquear a proxima
        </p>
      </div>

      {modules && modules.length === 0 && (
        <Card className="text-center py-16">
          <CardContent>
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              Nenhum modulo disponivel no momento.
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              Novos modulos serao adicionados em breve.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedModules.map((module) => {
          const completedSession = completionMap.get(module.id);
          const isCompleted = !!completedSession;

          // Module is unlocked if: order=1, or previous module is completed
          let isUnlocked = module.order === 1;
          if (module.order > 1) {
            const prevModule = sortedModules.find(
              (m) => m.order === module.order - 1,
            );
            if (prevModule && completionMap.has(prevModule.id)) {
              isUnlocked = true;
            }
          }
          if (isCompleted) isUnlocked = true;

          return (
            <ModuleCard
              key={module.id}
              module={module}
              isCompleted={isCompleted}
              isUnlocked={isUnlocked}
              completedNota={completedSession?.nota ?? null}
            />
          );
        })}
      </div>
    </div>
  );
}

interface ModuleCardProps {
  module: Module;
  isCompleted: boolean;
  isUnlocked: boolean;
  completedNota: number | null;
}

function ModuleCard({
  module,
  isCompleted,
  isUnlocked,
  completedNota,
}: ModuleCardProps): React.JSX.Element {
  const gradientClass = getGradientClass(module.gradient);
  const isLocked = !isUnlocked;

  return (
    <div
      className={cn(
        'group relative rounded-2xl overflow-hidden transition-all duration-300',
        isLocked && 'opacity-60',
        !isLocked &&
          'hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyber-purple/20',
      )}
    >
      {/* Gradient Background */}
      <div className={cn('absolute inset-0 opacity-15', gradientClass)} />
      <div className="absolute inset-0 bg-card/80" />

      {/* Border */}
      <div
        className={cn(
          'absolute inset-0 rounded-2xl border transition-colors',
          isCompleted
            ? 'border-cyber-green/50'
            : isLocked
              ? 'border-border/50'
              : 'border-border group-hover:border-cyber-purple/50',
        )}
      />

      {/* Content */}
      <div className="relative p-6 flex flex-col h-full min-h-70">
        {/* Label + Status */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={cn(
              'inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase',
              isLocked ? 'bg-muted text-muted-foreground' : gradientClass,
              !isLocked && 'text-white',
            )}
          >
            {module.label}
          </span>

          {isCompleted && <CheckCircle className="w-6 h-6 text-cyber-green" />}
          {isLocked && <Lock className="w-5 h-5 text-muted-foreground" />}
        </div>

        {/* Icon and Title */}
        <div className="mb-3">
          <span className={cn('text-4xl block mb-3', isLocked && 'grayscale')}>
            {module.icon}
          </span>
          <h3
            className={cn(
              'text-xl font-bold transition-colors',
              isLocked
                ? 'text-muted-foreground'
                : 'group-hover:text-cyber-purple',
            )}
          >
            {module.title}
          </h3>
        </div>

        {/* Description */}
        <p
          className={cn(
            'text-sm leading-relaxed mb-6 flex-1',
            isLocked ? 'text-muted-foreground/50' : 'text-muted-foreground',
          )}
        >
          {module.description}
        </p>

        {/* Completed nota */}
        {isCompleted && completedNota !== null && (
          <div className="mb-4">
            <Badge
              variant="outline"
              className={cn(
                'text-sm font-bold',
                completedNota >= 6
                  ? 'border-cyber-green/30 bg-cyber-green/10 text-cyber-green'
                  : 'border-cyber-red/30 bg-cyber-red/10 text-cyber-red',
              )}
            >
              Nota: {formatNota(completedNota)}
            </Badge>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end mt-auto">
          {isLocked ? (
            <span className="px-5 py-2.5 rounded-xl font-semibold text-sm text-muted-foreground bg-muted cursor-not-allowed">
              Bloqueado
            </span>
          ) : (
            <Link
              to="/game/$moduleId"
              params={{ moduleId: module.id }}
              className={cn(
                'px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-200',
                'shadow-lg hover:opacity-90',
                gradientClass,
              )}
            >
              {isCompleted ? 'Jogar novamente' : 'Jogar'}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
