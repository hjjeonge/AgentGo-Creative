import type React from 'react';
import type { TemplateField } from '@/features/template/types';
import { FormRow } from '../FormRow';
import { SizePreviewIcon } from '../SizePreviewIcon';

interface SizeFieldProps {
  field: TemplateField;
  value: string;
  onChange: (value: string) => void;
}

export const SizeField: React.FC<SizeFieldProps> = ({
  field,
  value,
  onChange,
}) => {
  const options = field.options ?? ['1:1', '4:5', '16:9', '9:16'];

  return (
    <FormRow label={field.label} required={field.required}>
      <div className="flex gap-[12px] flex-wrap">
        {options.map((size) => (
          <button
            key={size}
            onClick={() => onChange(size)}
            className={`w-[118px] h-[72px] border border-[#155DFC] rounded-[12px] flex items-center justify-center gap-[8px] text-[14px] text-[#0F172B] ${
              value === size ? 'bg-[#EFF6FF]' : ''
            }`}
          >
            <SizePreviewIcon ratio={size} active={value === size} />
            <span>{size}</span>
          </button>
        ))}
      </div>
    </FormRow>
  );
};
