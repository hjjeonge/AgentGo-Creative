import type React from 'react';
import type { TemplateField } from '@/features/template/types';
import { FormRow } from '../FormRow';

interface TextareaFieldProps {
  field: TemplateField;
  value: string;
  onChange: (value: string) => void;
}

export const TextareaField: React.FC<TextareaFieldProps> = ({
  field,
  value,
  onChange,
}) => {
  return (
    <FormRow label={field.label} required={field.required}>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={field.placeholder}
        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] p-[12px] text-[14px] resize-none h-[120px] placeholder:text-[#94A3B8] outline-none"
      />
    </FormRow>
  );
};
