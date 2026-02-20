import {
  createLazyFileRoute,
  useBlocker,
  useNavigate,
} from '@tanstack/react-router';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Loader2,
  Target,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { api } from '@/lib/api';
import type {
  GameSession,
  Question,
  SubmitAnswerResponse,
} from '@/lib/interfaces';
import { cn } from '@/lib/utils';

export const Route = createLazyFileRoute('/_private/game/$moduleId/')({
  component: GamePage,
});

interface StartSessionResponse {
  session: GameSession;
  questions: Array<Omit<Question, 'correct' | 'explanation'>>;
  resumed: boolean;
}

function GamePage() {
  const { moduleId } = Route.useParams();
  const navigate = useNavigate();

  // Session state
  const [session, setSession] = useState<GameSession | null>(null);
  const [questions, setQuestions] = useState<
    Array<Omit<Question, 'correct' | 'explanation'>>
  >([]);
  const [isStarting, setIsStarting] = useState(true);
  const [startError, setStartError] = useState<string | null>(null);

  // Game state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackData, setFeedbackData] = useState<SubmitAnswerResponse | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  // Resume / progress state
  const [totalQuestionsCount, setTotalQuestionsCount] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  // Navigation blocker state
  const [isFinishing, setIsFinishing] = useState(false);

  // Block SPA navigation when quiz is active
  const blocker = useBlocker({
    shouldBlockFn: () => !!session && questions.length > 0 && !isFinishing,
    withResolver: true,
  });

  // Block browser close / refresh when quiz is active
  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (session && questions.length > 0 && !isFinishing) {
        e.preventDefault();
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [session, questions.length, isFinishing]);

  // Start session on mount
  useEffect(() => {
    let cancelled = false;

    async function startSession() {
      try {
        setIsStarting(true);
        setStartError(null);

        const { data } = await api.post<StartSessionResponse>(
          '/game/sessions',
          {
            module_id: moduleId,
          },
        );

        if (cancelled) return;

        setSession(data.session);
        setQuestions(data.questions);

        if (data.resumed) {
          setScore(data.session.score);
          setStreak(data.session.streak);
          setAnsweredCount(data.session.total_answered);
          setTotalQuestionsCount(
            data.session.total_answered + data.questions.length,
          );
        } else {
          setTotalQuestionsCount(data.questions.length);
          setAnsweredCount(0);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const axiosErr = err as {
            response?: { data?: { message?: string } };
          };
          setStartError(
            axiosErr?.response?.data?.message ||
              'Erro ao iniciar a sessao. Tente novamente.',
          );
        }
      } finally {
        if (!cancelled) {
          setIsStarting(false);
        }
      }
    }

    startSession();

    return () => {
      cancelled = true;
    };
  }, [moduleId]);

  const handleConfirmAnswer = useCallback(async () => {
    if (
      !session ||
      selectedOption === null ||
      !questions[currentQuestionIndex] ||
      isSubmitting
    )
      return;

    setIsSubmitting(true);

    try {
      const { data } = await api.post<SubmitAnswerResponse>(
        `/game/sessions/${session.id}/answer`,
        {
          question_id: questions[currentQuestionIndex].id,
          selected_option: selectedOption,
        },
      );

      setFeedbackData(data);
      setScore(data.score);
      setStreak(data.streak);
      setAnsweredCount((prev) => prev + 1);
      setShowFeedback(true);
      setIsSubmitting(false);
    } catch {
      setIsSubmitting(false);
    }
  }, [session, questions, currentQuestionIndex, selectedOption, isSubmitting]);

  function handleNextQuestion() {
    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex >= questions.length) {
      finishSession();
    } else {
      setCurrentQuestionIndex(nextIndex);
      setSelectedOption(null);
      setShowFeedback(false);
      setFeedbackData(null);
    }
  }

  async function finishSession() {
    if (!session) return;

    setIsFinishing(true);

    try {
      await api.post(`/game/sessions/${session.id}/finish`);
      navigate({ to: '/result/$sessionId', params: { sessionId: session.id } });
    } catch {
      navigate({ to: '/result/$sessionId', params: { sessionId: session.id } });
    }
  }

  function handleOptionClick(index: number) {
    if (showFeedback || isSubmitting) return;
    setSelectedOption(index);
  }

  // Loading state
  if (isStarting) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Preparando o quiz...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (startError) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <Card className="max-w-md text-center">
          <CardContent className="pt-6">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <p className="text-muted-foreground mb-6">{startError}</p>
            <Button onClick={() => navigate({ to: '/' })}>
              Voltar ao inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session || questions.length === 0) return null;

  const currentQuestion = questions[currentQuestionIndex];
  const displayQuestionNumber = answeredCount + currentQuestionIndex + 1;
  const progressValue = (displayQuestionNumber / totalQuestionsCount) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* SPA Navigation Blocker Dialog */}
      <AlertDialog
        open={blocker.status === 'blocked'}
        onOpenChange={() => blocker.status === 'blocked' && blocker.reset()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex justify-center mb-2">
              <AlertTriangle className="w-12 h-12 text-warning" />
            </div>
            <AlertDialogTitle className="text-center">
              Sair do quiz?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Voce tem um quiz em andamento. Se sair agora, podera retomar de
              onde parou quando voltar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogCancel
              onClick={() => blocker.status === 'blocked' && blocker.reset()}
            >
              Continuar jogando
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => blocker.status === 'blocked' && blocker.proceed()}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Sair do quiz
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Top Bar: Score, Streak */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Score */}
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <span className="font-bold">{score}</span>
            <span className="text-muted-foreground text-sm">pts</span>
          </div>

          {/* Streak */}
          {streak > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary border">
              <span className="text-lg">
                {streak > 1 ? '\u{1F525}' : '\u2728'}
              </span>
              <span className="font-bold text-sm">{streak}x</span>
              {streak > 1 && (
                <span className="text-warning text-xs font-medium">
                  streak!
                </span>
              )}
            </div>
          )}
        </div>

        {/* Question counter */}
        <div className="text-muted-foreground text-sm font-medium">
          {displayQuestionNumber} / {totalQuestionsCount}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-muted-foreground mb-1">
          <span>Progresso</span>
          <span>
            {displayQuestionNumber}/{totalQuestionsCount}
          </span>
        </div>
        <Progress
          value={progressValue}
          className="h-2"
        />
      </div>

      {/* Question Card */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          {/* Question Header */}
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-primary text-white text-xs font-semibold">
              Questao {displayQuestionNumber}
            </span>
            {currentQuestion.category && (
              <span className="px-3 py-1 rounded-full bg-secondary text-primary-foreground text-xs">
                {currentQuestion.category}
              </span>
            )}
            {currentQuestion.context && (
              <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs">
                {currentQuestion.context}
              </span>
            )}
          </div>

          {/* Question Text */}
          <h2 className="text-xl sm:text-2xl font-bold leading-relaxed">
            {currentQuestion.question}
          </h2>
        </CardContent>
      </Card>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedOption === index;
          const isCorrect =
            showFeedback && feedbackData?.correct_option === index;
          const isWrong =
            showFeedback && isSelected && !feedbackData?.is_correct;
          const optionLetter = String.fromCharCode(65 + index);

          return (
            <button
              key={index}
              onClick={() => handleOptionClick(index)}
              disabled={showFeedback || isSubmitting}
              className={cn(
                'relative p-4 sm:p-5 rounded-xl border-2 text-left transition-all duration-200',
                'flex items-start gap-3',
                // Default state
                !showFeedback &&
                  !isSubmitting &&
                  !isSelected &&
                  'bg-card border-border hover:border-primary/60 hover:bg-accent cursor-pointer',
                // Selected (before feedback)
                isSelected && !showFeedback && 'border-primary bg-primary/10',
                // Correct answer (feedback)
                isCorrect && 'border-success bg-success/10',
                // Wrong answer (feedback)
                isWrong && 'border-destructive bg-destructive/10',
                // Non-selected during feedback
                showFeedback &&
                  !isCorrect &&
                  !isWrong &&
                  'border-border/50 bg-card/50 opacity-50',
                // Disabled
                (showFeedback || isSubmitting) && 'cursor-default',
              )}
            >
              <span
                className={cn(
                  'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold',
                  isCorrect
                    ? 'bg-success text-success-foreground'
                    : isWrong
                      ? 'bg-destructive text-destructive-foreground'
                      : isSelected && !showFeedback
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-primary-foreground ',
                )}
              >
                {optionLetter}
              </span>
              <span
                className={cn(
                  'text-sm sm:text-base leading-relaxed mt-0.5',
                  isCorrect
                    ? 'text-success font-medium'
                    : isWrong
                      ? 'text-destructive font-medium'
                      : isSelected && !showFeedback
                        ? 'font-medium'
                        : 'text-muted-foreground',
                )}
              >
                {option}
              </span>
            </button>
          );
        })}
      </div>

      {/* Confirm Button */}
      {selectedOption !== null && !showFeedback && (
        <div className="flex justify-center mb-6">
          <Button
            onClick={handleConfirmAnswer}
            disabled={isSubmitting}
            size="lg"
            className="bg-primary text-primary-foreground hover:opacity-90 shadow-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                CONFIRMAR RESPOSTA
              </>
            )}
          </Button>
        </div>
      )}

      {/* Feedback Section */}
      {showFeedback && feedbackData && (
        <Card
          className={cn(
            'border-2 mb-6',
            feedbackData.is_correct
              ? 'border-success/50 bg-success/5'
              : 'border-destructive/50 bg-destructive/5',
          )}
        >
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">
                {feedbackData.is_correct ? '\u2705' : '\u274C'}
              </span>
              <div>
                <p
                  className={cn(
                    'font-bold text-lg mb-1',
                    feedbackData.is_correct
                      ? 'text-success'
                      : 'text-destructive',
                  )}
                >
                  {feedbackData.is_correct ? 'Correto!' : 'Incorreto!'}
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feedbackData.explanation}
                </p>
                {feedbackData.is_correct && feedbackData.points > 0 && (
                  <p className="text-primary text-sm font-medium mt-2">
                    +{feedbackData.points} pontos
                    {feedbackData.streak > 1 && (
                      <span className="ml-2 text-warning">
                        {'\u{1F525}'} {feedbackData.streak}x streak!
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Button */}
      {showFeedback && (
        <div className="flex justify-center">
          <Button
            onClick={handleNextQuestion}
            size="lg"
            className="bg-primary text-primary-foreground hover:opacity-90 shadow-lg"
          >
            {currentQuestionIndex + 1 >= questions.length ? (
              'VER RESULTADO'
            ) : (
              <>
                PROXIMA
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
