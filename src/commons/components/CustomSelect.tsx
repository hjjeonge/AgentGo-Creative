import type React from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  optionList: SelectOption[];
  selectedOption?: SelectOption;
  onOptionSelect: (option: SelectOption) => void;
  placeholder?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  optionList,
  selectedOption,
  onOptionSelect,
  placeholder = '선택',
}) => {
  return (
    <Select
      value={selectedOption?.value}
      onValueChange={(selectedValue) => {
        const selected = optionList.find(
          (option) => option.value === selectedValue,
        );

        if (!selected) return;

        onOptionSelect(selected);
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {optionList.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
