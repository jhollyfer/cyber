import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createLazyFileRoute } from '@tanstack/react-router';
import {
  Users,
  Search,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  BookOpen,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { queryKeys } from '@/hooks/tanstack-query/_query-keys';
import { api } from '@/lib/api';
import type { StudentDetail } from '@/lib/interfaces';
import { cn, formatNota, formatPhone } from '@/lib/utils';
import TableStudentsSkeleton from './-components/table-students-skeleton';

export const Route = createLazyFileRoute('/_private/admin/students/')({
  component: AdminStudentsPage,
});

function AdminStudentsPage(): React.ReactElement {
  const { search: searchQuery = '' } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(
    null,
  );

  const {
    data: students,
    isLoading,
    error,
  } = useQuery<StudentDetail[]>({
    queryKey: queryKeys.stats.students(),
    queryFn: async () => {
      const response = await api.get('/stats/students');
      return response.data;
    },
  });

  function toggleExpand(studentId: string): void {
    setExpandedStudentId((prev) => (prev === studentId ? null : studentId));
  }

  function getNotaColor(nota: number): string {
    return nota >= 6 ? 'text-success' : 'text-destructive';
  }

  function getNotaBgColor(nota: number): string {
    return nota >= 6 ? 'bg-success/10' : 'bg-destructive/10';
  }

  const filteredStudents = students?.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (isLoading) {
    return <TableStudentsSkeleton />;
  }

  if (error) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-muted-foreground">
            Erro ao carregar alunos. Tente novamente.
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
          <h1 className="text-3xl font-bold text-primary">Alunos</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {students?.length ?? 0} aluno{students?.length !== 1 ? 's' : ''}{' '}
            cadastrado{students?.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) =>
            navigate({
              search: (prev) => ({
                ...prev,
                search: e.target.value || undefined,
              }),
              replace: true,
            })
          }
          placeholder="Buscar aluno por nome..."
          className="pl-10"
        />
      </div>

      {/* Students Table */}
      {filteredStudents && filteredStudents.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery
                ? 'Nenhum aluno encontrado'
                : 'Nenhum aluno cadastrado'}
            </h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? `Nenhum resultado para "${searchQuery}".`
                : 'Os alunos aparecerao aqui apos se registrarem.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <ScrollArea className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6 py-4">Nome</TableHead>
                  <TableHead className="px-6 py-4">
                    Telefone
                  </TableHead>
                  <TableHead className="px-6 py-4 text-center">
                    Nota Media
                  </TableHead>
                  <TableHead className="px-6 py-4 text-center">
                    Modulos Completos
                  </TableHead>
                  <TableHead className="px-6 py-4 text-center">
                    Data de Cadastro
                  </TableHead>
                  <TableHead className="px-6 py-4 text-center w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents?.map((student) => (
                  <StudentRow
                    key={student.id}
                    student={student}
                    isExpanded={expandedStudentId === student.id}
                    onToggleExpand={() => toggleExpand(student.id)}
                    getNotaColor={getNotaColor}
                    getNotaBgColor={getNotaBgColor}
                  />
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </Card>
      )}
    </div>
  );
}

interface StudentRowProps {
  student: StudentDetail;
  isExpanded: boolean;
  onToggleExpand: () => void;
  getNotaColor: (nota: number) => string;
  getNotaBgColor: (nota: number) => string;
}

function StudentRow({
  student,
  isExpanded,
  onToggleExpand,
  getNotaColor,
  getNotaBgColor,
}: StudentRowProps): React.ReactElement {
  const formattedDate = new Date(student.created_at).toLocaleDateString(
    'pt-BR',
    {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    },
  );

  return (
    <>
      <TableRow
        className={cn(
          'hover:bg-accent/50 cursor-pointer',
          isExpanded && 'bg-accent/30',
        )}
        onClick={onToggleExpand}
      >
        <TableCell className="px-6 py-4">
          <span className="font-medium">{student.name}</span>
        </TableCell>
        <TableCell className="px-6 py-4">
          <span className="text-muted-foreground text-sm">
            {formatPhone(student.phone)}
          </span>
        </TableCell>
        <TableCell className="px-6 py-4 text-center">
          <Badge
            variant="outline"
            className={cn(
              'text-sm font-bold',
              getNotaColor(student.average_nota),
              getNotaBgColor(student.average_nota),
            )}
          >
            {formatNota(student.average_nota)}
          </Badge>
        </TableCell>
        <TableCell className="px-6 py-4 text-center">
          <span className="text-muted-foreground">{student.modules_completed}</span>
        </TableCell>
        <TableCell className="px-6 py-4 text-center">
          <span className="text-muted-foreground text-sm">{formattedDate}</span>
        </TableCell>
        <TableCell className="px-6 py-4 text-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand();
            }}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </TableCell>
      </TableRow>

      {/* Expanded Module Grades */}
      {isExpanded && (
        <TableRow>
          <TableCell
            colSpan={6}
            className="px-6 py-0"
          >
            <div className="py-4 pl-4 border-l-2 border-primary/30 ml-2 mb-4">
              {student.modules.length === 0 ? (
                <div className="flex items-center gap-3 text-muted-foreground py-2">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm">
                    Nenhum modulo completado ainda.
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-3">
                    Desempenho por Modulo
                  </p>
                  {student.modules.map((mod) => {
                    const formattedModDate = mod.finished_at
                      ? new Date(mod.finished_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
                      : '-';

                    return (
                      <div
                        key={mod.module_id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium">
                            {mod.module_title}
                          </span>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="text-center">
                            <p className="text-muted-foreground text-xs">Nota</p>
                            <p
                              className={cn(
                                'font-bold',
                                getNotaColor(mod.nota),
                              )}
                            >
                              {formatNota(mod.nota)}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-muted-foreground text-xs">Acertos</p>
                            <p className="text-muted-foreground">
                              {mod.correct_answers}/{mod.total_answered}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-muted-foreground text-xs">Pontos</p>
                            <p className="text-muted-foreground">
                              {mod.score.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-muted-foreground text-xs">Data</p>
                            <p className="text-muted-foreground">{formattedModDate}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
