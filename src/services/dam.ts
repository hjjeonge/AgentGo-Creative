import { del, download, get, patch, post, upload } from './apiClient';

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

const USE_DEV_DUMMY =
  import.meta.env.DEV && import.meta.env.VITE_DAM_USE_DEV_DUMMY !== 'false';

type DevAsset = AssetDetail & {
  folder_id?: string;
};

const DEV_FOLDERS: FolderNode[] = [
  {
    id: 'folder-2026',
    name: '2026',
    children: [
      { id: 'folder-2026-spring', name: 'Spring Campaign' },
      { id: 'folder-2026-summer', name: 'Summer Campaign' },
    ],
  },
  {
    id: 'folder-2025',
    name: '2025',
    children: [{ id: 'folder-2025-archive', name: 'Archive' }],
  },
];

const createDevAssets = (): DevAsset[] => {
  const now = new Date();
  const isoNow = now.toISOString();

  return [
    {
      id: 'dev-asset-1',
      name: 'livingroom-hero.jpg',
      file_type: 'image',
      file_url:
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&auto=format&fit=crop&q=80',
      file_size: '3287342',
      uploaded_by: 'James Rodriguez',
      metadata: {
        status: 'approved',
        title: 'Livingroom Hero',
        description: 'Main visual for 2026 spring campaign.',
        author: 'Creative Team',
        resolution: '3840x2160',
        make: 'Sony',
        model: 'A7R4',
        gps_lat: '37.5665',
        gps_lng: '126.9780',
        gps_alt: '12.5',
        ai_summary: 'Modern, warm, product-focused scene.',
        ai_tags: [
          {
            category: 'Type',
            value: 'Interior',
            reason: 'Object layout and composition match interior scenes.',
          },
          {
            category: 'Mood',
            value: 'Warm',
            reason: 'Color temperature and lighting are warm.',
          },
          {
            category: 'Material',
            value: 'Wood',
            reason: 'Texture features suggest wooden surface.',
          },
        ],
      },
      reference_images: [
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=400&auto=format&fit=crop&q=80',
      ],
      created_at: isoNow,
      updated_at: isoNow,
      folder_id: 'folder-2026-spring',
    },
    {
      id: 'dev-asset-2',
      name: 'product-cut.mp4',
      file_type: 'video',
      file_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      file_size: '73400320',
      uploaded_by: 'Isabella Anderson',
      metadata: {
        status: 'pending',
        title: 'Product Cut',
        description: 'Short ad clip.',
      },
      reference_images: [],
      created_at: isoNow,
      updated_at: isoNow,
      folder_id: 'folder-2026-summer',
    },
    {
      id: 'dev-asset-3',
      name: 'campaign-guide.pdf',
      file_type: 'pdf',
      file_url:
        'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      file_size: '1054720',
      uploaded_by: 'Natalie Clark',
      metadata: {
        status: 'rejected',
        title: 'Guide PDF',
        description: 'Needs revision.',
      },
      reference_images: [],
      created_at: isoNow,
      updated_at: isoNow,
      folder_id: 'folder-2026-spring',
    },
    {
      id: 'dev-asset-4',
      name: 'archive-pack.zip',
      file_type: 'zip',
      file_url: 'https://example.com/archive-pack.zip',
      file_size: '90485760',
      uploaded_by: 'David Garcia',
      metadata: { status: 'none', title: 'Archive Pack' },
      reference_images: [],
      created_at: isoNow,
      updated_at: isoNow,
      folder_id: 'folder-2025-archive',
    },
  ];
};

let devAssets: DevAsset[] = createDevAssets();
let devPermissionsByAsset: Record<string, AssetPermission[]> = {
  'dev-asset-1': [
    {
      id: 'perm-1',
      name: 'Admin',
      email: 'admin@itcen.com',
      access_level: 'owner',
    },
    {
      id: 'perm-2',
      name: 'James Rodriguez',
      email: 'james@itcen.com',
      access_level: 'change-permissions',
    },
    {
      id: 'perm-3',
      name: 'Isabella Anderson',
      email: 'isabella@itcen.com',
      access_level: 'can-view',
    },
  ],
};

