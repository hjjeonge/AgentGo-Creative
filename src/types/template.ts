export type TemplateFieldType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'tags'
  | 'size'
  | 'file'
  | 'files';

export interface TemplateField {
  key: string;
  label: string;
  type: TemplateFieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  maxItems?: number;
}

export interface TemplateConfig {
  key: string;
  title: string;
  comment: string;
  icon: string;
  aiStatus: 'available' | 'planned';
  aiFeature: string;
  fields: TemplateField[];
}
