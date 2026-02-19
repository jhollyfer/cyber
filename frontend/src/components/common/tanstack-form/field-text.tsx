import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFieldContext } from '@/integrations/tanstack-form/form-context';

interface FieldTextProps {
  label: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export default function FieldText({
  label,
  placeholder,
  required,
  className,
}: FieldTextProps) {
  const field = useFieldContext<string>();

  return (
    <div className={className}>
      <Label className="mb-1.5">{label}</Label>
      <Input
        type="text"
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        placeholder={placeholder}
        required={required}
      />
      {field.state.meta.errors.length > 0 && (
        <p className="text-destructive text-xs mt-1.5">
          {field.state.meta.errors[0]}
        </p>
      )}
    </div>
  );
}
