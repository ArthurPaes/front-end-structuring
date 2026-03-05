/**
 * @file FormField molecule — label + input + error in one reusable unit.
 *
 * ATOMIC DESIGN: Molecules combine atoms into functional groups.
 * A FormField is Button-level reusable across any form.
 */
import { Input, type InputProps } from '@/components/Input';

interface FormFieldProps extends InputProps {
  /** Label text (passed to Input atom) */
  label: string;
}

export function FormField({ label, ...inputProps }: FormFieldProps) {
  return <Input label={label} {...inputProps} />;
}
