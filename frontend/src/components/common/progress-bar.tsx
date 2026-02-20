import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export default function ProgressBar({
  current,
  total,
  className,
}: ProgressBarProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className={cn('w-full', className)}>
      <div className="flex justify-between text-sm text-muted-foreground mb-1">
        <span>Progresso</span>
        <span>
          {current}/{total}
        </span>
      </div>
      <Progress
        value={percentage}
        className="h-2"
      />
    </div>
  );
}
