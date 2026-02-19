import { Trophy } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { RankingEntry } from '@/lib/interfaces';
import { cn, formatNota } from '@/lib/utils';

interface RankingTableProps {
  entries: Array<RankingEntry>;
  currentUserId?: string;
}

export default function RankingTable({
  entries,
  currentUserId,
}: RankingTableProps): React.ReactElement {
  const getMedalEmoji = (position: number): string | null => {
    if (position === 0) return '\u{1F947}';
    if (position === 1) return '\u{1F948}';
    if (position === 2) return '\u{1F949}';
    return null;
  };

  if (entries.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhum aluno completou modulos ainda.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden p-0">
      <ScrollArea className="w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-6 py-4">#</TableHead>
              <TableHead className="px-6 py-4">Aluno</TableHead>
              <TableHead className="px-6 py-4 text-center">
                Nota Media
              </TableHead>
              <TableHead className="px-6 py-4 text-center">
                Fases
              </TableHead>
              <TableHead className="px-6 py-4 text-center">
                Pontuacao
              </TableHead>
              <TableHead className="px-6 py-4 text-center">
                Melhor Sequencia
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry, index) => (
              <TableRow
                key={entry.user_id}
                className={cn(
                  'hover:bg-accent/50',
                  entry.user_id === currentUserId && 'bg-primary/5',
                )}
              >
                <TableCell className="px-6 py-4">
                  <span className="text-lg">
                    {getMedalEmoji(index) || (
                      <span className="text-muted-foreground text-sm">{index + 1}</span>
                    )}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span
                    className={cn(
                      'font-medium',
                      entry.user_id === currentUserId && 'text-primary',
                    )}
                  >
                    {entry.name}
                    {entry.user_id === currentUserId && (
                      <span className="ml-2 text-xs text-primary">
                        (voce)
                      </span>
                    )}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 text-center">
                  <span
                    className={cn(
                      'font-bold',
                      entry.average_nota >= 6 ? 'text-cyber-green' : 'text-cyber-red',
                    )}
                  >
                    {formatNota(entry.average_nota)}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-1.5 flex-wrap">
                    {entry.module_notas && entry.module_notas.length > 0 ? (
                      entry.module_notas.map((mn, i) => (
                        <Tooltip key={mn.module_id}>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="outline"
                              className={cn(
                                'font-bold',
                                mn.nota >= 6
                                  ? 'bg-cyber-green/10 text-cyber-green border-cyber-green/30'
                                  : 'bg-cyber-red/10 text-cyber-red border-cyber-red/30',
                              )}
                            >
                              F{i + 1}: {formatNota(mn.nota)}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            Fase {i + 1}: {formatNota(mn.nota)}
                          </TooltipContent>
                        </Tooltip>
                      ))
                    ) : (
                      <span className="text-muted-foreground">
                        {entry.modules_completed}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-center text-muted-foreground">
                  {entry.total_score.toLocaleString()}
                </TableCell>
                <TableCell className="px-6 py-4 text-center text-muted-foreground">
                  {entry.best_streak}x
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Card>
  );
}
