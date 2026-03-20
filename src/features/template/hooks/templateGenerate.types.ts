import type { TemplateConfig } from '@/features/template/types';

export type FormFiles = Record<string, File[]>;

export interface TemplateGenerateContext {
  template: TemplateConfig;
  files: FormFiles;
  getStringValue: (key: string) => string;
  getTagsValue: (key: string) => string[];
}

export interface TemplateGenerateResult {
  imageUrl?: string;
  prompt: string;
  navigateToEditor?: boolean;
  message?: string;
}
