import type { TemplateField } from '@/features/template/types';

type TemplateInputs = Record<string, string | string[]>;

export const buildPrompt = (
  templateTitle: string,
  fields: TemplateField[],
  templateInputs: TemplateInputs,
) => {
  const lines: string[] = [templateTitle];

  fields.forEach((field) => {
    const value = templateInputs[field.key];
    if (!value) return;
    if (Array.isArray(value) && value.length === 0) return;
    if (typeof value === 'string' && value.trim().length === 0) return;

    const serialized = Array.isArray(value) ? value.join(', ') : value;
    lines.push(`${field.label}: ${serialized}`);
  });

  return lines.join('\n');
};
