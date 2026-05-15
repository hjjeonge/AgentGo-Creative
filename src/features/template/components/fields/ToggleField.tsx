import type React from 'react';

import { CustomSwitch } from '@/commons/components/CustomSwitch';
import type { TemplateField } from '@/features/template/types';

import { FormRow } from '../FormRow';

interface ToggleFieldProps {
  field: TemplateField;
  value: string;
  onChange: (value: string) => void;
}

export const ToggleField: React.FC<ToggleFieldProps> = ({
  field,
  value,
  onChange,
}) => {
  const checked = value !== 'false';
  return (
    <FormRow label={field.label} required={field.required}>
      <div className="flex items-center gap-3">
        <CustomSwitch
          checked={checked}
          onCheckedChange={(val) => onChange(val ? 'true' : 'false')}
        />
        <span className="text-sm text-text-secondary">
          {checked ? '켜짐' : '꺼짐'}
        </span>
      </div>
    </FormRow>
  );
};
