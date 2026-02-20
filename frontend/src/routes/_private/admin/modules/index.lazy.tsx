import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createLazyFileRoute, Link } from '@tanstack/react-router';
import {
  Plus,
  Trash2,
  Pencil,
  Loader2,
  AlertTriangle,
  BookOpen,
} from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { queryKeys } from '@/hooks/tanstack-query/_query-keys';
import { useAppForm } from '@/integrations/tanstack-form/form-hook';
import { api } from '@/lib/api';
import type { Module } from '@/lib/interfaces';
import { createModuleSchema } from '@/lib/schemas';
import { cn } from '@/lib/utils';
import TableModulesSkeleton from './-components/table-modules-skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
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

export const Route = createLazyFileRoute('/_private/admin/modules/')({
  component: AdminModulesPage,
});

const emptyFormData = {
  title: '',
  description: '',
  icon: '',
  label: '',
  order: 0,
  time_per_question: 60,
  gradient: 'gradient-purple',
  category_color: 'purple',
};

const gradientOptions = [
  { value: 'gradient-purple', label: 'Roxo', preview: 'bg-primary' },
  { value: 'gradient-pink', label: 'Rosa', preview: 'bg-destructive' },
  { value: 'gradient-cyan', label: 'Ciano', preview: 'bg-secondary' },
];

function AdminModulesPage() {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deleteModuleId, setDeleteModuleId] = useState<string | null>(null);

  const {
    data: modules,
    isLoading,
    error,
  } = useQuery<Module[]>({
    queryKey: queryKeys.modules.lists(),
    queryFn: async () => {
      const response = await api.get('/modules');
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof emptyFormData) => {
      const response = await api.post('/modules', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.modules.lists() });
      setShowCreateForm(false);
      form.reset();
      toast.success('Modulo criado com sucesso!');
    },
    onError: () => {
      toast.error(
        'Erro ao criar modulo. Verifique os dados e tente novamente.',
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/modules/${id}`);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.modules.lists() });
      const previous = queryClient.getQueryData<Module[]>(
        queryKeys.modules.lists(),
      );
      queryClient.setQueryData<Module[]>(queryKeys.modules.lists(), (old) =>
        old?.filter((m) => m.id !== id),
      );
      setDeleteModuleId(null);
      return { previous };
    },
    onSuccess: () => {
      toast.success('Modulo excluido com sucesso!');
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.modules.lists(), context.previous);
      }
      toast.error('Erro ao excluir modulo.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.modules.lists() });
    },
  });

  const form = useAppForm({
    defaultValues: emptyFormData,
    validators: {
      onChange: createModuleSchema,
    },
    onSubmit: async ({ value }) => {
      createMutation.mutate(value);
    },
  });

  if (isLoading) {
    return <TableModulesSkeleton />;
  }

  if (error) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-muted-foreground">
            Erro ao carregar modulos. Tente novamente.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Modulos</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {modules?.length ?? 0} modulo{modules?.length !== 1 ? 's' : ''}{' '}
            cadastrado{modules?.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button
          onClick={() => {
            form.reset();
            setShowCreateForm(true);
          }}
        >
          <Plus className="w-4 h-4" />
          Criar Modulo
        </Button>
      </div>

      {/* Create Form Dialog */}
      <Dialog
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
      >
        <DialogContent
          className="sm:max-w-2xl max-h-[90vh] overflow-y-auto"
          showCloseButton={false}
        >
          <DialogHeader>
            <DialogTitle>Criar Novo Modulo</DialogTitle>
            <DialogDescription>
              Preencha os dados abaixo para criar um novo modulo.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <form.AppField name="title">
                {(field) => (
                  <field.FieldText
                    label="Titulo"
                    placeholder="Ex: Seguranca de Redes"
                    required
                  />
                )}
              </form.AppField>
              <form.AppField name="label">
                {(field) => (
                  <field.FieldText
                    label="Label"
                    placeholder="Ex: Redes"
                    required
                  />
                )}
              </form.AppField>
            </div>

            <form.AppField name="description">
              {(field) => (
                <field.FieldTextarea
                  label="Descricao"
                  placeholder="Descreva o modulo..."
                  required
                  rows={3}
                />
              )}
            </form.AppField>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <form.AppField name="icon">
                {(field) => (
                  <field.FieldText
                    label="Icone (Emoji)"
                    placeholder="Ex: 🔒"
                    required
                  />
                )}
              </form.AppField>
              <form.AppField name="order">
                {(field) => (
                  <field.FieldNumber
                    label="Ordem"
                    min={0}
                  />
                )}
              </form.AppField>
              <form.AppField name="time_per_question">
                {(field) => (
                  <field.FieldNumber
                    label="Tempo por Questao (s)"
                    min={10}
                  />
                )}
              </form.AppField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <form.Field name="gradient">
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
              </form.Field>
              <form.AppField name="category_color">
                {(field) => (
                  <field.FieldText
                    label="Cor da Categoria"
                    placeholder="Ex: purple"
                  />
                )}
              </form.AppField>
            </div>

            <Separator />

            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateForm(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {createMutation.isPending ? 'Criando...' : 'Criar Modulo'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation AlertDialog */}
      <AlertDialog
        open={!!deleteModuleId}
        onOpenChange={(open) => !open && setDeleteModuleId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex justify-center mb-2">
              <AlertTriangle className="w-12 h-12 text-destructive" />
            </div>
            <AlertDialogTitle className="text-center">
              Excluir Modulo
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Tem certeza que deseja excluir este modulo? Todas as questoes
              associadas tambem serao removidas. Essa acao nao pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogCancel>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteModuleId && deleteMutation.mutate(deleteModuleId)
              }
              disabled={deleteMutation.isPending}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {deleteMutation.isPending ? 'Excluindo...' : 'Confirmar Exclusao'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modules Grid */}
      {modules && modules.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Nenhum modulo cadastrado
            </h3>
            <p className="text-muted-foreground mb-6">
              Crie o primeiro modulo para comecar.
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4" />
              Criar Modulo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules
            ?.sort((a, b) => a.order - b.order)
            .map((mod) => (
              <Card
                key={mod.id}
                className={cn(
                  'group relative transition-all duration-200 hover:border-primary/50',
                  !mod.active && 'opacity-50',
                )}
              >
                <CardContent className="pt-6">
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge
                      variant="outline"
                      className={cn(
                        mod.active
                          ? 'bg-success/10 text-success border-success/30'
                          : 'bg-destructive/10 text-destructive border-destructive/30',
                      )}
                    >
                      {mod.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>

                  {/* Module Info */}
                  <div className="mb-4">
                    <span className="text-3xl">{mod.icon}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-1">
                    {mod.title}
                  </h3>
                  <p className="text-sm text-primary mb-3">{mod.label}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {mod.description}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <span>Ordem: {mod.order}</span>
                    <span>{mod.time_per_question}s/questao</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link
                        to="/admin/modules/$moduleId"
                        params={{ moduleId: mod.id }}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Editar
                      </Link>
                    </Button>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setDeleteModuleId(mod.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Excluir modulo</TooltipContent>
                    </Tooltip>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}
