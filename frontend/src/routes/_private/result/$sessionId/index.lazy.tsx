import { createLazyFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { Trophy, Target, Zap, BarChart3, Home, Star, Loader2, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { api } from '@/lib/api';
import { queryKeys } from '@/hooks/tanstack-query/_query-keys';
import type { GameSession, Module } from '@/lib/interfaces';
import { cn, formatNota, getLetterRank, getResultEmoji } from '@/lib/utils';
import Confetti from '@/components/common/confetti';

export const Route = createLazyFileRoute('/_private/result/$sessionId/')({
  component: ResultPage,
});

function ResultPage() {
  const { sessionId } = Route.useParams();

  const {
    data: session,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.game.session(sessionId),
    queryFn: async () => {
      const { data } = await api.get<GameSession>(`/game/sessions/${sessionId}`);
      return data;
    },
  });

  const { data: modules } = useQuery({
    queryKey: queryKeys.modules.all(),
    queryFn: async () => {
      const { data } = await api.get<Module[]>('/modules');
      return data;
    },
  });

  // Fetch all user best sessions to determine what module comes next
  const { data: allSessions } = useQuery({
    queryKey: queryKeys.game.bestSessions(),
    queryFn: async () => {
      const { data } = await api.get<GameSession[]>('/game/sessions/best');
      return data;
    },
    enabled: !!session,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Carregando resultados...</p>
        </div>
      </div>
    );
  }

  if (isError || !session) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <Card className="max-w-md text-center">
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-6">Erro ao carregar os resultados.</p>
            <Button asChild>
              <Link to="/">Voltar aos modulos</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const nota = session.nota ?? 0;
  const passed = nota >= 6;
  const totalQuestions = session.total_answered;
  const percentage = totalQuestions > 0 ? Math.round((session.correct_answers / totalQuestions) * 100) : 0;
  const rank = getLetterRank(nota);
  const emoji = getResultEmoji(percentage);

  // Determine if this is the last module
  const sortedModules = modules?.sort((a, b) => a.order - b.order) ?? [];
  const currentModule = sortedModules.find((m) => m.id === session.module_id);
  const currentOrder = currentModule?.order ?? 0;
  const isLastModule = currentOrder >= sortedModules.length;
  const nextModule = sortedModules.find((m) => m.order === currentOrder + 1);

  // Check if ALL modules are completed
  const completedModuleIds = new Set(
    allSessions?.filter((s) => s.finished).map((s) => s.module_id) ?? [],
  );
  const allModulesCompleted = sortedModules.length > 0 && sortedModules.every((m) => completedModuleIds.has(m.id));

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Confetti trigger={passed} />

      {/* Result Header */}
      <div className="text-center mb-8">
        {/* Emoji */}
        <div className="text-6xl mb-4">{emoji}</div>

        {/* Grade Circle */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <div
            className={cn(
              'w-36 h-36 rounded-full flex items-center justify-center',
              'border-4',
              passed
                ? 'border-cyber-green bg-cyber-green/10'
                : 'border-cyber-red bg-cyber-red/10',
            )}
          >
            <div className="text-center">
              <p
                className={cn(
                  'text-4xl font-bold',
                  passed ? 'text-cyber-green' : 'text-cyber-red',
                )}
              >
                {formatNota(nota)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">NOTA</p>
            </div>
          </div>

          {/* Best badge */}
          {session.is_best && (
            <div className="absolute -top-2 -right-2 px-3 py-1 rounded-full bg-gradient-purple text-white text-xs font-bold flex items-center gap-1 shadow-lg">
              <Star className="w-3 h-3" />
              MELHOR
            </div>
          )}
        </div>

        {/* Letter Rank */}
        <div className={cn(
          'inline-flex items-center px-6 py-3 rounded-2xl border-2 mb-6',
          rank.bgColor,
        )}>
          <span className={cn('text-4xl font-black mr-3', rank.color)}>
            {rank.letter}
          </span>
          <span className="text-muted-foreground text-sm">RANK</span>
        </div>

        {/* Result Message */}
        <div>
          {passed ? (
            <>
              <h1 className="text-3xl font-bold gradient-text mb-2">
                Parabens!
              </h1>
              <p className="text-muted-foreground text-lg">
                Voce demonstrou otimo conhecimento neste modulo.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-2">
                Quase la!
              </h1>
              <p className="text-muted-foreground text-lg">
                Continue estudando e tente novamente. Voce vai conseguir!
              </p>
            </>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Target className="w-5 h-5 text-cyber-purple" />}
          label="Acertos"
          value={`${session.correct_answers}/${totalQuestions}`}
          subtext={`${percentage}%`}
        />
        <StatCard
          icon={<Zap className="w-5 h-5 text-cyber-cyan" />}
          label="Pontuacao"
          value={session.score.toLocaleString()}
          subtext="pontos"
        />
        <StatCard
          icon={<BarChart3 className="w-5 h-5 text-cyber-pink" />}
          label="Melhor sequencia"
          value={`${session.max_streak}x`}
          subtext={session.max_streak > 2 ? '\u{1F525}' : ''}
        />
        <StatCard
          icon={<Trophy className="w-5 h-5 text-cyber-yellow" />}
          label="Nota"
          value={formatNota(nota)}
          subtext={passed ? 'Aprovado' : 'Reprovado'}
          subtextColor={passed ? 'text-cyber-green' : 'text-cyber-red'}
        />
      </div>

      {/* Performance Bar */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Desempenho</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Precision bar */}
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-muted-foreground">Precisao</span>
                <span className={cn('font-medium', passed ? 'text-cyber-green' : 'text-cyber-red')}>
                  {percentage}%
                </span>
              </div>
              <Progress
                value={percentage}
                className="h-3"
              />
            </div>

            {/* Score breakdown */}
            <div className="pt-3 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pontuacao total</span>
                <span className="font-bold">{session.score.toLocaleString()} pts</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-muted-foreground">Melhor sequencia de acertos</span>
                <span className="text-cyber-purple font-bold">{session.max_streak}x</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best attempt message */}
      {session.is_best && (
        <Card className="border-cyber-purple/30 bg-cyber-purple/5 mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Star className="w-6 h-6 text-cyber-purple flex-shrink-0" />
              <div>
                <p className="text-cyber-purple font-bold">Nova melhor pontuacao!</p>
                <p className="text-muted-foreground text-sm">
                  Esta foi a sua melhor tentativa neste modulo ate agora.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {/* If all modules completed, show final result link */}
        {allModulesCompleted ? (
          <Button asChild size="lg">
            <Link to="/ranking">
              <Trophy className="w-5 h-5" />
              VER RANKING FINAL
            </Link>
          </Button>
        ) : isLastModule || !nextModule ? (
          <Button asChild size="lg">
            <Link to="/">
              <Home className="w-5 h-5" />
              Voltar ao inicio
            </Link>
          </Button>
        ) : (
          <Button asChild size="lg">
            <Link
              to="/game/$moduleId"
              params={{ moduleId: nextModule.id }}
            >
              PROXIMA FASE
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        )}

        {!allModulesCompleted && (
          <Button variant="outline" asChild size="lg">
            <Link to="/">
              <Home className="w-5 h-5" />
              Voltar aos modulos
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  subtextColor?: string;
}

function StatCard({ icon, label, value, subtext, subtextColor }: StatCardProps) {
  return (
    <Card className="text-center">
      <CardContent className="pt-6">
        <div className="flex items-center justify-center mb-2">
          {icon}
        </div>
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
        {subtext && (
          <p className={cn('text-xs mt-1', subtextColor || 'text-muted-foreground')}>
            {subtext}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
