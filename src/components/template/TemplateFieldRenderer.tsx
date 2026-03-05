import type React from 'react';
import type { TemplateField } from '../../types/template';
import { FileField } from './fields/FileField';
import { SelectField } from './fields/SelectField';
import { SizeField } from './fields/SizeField';
import { TagsField } from './fields/TagsField';
import { TextareaField } from './fields/TextareaField';
import { TextField } from './fields/TextField';

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
}) => {
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

  return (
    <TextField field={field} value={stringValue} onChange={onSetStringValue} />
  );
};
