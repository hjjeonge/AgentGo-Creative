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
  return (
    <FormRow label={field.label} required={field.required}>
      <div className="flex flex-col gap-3">
        <span className="text-sm text-text-tertiary">
          어울리는 키워드를 골라주세요.
        </span>
        {selectedTags.length > 0 && (
          <div className="flex items-center flex-wrap gap-3">
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
          placeholder="어울리는 키워드를 입력 후 엔터를 눌러주세요."
          className="border border-border-neutral placeholder:text-[#90A1B9] px-3 py-1.5 rounded-xs text-sm text-text-primary outline-none focus:border-[#1447E6] shadow-[0_1px_2px_0_rgba(50,56,62,0.08)]"
        />
      </div>
    </FormRow>
  );
};
