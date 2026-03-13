import type React from 'react';
import type { TemplateField } from '@/features/template/types';
import { FormRow } from '../FormRow';

interface SelectFieldProps {
  field: TemplateField;
  value: string;
  onChange: (value: string) => void;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  field,
  value,
  onChange,
}) => {
  return (
    <FormRow label={field.label} required={field.required}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full h-[44px] border border-[#CBD5E1] rounded-[8px] px-[12px] text-[14px] text-[#0F172B] outline-none focus:border-[#155DFC] bg-white"
      >
        <option value="">선택해 주세요</option>
        {(field.options ?? []).map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </FormRow>
  );
};
