import type React from 'react';
import { X } from 'lucide-react';

import { Chip } from '@/commons/components/Chip';
import type { TemplateField } from '@/features/template/types';

import { FormRow } from '../FormRow';

interface TagsFieldProps {
  field: TemplateField;
  selectedTags: string[];
  currentTagInput: string;
  onTagInputChange: (value: string) => void;
  onAddTag: (raw: string) => void;
  onRemoveTag: (tag: string) => void;
}

export const TagsField: React.FC<TagsFieldProps> = ({
  field,
  selectedTags,
  currentTagInput,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
}) => {
  const hasSuggestions = (field.options?.length ?? 0) > 0;

  return (
    <FormRow label={field.label} required={field.required}>
      <div className="flex flex-col gap-3">
        {!hasSuggestions && (
          <span className="text-sm text-text-tertiary">
            어울리는 키워드를 골라주세요.
          </span>
        )}

        {selectedTags.length > 0 && (
          <div className="flex items-center flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                endDecorator={<X size={16} className="text-[#1447E6]" />}
                onClick={() => onRemoveTag(tag)}
              />
            ))}
          </div>
        )}

        {hasSuggestions && (
          <div className="flex flex-wrap gap-2">
            {field.options!.map((option) => {
              const isSelected = selectedTags.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  disabled={isSelected}
                  onClick={() => onAddTag(option)}
                  className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
                    isSelected
                      ? 'border-[#CBD5E1] bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed'
                      : 'border-[#CBD5E1] bg-white text-text-primary hover:border-[#1447E6] hover:bg-[#EFF6FF] hover:text-[#1447E6] cursor-pointer'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        )}

        <input
          value={currentTagInput}
          onChange={(event) => {
            onTagInputChange(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              onAddTag(currentTagInput);
            }
          }}
          placeholder={
            hasSuggestions
              ? '직접 입력하려면 입력 후 엔터를 눌러주세요. (선택)'
              : '어울리는 키워드를 입력 후 엔터를 눌러주세요.'
          }
          className="border border-border-neutral placeholder:text-[#90A1B9] px-3 py-1.5 rounded-xs text-sm text-text-primary outline-none focus:border-[#1447E6] shadow-[0_1px_2px_0_rgba(50,56,62,0.08)]"
        />
      </div>
    </FormRow>
  );
};
