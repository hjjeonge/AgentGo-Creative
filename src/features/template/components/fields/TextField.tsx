import type React from 'react';

import type { TemplateField } from '@/features/template/types';

import { FormRow } from '../FormRow';

interface TextFieldProps {
  field: TemplateField;
  value: string;
  onChange: (value: string) => void;
}

export const TextField: React.FC<TextFieldProps> = ({
  field,
  value,
  onChange,
}) => {
  return (
    <FormRow label={field.label} required={field.required}>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={field.placeholder}
        className="w-full border border-border-neutral rounded-xs px-3 py-1.5 text-sm text-text-primary placeholder:text-[#90A1B9] outline-none focus:border-[#1447E6] bg-white shadow-[0_1px_2px_0_rgba(50,56,62,0.08)]"
      />
    </FormRow>
  );
};
