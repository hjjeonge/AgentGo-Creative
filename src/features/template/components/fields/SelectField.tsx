import type React from 'react';

import { CustomSelect } from '@/commons/components/CustomSelect';
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
  const optionList = (field.options ?? []).map((option) => ({
    value: option,
    label: option,
  }));

  const selectedOption = optionList.find((option) => option.value === value);

  return (
    <FormRow label={field.label} required={field.required}>
      <CustomSelect
        optionList={optionList}
        selectedOption={selectedOption}
        onOptionSelect={(option) => onChange(option.value)}
        placeholder={field.placeholder ?? '선택'}
      />
    </FormRow>
  );
};
