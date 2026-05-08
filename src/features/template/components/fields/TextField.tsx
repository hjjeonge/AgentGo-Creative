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
        className="w-full border border-border-neutral rounded-xs px-2 py-3 text-[14px] text-text-primary placeholder:text-[#90A1B9] outline-none focus:border-[#1447E6] bg-white"
      />
    </FormRow>
  );
};
