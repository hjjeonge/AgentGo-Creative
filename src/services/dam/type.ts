export interface UploaderInfo {
  id: string;
  name: string;
  email: string;
}

export interface FolderNode {
  id: string;
  name: string;
  is_fixed?: boolean;
  children?: FolderNode[];
}

export interface AssetSummary {
  id: string;
  name: string;
  file_type: string;
  file_size: string;
  thumbnail_url?: string | null;
  uploaded_by: string;
  updated_at: string;
  metadata?: Record<string, unknown> | null;
}

export interface AssetDetail {
  id: string;
  name: string;
  file_type: string;
  file_url: string;
  file_size: string;
  uploaded_by: string;
  metadata?: Record<string, unknown> | null;
  reference_images?: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface AssetListResponse {
  items: AssetSummary[];
  total: number;
}

export interface AssetPermission {
  id: string;
  name: string;
  email: string;
  access_level: 'owner' | 'change-permissions' | 'can-edit' | 'can-view';
}

export interface WorkspaceTask {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  creator: {
    name: string;
    avatar?: string;
  };
  created_at: string;
  due_date: string;
  assignee?: string;
  linked_asset_id?: string;
}

export interface CollectionItem {
  id: string;
  name: string;
  description?: string;
  asset_ids: string[];
  share_token?: string;
}

export interface ListAssetsParams {
  keyword?: string;
  file_type?: string;
  user_name?: string;
  date_from?: string;
  date_to?: string;
  folder_id?: string;
}

export type DevAsset = AssetDetail & {
  folder_id?: string;
};