let devTasks: WorkspaceTask[] = [
  {
    id: 'task-1',
    title: 'Spring hero metadata review',
    description: 'Check AI tags and publish status before client handoff.',
    status: 'review',
    priority: 'high',
    creator: { name: 'Admin' },
    created_at: new Date().toISOString(),
    due_date: '2026-03-10',
    assignee: 'Me',
    linked_asset_id: 'dev-asset-1',
  },
  {
    id: 'task-2',
    title: 'Video cut upload',
    description: 'Upload final mp4 and assign sharing permissions.',
    status: 'in-progress',
    priority: 'medium',
    creator: { name: 'James Rodriguez' },
    created_at: new Date().toISOString(),
    due_date: '2026-03-14',
    assignee: 'Me',
    linked_asset_id: 'dev-asset-2',
  },
  {
    id: 'task-3',
    title: 'Archive cleanup',
    description: 'Move old campaign assets into collection archive.',
    status: 'todo',
    priority: 'low',
    creator: { name: 'Natalie Clark' },
    created_at: new Date().toISOString(),
    due_date: '2026-03-20',
    assignee: 'Team',
    linked_asset_id: 'dev-asset-4',
  },
];

let devCollections: CollectionItem[] = [
  {
    id: 'coll-summer',
    name: 'Summer Campaign',
    description: 'Summer 2026 visual assets',
    asset_ids: ['dev-asset-1', 'dev-asset-2'],
  },
  {
    id: 'coll-ski',
    name: 'Ski Season 2026',
    description: 'Winter product creatives',
    asset_ids: ['dev-asset-3'],
  },
  {
    id: 'coll-modern',
    name: 'Modern Interior',
    description: 'Interior moodboard set',
    asset_ids: ['dev-asset-1'],
  },
];

const flattenFolders = (folders: FolderNode[]): FolderNode[] => {
  const acc: FolderNode[] = [];
  const walk = (nodes: FolderNode[]) => {
    nodes.forEach((node) => {
      acc.push(node);
      if (node.children?.length) walk(node.children);
    });
  };
  walk(folders);
  return acc;
};

const DEV_FOLDER_IDS = new Set(
  flattenFolders(DEV_FOLDERS).map((folder) => folder.id),
);

const toSummary = (asset: DevAsset): AssetSummary => ({
  id: asset.id,
  name: asset.name,
  file_type: asset.file_type,
  file_size: asset.file_size,
  thumbnail_url: asset.file_url,
  uploaded_by: asset.uploaded_by,
  updated_at: asset.updated_at,
  metadata: asset.metadata,
});

const includesIgnoreCase = (value: string, query: string): boolean =>
  value.toLowerCase().includes(query.toLowerCase());

export async function getFolderTree(): Promise<FolderNode[]> {
  if (USE_DEV_DUMMY) {
    return DEV_FOLDERS;
  }
  return get<FolderNode[]>('/api/dam/folders');
}

export async function listAssets(params?: {
  keyword?: string;
  file_type?: string;
  user_name?: string;
  date_from?: string;
  date_to?: string;
  folder_id?: string;
}): Promise<AssetListResponse> {
  if (USE_DEV_DUMMY) {
    const {
      keyword,
      file_type: fileType,
      user_name: userName,
      date_from: dateFrom,
      date_to: dateTo,
      folder_id: folderId,
    } = params || {};

    const filtered = devAssets.filter((asset) => {
      if (keyword && !includesIgnoreCase(asset.name, keyword)) return false;
      if (fileType && asset.file_type !== fileType) return false;
      if (userName && asset.uploaded_by !== userName) return false;
      if (
        folderId &&
        DEV_FOLDER_IDS.has(folderId) &&
        asset.folder_id !== folderId
      )
        return false;
      if (dateFrom && new Date(asset.updated_at) < new Date(dateFrom))
        return false;
      if (dateTo && new Date(asset.updated_at) > new Date(`${dateTo}T23:59:59`))
        return false;
      return true;
    });

    return {
      items: filtered.map(toSummary),
      total: filtered.length,
    };
  }

  const query = params
    ? '?' +
      new URLSearchParams(
        Object.entries(params).filter(([, v]) => v != null && v !== '') as [
          string,
          string,
        ][],
      ).toString()
    : '';
  return get<AssetListResponse>(`/api/dam/assets${query}`);
}

