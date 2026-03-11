import type React from 'react';
import type { TemplateField } from '../../types/template';
import { TemplateFieldRenderer } from './TemplateFieldRenderer';

type FormFiles = Record<string, File[]>;
type TagInput = Record<string, string>;

interface TemplateFieldsSectionProps {
  fields: TemplateField[];
  files: FormFiles;
  tagInput: TagInput;
  getStringValue: (key: string) => string;
  getTagsValue: (key: string) => string[];
  setStringValue: (key: string, value: string) => void;
  setTagInputValue: (key: string, value: string) => void;
  addTag: (field: TemplateField, raw: string) => void;
  removeTag: (fieldKey: string, tag: string) => void;
  handleSingleFile: (fieldKey: string, selected: File | null) => void;
  handleMultiFiles: (fieldKey: string, selected: File[]) => void;
  removeFile: (fieldKey: string, index: number) => void;
}

export const TemplateFieldsSection: React.FC<TemplateFieldsSectionProps> = ({
  fields,
  files,
  tagInput,
  getStringValue,
  getTagsValue,
  setStringValue,
  setTagInputValue,
  addTag,
  removeTag,
  handleSingleFile,
  handleMultiFiles,
  removeFile,
}) => {
  return (
    <div className="flex flex-col gap-[32px]">
      {fields.map((field) => (
        <TemplateFieldRenderer
          key={field.key}
          field={field}
          stringValue={getStringValue(field.key)}
          selectedTags={getTagsValue(field.key)}
          selectedFiles={files[field.key] ?? []}
          currentTagInput={tagInput[field.key] ?? ''}
          onSetStringValue={(value) => setStringValue(field.key, value)}
          onSetTagInput={(value) => setTagInputValue(field.key, value)}
          onAddTag={(raw) => addTag(field, raw)}
          onRemoveTag={(tag) => removeTag(field.key, tag)}
          onSingleFileChange={(selected) =>
            handleSingleFile(field.key, selected)
          }
          onMultiFilesChange={(selected) =>
            handleMultiFiles(field.key, selected)
          }
          onRemoveFile={(index) => removeFile(field.key, index)}
        />
      ))}
    </div>
  );
};
