import type React from 'react';
import AddIcon from '@/assets/add.svg';
import CloseIcon from '@/assets/close-line.svg';
import { TARGET_KEYWORDS } from '@/features/template/constants/templateConfig';
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
  const maxItems = field.maxItems ?? 5;
  const showPresets = field.key.includes('audience');

  return (
    <FormRow label={field.label} required={field.required}>
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] p-[8px_12px] flex flex-wrap gap-[6px] min-h-[48px]">
        {selectedTags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-[4px] bg-[#EFF6FF] border border-[#155DFC] rounded-full px-[10px] py-[3px] text-[13px] text-[#0F172B]"
          >
            {tag}
            <button onClick={() => onRemoveTag(tag)}>
              <img src={CloseIcon} className="w-[12px] h-[12px]" />
            </button>
          </span>
        ))}
        <input
          value={currentTagInput}
          onChange={(event) => {
            onTagInputChange(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ';') {
              event.preventDefault();
              onAddTag(currentTagInput);
            }
            if (
              event.key === 'Backspace' &&
              !currentTagInput &&
              selectedTags.length > 0
            ) {
              const lastTag = selectedTags[selectedTags.length - 1];
              onRemoveTag(lastTag);
            }
          }}
          placeholder={
            selectedTags.length === 0
              ? `${field.label}을(를) 입력해 주세요 (최대 ${maxItems}개)`
              : ''
          }
          className="flex-1 outline-none text-[14px] min-w-[180px] placeholder:text-[#94A3B8] bg-transparent"
        />
      </div>
      <button
        onClick={() => onAddTag(currentTagInput)}
        className="mt-[8px] w-full border border-dashed border-[#155DFC] py-[8px] rounded-[12px] text-[14px] text-[#0F172B] flex items-center justify-center gap-[4px]"
      >
        <img src={AddIcon} className="w-[14px] h-[14px]" />
        직접추가
      </button>
      {showPresets && (
        <div className="mt-[12px] grid grid-cols-7 gap-[14px]">
          {TARGET_KEYWORDS.map((keyword) => (
            <button
              key={keyword}
              onClick={() => {
                if (selectedTags.includes(keyword)) onRemoveTag(keyword);
                else onAddTag(keyword);
              }}
              className={`px-[14px] py-[5px] rounded-[12px] border text-[13px] whitespace-nowrap border-[#155DFC] text-[#0F172B] ${
                selectedTags.includes(keyword) ? ' bg-[#EFF6FF]' : ''
              }`}
            >
              {keyword}
            </button>
          ))}
        </div>
      )}
    </FormRow>
  );
};