export async function getAssetDetail(assetId: string): Promise<AssetDetail> {
  if (USE_DEV_DUMMY) {
    const found = devAssets.find((asset) => asset.id === assetId);
    if (!found) {
      throw new Error('Asset not found');
    }
    return found;
  }
  return get<AssetDetail>(`/api/dam/assets/${assetId}`);
}

export async function renameAsset(
  assetId: string,
  name: string,
): Promise<AssetSummary> {
  if (USE_DEV_DUMMY) {
    const target = devAssets.find((asset) => asset.id === assetId);
    if (!target) throw new Error('Asset not found');
    target.name = name;
    target.updated_at = new Date().toISOString();
    return toSummary(target);
  }
  return patch<AssetSummary>(`/api/dam/assets/${assetId}`, { name });
}

export async function copyAsset(assetId: string): Promise<AssetDetail> {
  if (USE_DEV_DUMMY) {
    const target = devAssets.find((asset) => asset.id === assetId);
    if (!target) throw new Error('Asset not found');
    const copied: DevAsset = {
      ...target,
      id: `dev-copy-${Date.now()}`,
      name: `${target.name.replace(/(\.[^.]*)?$/, '')}_copy${target.name.includes('.') ? target.name.slice(target.name.lastIndexOf('.')) : ''}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      metadata: target.metadata ? { ...target.metadata } : undefined,
      reference_images: target.reference_images
        ? [...target.reference_images]
        : [],
    };
    devAssets = [copied, ...devAssets];
    return copied;
  }
  return post<AssetDetail>(`/api/dam/assets/${assetId}/copy`);
}

export async function deleteAsset(assetId: string): Promise<void> {
  if (USE_DEV_DUMMY) {
    devAssets = devAssets.filter((asset) => asset.id !== assetId);
    return;
  }
  await del<void>(`/api/dam/assets/${assetId}`);
}

export function downloadAssetUrl(assetId: string): string {
  return `/api/dam/assets/${assetId}/download`;
}

export async function downloadAsset(assetId: string): Promise<Blob> {
  if (USE_DEV_DUMMY) {
    const file = devAssets.find((asset) => asset.id === assetId);
    const fileName = file?.name || 'asset';
    return new Blob([`Dummy DAM asset download: ${fileName}`], {
      type: 'text/plain',
    });
  }
  return download(downloadAssetUrl(assetId));
}

export async function uploadAsset(
  file: File,
  name: string,
  metadata?: Record<string, unknown>,
  folderId?: string,
): Promise<AssetDetail> {
  if (USE_DEV_DUMMY) {
    const now = new Date().toISOString();
    const next: DevAsset = {
      id: `dev-upload-${Date.now()}`,
      name,
      file_type: file.type.includes('image')
        ? 'image'
        : file.type.includes('video')
          ? 'video'
          : file.type.includes('pdf')
            ? 'pdf'
            : file.name.toLowerCase().endsWith('.zip')
              ? 'zip'
              : 'other',
      file_url: URL.createObjectURL(file),
      file_size: String(file.size),
      uploaded_by: 'Dev User',
      metadata: metadata || {},
      reference_images: [],
      created_at: now,
      updated_at: now,
      folder_id: folderId,
    };
    devAssets = [next, ...devAssets];
    return next;
  }

  const formData = new FormData();
  formData.append('file', file);

  const query = new URLSearchParams({ name });
  if (metadata) {
    query.set('metadata', JSON.stringify(metadata));
  }
  if (folderId) {
    query.set('folder_id', folderId);
  }

  return upload<AssetDetail>(`/api/dam/assets?${query.toString()}`, formData);
}

export async function updateAssetMetadata(
  assetId: string,
  metadata: Record<string, unknown>,
): Promise<AssetDetail> {
  if (USE_DEV_DUMMY) {
    const target = devAssets.find((asset) => asset.id === assetId);
    if (!target) throw new Error('Asset not found');
    target.metadata = {
      ...(target.metadata || {}),
      ...metadata,
    };
    target.updated_at = new Date().toISOString();
    return target;
  }
  return patch<AssetDetail>(`/api/dam/assets/${assetId}/metadata`, {
    metadata,
  });
}

export async function listUploaders(): Promise<UploaderInfo[]> {
  if (USE_DEV_DUMMY) {
    const map = new Map<string, UploaderInfo>();
    devAssets.forEach((asset) => {
      if (!map.has(asset.uploaded_by)) {
        const local = asset.uploaded_by.toLowerCase().replace(/\s+/g, '.');
        map.set(asset.uploaded_by, {
          id: `uploader-${local}`,
          name: asset.uploaded_by,
          email: `${local}@example.com`,
        });
      }
    });
    return [...map.values()];
  }
  return get<UploaderInfo[]>('/api/dam/assets/uploaders');
}

export async function listAssetPermissions(
  assetId: string,
): Promise<AssetPermission[]> {
  if (USE_DEV_DUMMY) {
    return (
      devPermissionsByAsset[assetId] || [
        {
          id: 'perm-owner',
          name: 'Admin',
          email: 'admin@itcen.com',
          access_level: 'owner',
        },
      ]
    );
  }
  return get<AssetPermission[]>(`/api/dam/assets/${assetId}/permissions`);
}

export async function saveAssetPermissions(
  assetId: string,
  permissions: AssetPermission[],
): Promise<AssetPermission[]> {
  if (USE_DEV_DUMMY) {
    devPermissionsByAsset[assetId] = permissions;
    return permissions;
  }
  return post<AssetPermission[]>(`/api/dam/assets/${assetId}/permissions`, {
    permissions,
  });
}

export async function listWorkspaceTasks(): Promise<WorkspaceTask[]> {
  if (USE_DEV_DUMMY) {
    return devTasks;
  }
  return get<WorkspaceTask[]>('/api/dam/workspace/tasks');
}

export async function updateWorkspaceTask(
  taskId: string,
  payload: Partial<WorkspaceTask>,
): Promise<WorkspaceTask> {
  if (USE_DEV_DUMMY) {
    const target = devTasks.find((task) => task.id === taskId);
    if (!target) throw new Error('Task not found');
    Object.assign(target, payload);
    return target;
  }
  return patch<WorkspaceTask>(`/api/dam/workspace/tasks/${taskId}`, payload);
}

export async function listCollections(): Promise<CollectionItem[]> {
  if (USE_DEV_DUMMY) {
    return devCollections;
  }
  return get<CollectionItem[]>('/api/dam/collections');
}

export async function createCollectionShareLink(
  collectionId: string,
): Promise<{ url: string }> {
  if (USE_DEV_DUMMY) {
    const collection = devCollections.find((item) => item.id === collectionId);
    if (!collection) throw new Error('Collection not found');
    const token =
      collection.share_token || `share-${collectionId}-${Date.now()}`;
    collection.share_token = token;
    return { url: `${window.location.origin}/dam/share/${token}` };
  }
  return post<{ url: string }>(`/api/dam/collections/${collectionId}/share`);
}

export async function addAssetToCollection(
  collectionId: string,
  assetId: string,
): Promise<CollectionItem> {
  if (USE_DEV_DUMMY) {
    const collection = devCollections.find((item) => item.id === collectionId);
    if (!collection) throw new Error('Collection not found');
    if (!collection.asset_ids.includes(assetId)) {
      collection.asset_ids.push(assetId);
    }
    return collection;
  }
  return post<CollectionItem>(`/api/dam/collections/${collectionId}/assets`, {
    asset_id: assetId,
  });
}

export async function removeAssetFromCollection(
  collectionId: string,
  assetId: string,
): Promise<CollectionItem> {
  if (USE_DEV_DUMMY) {
    const collection = devCollections.find((item) => item.id === collectionId);
    if (!collection) throw new Error('Collection not found');
    collection.asset_ids = collection.asset_ids.filter((id) => id !== assetId);
    return collection;
  }
  return del<CollectionItem>(
    `/api/dam/collections/${collectionId}/assets/${assetId}`,
  );
}
