import type { TemplateField } from '@/features/template/types';

type TemplateInputs = Record<string, string | string[]>;
type UploadedByField = Record<string, string[]>;

interface BuildTemplateInputsParams {
  fields: TemplateField[];
  uploadedByField: UploadedByField;
  getStringValue: (key: string) => string;
  getTagsValue: (key: string) => string[];
}

export const buildTemplateInputs = ({
  fields,
  uploadedByField,
  getStringValue,
  getTagsValue,
}: BuildTemplateInputsParams): TemplateInputs => {
  const templateInputs: TemplateInputs = {};

  fields.forEach((field) => {
    if (field.type === 'file') {
      const single = uploadedByField[field.key]?.[0];
      if (single) templateInputs[field.key] = single;
      return;
    }

    if (field.type === 'files') {
      const many = uploadedByField[field.key] ?? [];
      if (many.length > 0) templateInputs[field.key] = many;
      return;
    }

    if (field.type === 'tags') {
      const tags = getTagsValue(field.key);
      if (tags.length > 0) templateInputs[field.key] = tags;
      return;
    }

    const textValue = getStringValue(field.key).trim();
    if (textValue) templateInputs[field.key] = textValue;
  });

  return templateInputs;
};

export const extractReferenceUrls = (uploadedByField: UploadedByField) => {
  return Object.values(uploadedByField).flat();
};
