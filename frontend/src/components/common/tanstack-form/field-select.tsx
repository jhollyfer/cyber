import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFieldContext } from '@/integrations/tanstack-form/form-context';

interface FieldSelectProps {
  label: string;
  options: Array<{ value: string; label: string }>;
  required?: boolean;
  className?: string;
}

export default function FieldSelect({
  label,
  options,
  required,
  className,
}: FieldSelectProps): React.ReactElement {
  const field = useFieldContext<string>();

  return (
    <div className={className}>
      <Label className="mb-1.5">{label}</Label>
      <Select
        value={field.state.value}
        onValueChange={field.handleChange}
        required={required}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {field.state.meta.errors.length > 0 && (
        <p className="text-destructive text-xs mt-1.5">
          {field.state.meta.errors[0]}
        </p>
      )}
    </div>
  );
}
