import type React from 'react';
import { useRef } from 'react';
import { Paperclip } from 'lucide-react';

import type { TemplateField } from '@/features/template/types';

import { ChannelSelectField } from './fields/ChannelSelectField';
import { FileField } from './fields/FileField';
import { SelectField } from './fields/SelectField';
import { SizeField } from './fields/SizeField';
import { TagsField } from './fields/TagsField';
import { TextareaField } from './fields/TextareaField';
import { TextField } from './fields/TextField';
import { ToggleField } from './fields/ToggleField';
import { UploadedImageCard } from './fields/UploadedImageCard';
import { FormRow } from './FormRow';

interface TemplateFieldRendererProps {
  field: TemplateField;
  stringValue: string;
  selectedTags: string[];
  selectedFiles: File[];
  currentTagInput: string;
  onSetStringValue: (value: string) => void;
  onSetTagInput: (value: string) => void;
  onAddTag: (raw: string) => void;
  onRemoveTag: (tag: string) => void;
  onSingleFileChange: (selected: File | null) => void;
  onMultiFilesChange: (selected: File[]) => void;
  onRemoveFile: (index: number) => void;
  refFile?: File | null;
  onRefFileChange?: (file: File | null) => void;
}

export const TemplateFieldRenderer: React.FC<TemplateFieldRendererProps> = ({
  field,
  stringValue,
  selectedTags,
  selectedFiles,
  currentTagInput,
  onSetStringValue,
  onSetTagInput,
  onAddTag,
  onRemoveTag,
  onSingleFileChange,
  onMultiFilesChange,
  onRemoveFile,
  refFile,
  onRefFileChange,
}) => {
  const refInputRef = useRef<HTMLInputElement>(null);

  const mainField = (() => {
    if (field.type === 'file' || field.type === 'files') {
      return (
        <FileField
          field={field}
          selectedFiles={selectedFiles}
          onSingleFileChange={onSingleFileChange}
          onMultiFilesChange={onMultiFilesChange}
          onRemoveFile={onRemoveFile}
        />
      );
    }

    if (field.type === 'tags') {
      return (
        <TagsField
          field={field}
          selectedTags={selectedTags}
          currentTagInput={currentTagInput}
          onTagInputChange={onSetTagInput}
          onAddTag={onAddTag}
          onRemoveTag={onRemoveTag}
        />
      );
    }

    if (field.type === 'channel_select') {
      return (
        <ChannelSelectField
          field={field}
          selectedChannels={selectedTags}
          onAddTag={onAddTag}
          onRemoveTag={onRemoveTag}
        />
      );
    }

    if (field.type === 'textarea') {
      return (
        <TextareaField
          field={field}
          value={stringValue}
          onChange={onSetStringValue}
        />
      );
    }

    if (field.type === 'select') {
      return (
        <SelectField
          field={field}
          value={stringValue}
          onChange={onSetStringValue}
        />
      );
    }

    if (field.type === 'size') {
      return (
        <SizeField
          field={field}
          value={stringValue}
          onChange={onSetStringValue}
        />
      );
    }

    if (field.type === 'toggle') {
      return (
        <ToggleField
          field={field}
          value={stringValue}
          onChange={onSetStringValue}
        />
      );
    }

    return (
      <TextField
        field={field}
        value={stringValue}
        onChange={onSetStringValue}
      />
    );
  })();

  if (!field.withRef) return mainField;

  return (
    <>
      {mainField}
      <FormRow label="레퍼런스 이미지">
        <input
          ref={refInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            onRefFileChange?.(file);
            e.target.value = '';
          }}
        />
        {refFile ? (
          <UploadedImageCard
            file={refFile}
            onRemove={() => onRefFileChange?.(null)}
          />
        ) : (
          <button
            type="button"
            onClick={() => refInputRef.current?.click()}
            className="flex items-center gap-1.5 text-sm text-[#1447E6] border border-[#1447E6] rounded-xs px-3 py-1.5 hover:bg-[#EFF6FF] transition-colors"
          >
            <Paperclip size={14} />
            이미지 추가 (선택)
          </button>
        )}
      </FormRow>
    </>
  );
};
