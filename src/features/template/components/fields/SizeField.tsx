import type React from 'react';

import {
  SIZE_OPTION_MAP,
  COMMON_SIZE_RATIOS,
} from '@/features/template/constants/sizeOptions';
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
  const options = field.options ?? COMMON_SIZE_RATIOS;

  return (
    <FormRow label={field.label} required={field.required}>
      <div className="flex gap-[12px] flex-wrap">
        {options.map((size) => {
          const meta = SIZE_OPTION_MAP[size];
          return (
            <button
              key={size}
              onClick={() => onChange(size)}
              className={`w-[118px] h-auto py-3 border border-[#155DFC] rounded-[12px] flex flex-col items-center justify-center gap-[6px] text-[14px] text-[#0F172B] ${
                value === size ? 'bg-[#EFF6FF]' : ''
              }`}
            >
              <div className="flex items-center gap-[8px]">
                <SizePreviewIcon ratio={size} active={value === size} />
                <span>{size}</span>
              </div>
              {meta && (
                <span className="text-[11px] text-[#64748B] text-center px-1 leading-tight">
                  {meta.note}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </FormRow>
  );
};
