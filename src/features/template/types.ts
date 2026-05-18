export type TemplateFieldType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'tags'
  | 'size'
  | 'file'
  | 'files'
  | 'channel_select'
  | 'toggle';

export interface TemplateField {
  key: string;
  label: string;
  type: TemplateFieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  maxItems?: number;
  isTargetImage?: boolean;
  defaultValue?: string;
  withRef?: boolean;
  showWhen?: { key: string; value: string };
}

export interface TemplateConfig {
  key: string;
  title: string;
  comment: string;
  imgSrc: string;
  aiStatus: 'available' | 'planned';
  aiFeature: string;
  fields: TemplateField[];
  isLike: boolean;
}

export interface TemplateRes {
  id: string;
  imgUrl: string;
  title: string;
  summary: string;
  isLike: boolean;
}

export interface CreateNewTemplateReq {
  imgUrl: string;
  title: string;
  summary: string;
  fields: Record<string, string>;
}
