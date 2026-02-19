import { Label } from '@/components/ui/label';
import { useFieldContext } from '@/integrations/tanstack-form/form-context';

interface FieldTextareaProps {
  label: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  className?: string;
}

export default function FieldTextarea({
  label,
  placeholder,
  required,
  rows = 4,
  className,
}: FieldTextareaProps) {
  const field = useFieldContext<string>();

  return (
    <div className={className}>
      <Label className="mb-1.5">{label}</Label>
      <textarea
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      />
      {field.state.meta.errors.length > 0 && (
        <p className="text-destructive text-xs mt-1.5">
          {field.state.meta.errors[0]}
        </p>
      )}
    </div>
  );
}
