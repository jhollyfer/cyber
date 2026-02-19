import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Link,
  createLazyFileRoute,
  useBlocker,
} from '@tanstack/react-router';
import {
  AlertTriangle,
  ChevronDown,
  GripVertical,
  HelpCircle,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { queryKeys } from '@/hooks/tanstack-query/_query-keys';
import { useAppForm } from '@/integrations/tanstack-form/form-hook';
import { api } from '@/lib/api';
import type { Module, Question } from '@/lib/interfaces';
import { createModuleSchema, createQuestionSchema } from '@/lib/schemas';
import { cn } from '@/lib/utils';

export const Route = createLazyFileRoute('/_private/admin/modules/$moduleId/')({
  component: AdminModuleEditPage,
});

const emptyQuestionForm: {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  category: string;
  context?: string | null;
  order: number;
} = {
  question: '',
  options: ['', '', '', ''],
  correct: 0,
  explanation: '',
  category: '',
  context: '',
  order: 0,
};

const gradientOptions = [
  { value: 'gradient-purple', label: 'Roxo', preview: 'bg-gradient-purple' },
  { value: 'gradient-pink', label: 'Rosa', preview: 'bg-gradient-pink' },
  { value: 'gradient-cyan', label: 'Ciano', preview: 'bg-gradient-cyan' },
];

function AdminModuleEditPage(): React.ReactElement {
  const { moduleId } = Route.useParams();
  const queryClient = useQueryClient();

  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null,
  );
  const [deleteQuestionId, setDeleteQuestionId] = useState<string | null>(null);

  // Fetch module (with placeholderData from list cache)
  const {
    data: moduleData,
    isLoading: moduleLoading,
    error: moduleError,
  } = useQuery<Module>({
    queryKey: queryKeys.modules.detail(moduleId),
    queryFn: async () => {
      const response = await api.get(`/modules/${moduleId}`);
      return response.data;
    },
    placeholderData: () => {
      return queryClient
        .getQueryData<Array<Module>>(queryKeys.modules.lists())
        ?.find((m) => m.id === moduleId);
    },
  });

  // Fetch questions
  const { data: questions, isLoading: questionsLoading } = useQuery<
    Array<Question>
  >({
    queryKey: queryKeys.questions.byModule(moduleId),
    queryFn: async () => {
      const response = await api.get(`/modules/${moduleId}/questions`);
      return response.data;
    },
  });

  // Update module mutation
  const updateModuleMutation = useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      icon: string;
      label: string;
      order: number;
      time_per_question: number;
      gradient: string;
      category_color: string;
    }) => {
      const response = await api.put(`/modules/${moduleId}`, data);
      return response.data;
    },
    onSuccess: (updatedModule) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.modules.detail(moduleId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.modules.lists() });
      moduleForm.reset({
        title: updatedModule.title ?? moduleForm.state.values.title,
        description:
          updatedModule.description ?? moduleForm.state.values.description,
        icon: updatedModule.icon ?? moduleForm.state.values.icon,
        label: updatedModule.label ?? moduleForm.state.values.label,
        order: updatedModule.order ?? moduleForm.state.values.order,
        time_per_question:
          updatedModule.time_per_question ??
          moduleForm.state.values.time_per_question,
        gradient: updatedModule.gradient ?? moduleForm.state.values.gradient,
        category_color:
          updatedModule.category_color ??
          moduleForm.state.values.category_color,
      });
      toast.success('Modulo salvo com sucesso!');
    },
    onError: () => {
      toast.error(
        'Erro ao salvar modulo. Verifique os dados e tente novamente.',
      );
    },
  });

  // Module form with useAppForm
  const moduleForm = useAppForm({
    defaultValues: {
      title: moduleData?.title ?? '',
      description: moduleData?.description ?? '',
      icon: moduleData?.icon ?? '',
      label: moduleData?.label ?? '',
      order: moduleData?.order ?? 0,
      time_per_question: moduleData?.time_per_question ?? 60,
      gradient: moduleData?.gradient ?? 'gradient-purple',
      category_color: moduleData?.category_color ?? 'purple',
    },
    validators: { onChange: createModuleSchema },
    onSubmit: async ({ value }) => {
      updateModuleMutation.mutate(value);
    },
  });

  // Block navigation when module form is dirty
  const blocker = useBlocker({
    shouldBlockFn: () => moduleForm.state.isDirty,
    withResolver: true,
  });

  // Create question mutation
  const createQuestionMutation = useMutation({
    mutationFn: async (data: typeof emptyQuestionForm) => {
      const payload = {
        ...data,
        context: data.context || null,
      };
      const response = await api.post(
        `/modules/${moduleId}/questions`,
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.questions.byModule(moduleId),
      });
      setShowQuestionForm(false);
      questionForm.reset();
      toast.success('Questao criada com sucesso!');
    },
    onError: () => {
      toast.error(
        'Erro ao criar questao. Verifique os dados e tente novamente.',
      );
    },
  });

  // Update question mutation
  const updateQuestionMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: typeof emptyQuestionForm;
    }) => {
      const payload = {
        ...data,
        context: data.context || null,
      };
      const response = await api.put(`/questions/${id}`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.questions.byModule(moduleId),
      });
      setEditingQuestionId(null);
      questionForm.reset();
      setShowQuestionForm(false);
      toast.success('Questao atualizada com sucesso!');
    },
    onError: () => {
      toast.error(
        'Erro ao salvar questao. Verifique os dados e tente novamente.',
      );
    },
  });

  // Delete question mutation (optimistic)
  const deleteQuestionMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/questions/${id}`);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.questions.byModule(moduleId),
      });
      const previous = queryClient.getQueryData<Array<Question>>(
        queryKeys.questions.byModule(moduleId),
      );
      queryClient.setQueryData<Array<Question>>(
        queryKeys.questions.byModule(moduleId),
        (old) => old?.filter((q) => q.id !== id),
      );
      setDeleteQuestionId(null);
      return { previous };
    },
    onSuccess: () => {
      toast.success('Questao excluida com sucesso!');
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          queryKeys.questions.byModule(moduleId),
          context.previous,
        );
      }
      toast.error('Erro ao excluir questao.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.questions.byModule(moduleId),
      });
    },
  });

  // Question form with useAppForm
  const questionForm = useAppForm({
    defaultValues: emptyQuestionForm,
    validators: { onChange: createQuestionSchema },
    onSubmit: async ({ value }) => {
      if (editingQuestionId) {
        updateQuestionMutation.mutate({ id: editingQuestionId, data: value });
      } else {
        createQuestionMutation.mutate(value);
      }
    },
  });

  function startEditQuestion(question: Question): void {
    setEditingQuestionId(question.id);
    questionForm.reset({
      question: question.question,
      options: [...question.options],
      correct: question.correct ?? 0,
      explanation: question.explanation ?? '',
      category: question.category,
      context: question.context ?? '',
      order: question.order,
    });
    setShowQuestionForm(true);
  }

  function cancelQuestionForm(): void {
    setShowQuestionForm(false);
    setEditingQuestionId(null);
    questionForm.reset();
  }

  if (moduleLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando modulo...</p>
        </div>
      </div>
    );
  }

  if (moduleError || !moduleData) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Modulo nao encontrado.</p>
          <Button variant="outline" asChild>
            <Link to="/admin/modules">
              Voltar para Modulos
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const sortedQuestions = questions
    ? [...questions].sort((a, b) => a.order - b.order)
    : [];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text">
          {moduleData.icon} {moduleData.title}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Editar modulo e gerenciar questoes
        </p>
      </div>

      {/* Module Edit Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Dados do Modulo</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              moduleForm.handleSubmit();
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <moduleForm.AppField name="title">
                {(field) => (
                  <field.FieldText
                    label="Titulo"
                    required
                  />
                )}
              </moduleForm.AppField>
              <moduleForm.AppField name="label">
                {(field) => (
                  <field.FieldText
                    label="Label"
                    required
                  />
                )}
              </moduleForm.AppField>
            </div>

            <moduleForm.AppField name="description">
              {(field) => (
                <field.FieldTextarea
                  label="Descricao"
                  required
                  rows={3}
                />
              )}
            </moduleForm.AppField>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <moduleForm.AppField name="icon">
                {(field) => (
                  <field.FieldText
                    label="Icone (Emoji)"
                    required
                  />
                )}
              </moduleForm.AppField>
              <moduleForm.AppField name="order">
                {(field) => (
                  <field.FieldNumber
                    label="Ordem"
                    min={0}
                  />
                )}
              </moduleForm.AppField>
              <moduleForm.AppField name="time_per_question">
                {(field) => (
                  <field.FieldNumber
                    label="Tempo por Questao (s)"
                    min={10}
                  />
                )}
              </moduleForm.AppField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <moduleForm.Field name="gradient">
                {(field) => (
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Gradiente
                    </label>
                    <div className="flex gap-3">
                      {gradientOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => field.handleChange(opt.value)}
                          className={cn(
                            'flex-1 px-3 py-2 rounded-xl text-sm font-medium text-white transition-all',
                            opt.preview,
                            field.state.value === opt.value
                              ? 'ring-2 ring-white ring-offset-2 ring-offset-background'
                              : 'opacity-50 hover:opacity-75',
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </moduleForm.Field>
              <moduleForm.AppField name="category_color">
                {(field) => (
                  <field.FieldText
                    label="Cor da Categoria"
                    placeholder="Ex: purple"
                  />
                )}
              </moduleForm.AppField>
            </div>

            <Separator />

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={updateModuleMutation.isPending}
              >
                {updateModuleMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {updateModuleMutation.isPending ? 'Salvando...' : 'Salvar Modulo'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Unsaved Changes Blocker */}
      <AlertDialog
        open={blocker.status === 'blocked'}
        onOpenChange={() => blocker.status === 'blocked' && blocker.reset()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex justify-center mb-2">
              <AlertTriangle className="w-12 h-12 text-cyber-yellow" />
            </div>
            <AlertDialogTitle className="text-center">
              Alteracoes nao salvas
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Voce tem alteracoes nao salvas no modulo. Deseja sair sem salvar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogCancel
              onClick={() => blocker.status === 'blocked' && blocker.reset()}
            >
              Continuar editando
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => blocker.status === 'blocked' && blocker.proceed()}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Sair sem salvar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Questions Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Questoes</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {sortedQuestions.length} questao
                {sortedQuestions.length !== 1 ? 'es' : ''} cadastrada
                {sortedQuestions.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => {
                setEditingQuestionId(null);
                questionForm.reset({
                  ...emptyQuestionForm,
                  order: sortedQuestions.length,
                });
                setShowQuestionForm(true);
              }}
            >
              <Plus className="w-4 h-4" />
              Adicionar Questao
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Question Form Dialog (Create/Edit) */}
          <Dialog
            open={showQuestionForm}
            onOpenChange={(open) => {
              if (!open) cancelQuestionForm();
            }}
          >
            <DialogContent
              className="sm:max-w-2xl max-h-[90vh] overflow-y-auto"
              showCloseButton={false}
            >
              <DialogHeader>
                <DialogTitle>
                  {editingQuestionId ? 'Editar Questao' : 'Nova Questao'}
                </DialogTitle>
                <DialogDescription>
                  {editingQuestionId
                    ? 'Edite os dados da questao abaixo.'
                    : 'Preencha os dados abaixo para criar uma nova questao.'}
                </DialogDescription>
              </DialogHeader>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  questionForm.handleSubmit();
                }}
                className="space-y-4"
              >
                <questionForm.AppField name="question">
                  {(field) => (
                    <field.FieldTextarea
                      label="Pergunta"
                      placeholder="Digite a pergunta..."
                      required
                      rows={3}
                    />
                  )}
                </questionForm.AppField>

                <div>
                  <label className="block text-sm font-medium mb-3">
                    Opcoes
                  </label>
                  <div className="space-y-3">
                    {([0, 1, 2, 3] as const).map((index) => (
                      <questionForm.Field
                        name={`options[${index}]`}
                        key={index}
                      >
                        {(field) => (
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                questionForm.setFieldValue('correct', index)
                              }
                              className={cn(
                                'flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all',
                                questionForm.getFieldValue('correct') === index
                                  ? 'border-cyber-green bg-cyber-green/20 text-cyber-green'
                                  : 'border-border text-muted-foreground hover:border-muted-foreground',
                              )}
                              title={
                                questionForm.getFieldValue('correct') === index
                                  ? 'Resposta correta'
                                  : 'Marcar como correta'
                              }
                            >
                              {String.fromCharCode(65 + index)}
                            </button>
                            <input
                              type="text"
                              value={field.state.value}
                              onChange={(e) => field.handleChange(e.target.value)}
                              placeholder={`Opcao ${String.fromCharCode(65 + index)}`}
                              required
                              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 flex-1"
                            />
                          </div>
                        )}
                      </questionForm.Field>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Clique no circulo para marcar a resposta correta.
                  </p>
                </div>

                <questionForm.AppField name="explanation">
                  {(field) => (
                    <field.FieldTextarea
                      label="Explicacao"
                      placeholder="Explique por que a resposta correta esta certa..."
                      required
                      rows={2}
                    />
                  )}
                </questionForm.AppField>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <questionForm.AppField name="category">
                    {(field) => (
                      <field.FieldText
                        label="Categoria"
                        placeholder="Ex: Phishing"
                        required
                      />
                    )}
                  </questionForm.AppField>
                  <questionForm.AppField name="context">
                    {(field) => (
                      <field.FieldText
                        label="Contexto (opcional)"
                        placeholder="Ex: cenario corporativo"
                      />
                    )}
                  </questionForm.AppField>
                  <questionForm.AppField name="order">
                    {(field) => (
                      <field.FieldNumber
                        label="Ordem"
                        min={0}
                      />
                    )}
                  </questionForm.AppField>
                </div>

                <Separator />

                <div className="flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={cancelQuestionForm}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={
                      createQuestionMutation.isPending ||
                      updateQuestionMutation.isPending
                    }
                  >
                    {createQuestionMutation.isPending ||
                    updateQuestionMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {editingQuestionId ? 'Salvar Alteracoes' : 'Criar Questao'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Delete Question AlertDialog */}
          <AlertDialog
            open={!!deleteQuestionId}
            onOpenChange={(open) => !open && setDeleteQuestionId(null)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <div className="flex justify-center mb-2">
                  <AlertTriangle className="w-12 h-12 text-destructive" />
                </div>
                <AlertDialogTitle className="text-center">
                  Excluir Questao
                </AlertDialogTitle>
                <AlertDialogDescription className="text-center">
                  Tem certeza que deseja excluir esta questao? Essa acao nao pode
                  ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="sm:justify-center">
                <AlertDialogCancel>
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() =>
                    deleteQuestionId &&
                    deleteQuestionMutation.mutate(deleteQuestionId)
                  }
                  disabled={deleteQuestionMutation.isPending}
                  className="bg-destructive text-white hover:bg-destructive/90"
                >
                  {deleteQuestionMutation.isPending
                    ? 'Excluindo...'
                    : 'Confirmar Exclusao'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Questions List */}
          {questionsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : sortedQuestions.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">
                Nenhuma questao cadastrada neste modulo.
              </p>
              <p className="text-muted-foreground text-sm">
                Adicione questoes para que os alunos possam jogar.
              </p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {sortedQuestions.map((question, index) => (
                <AccordionItem key={question.id} value={question.id}>
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <AccordionTrigger className="flex-1 hover:no-underline">
                      <div className="flex items-center gap-3 text-left flex-1">
                        <span className="text-sm font-medium truncate">
                          {index + 1}. {question.question}
                        </span>
                        <Badge variant="secondary" className="shrink-0">
                          {question.category}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <div className="flex items-center gap-1 flex-shrink-0 pr-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditQuestion(question);
                            }}
                            className="text-muted-foreground hover:text-primary"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Editar questao</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteQuestionId(question.id);
                            }}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Excluir questao</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                  <AccordionContent>
                    <div className="pl-6 space-y-3 pt-2">
                      <div className="space-y-1">
                        {question.options.map((opt, optIndex) => (
                          <div
                            key={optIndex}
                            className={cn(
                              'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm',
                              question.correct === optIndex
                                ? 'bg-cyber-green/10 text-cyber-green font-medium'
                                : 'text-muted-foreground',
                            )}
                          >
                            <span className="font-bold text-xs">
                              {String.fromCharCode(65 + optIndex)}
                            </span>
                            <span>{opt}</span>
                          </div>
                        ))}
                      </div>
                      {question.explanation && (
                        <div className="p-3 rounded-md bg-muted/50 text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">Explicacao:</span>{' '}
                          {question.explanation}
                        </div>
                      )}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>Ordem: {question.order}</span>
                        {question.context && <span>Contexto: {question.context}</span>}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
