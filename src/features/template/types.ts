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

export interface FavoriteTemplateRes {
  id: string;
  imgUrl: string;
  title: string;
  summary: string;
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
