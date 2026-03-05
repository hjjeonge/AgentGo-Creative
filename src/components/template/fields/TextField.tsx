import type React from 'react';
import type { TemplateField } from '../../../types/template';
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
        className="w-full h-[44px] border border-[#CBD5E1] rounded-[8px] px-[12px] text-[14px] text-[#0F172B] placeholder:text-[#94A3B8] outline-none focus:border-[#155DFC]"
      />
    </FormRow>
  );
};
