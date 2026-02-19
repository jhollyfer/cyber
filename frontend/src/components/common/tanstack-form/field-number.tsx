import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFieldContext } from '@/integrations/tanstack-form/form-context';

interface FieldNumberProps {
  label: string;
  placeholder?: string;
  required?: boolean;
  min?: number;
  className?: string;
}

export default function FieldNumber({
  label,
  placeholder,
  required,
  min,
  className,
}: FieldNumberProps) {
  const field = useFieldContext<number>();

  return (
    <div className={className}>
      <Label className="mb-1.5">{label}</Label>
      <Input
        type="number"
        value={field.state.value}
        onChange={(e) => field.handleChange(parseInt(e.target.value) || 0)}
        onBlur={field.handleBlur}
        placeholder={placeholder}
        required={required}
        min={min}
      />
      {field.state.meta.errors.length > 0 && (
        <p className="text-destructive text-xs mt-1.5">
          {field.state.meta.errors[0]}
        </p>
      )}
    </div>
  );
}
