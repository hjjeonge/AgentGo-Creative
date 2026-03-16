import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { DAMSidebar } from '@/features/dam/components/DAMSidebar';
import {
  DAMFilters,
  type FilterState,
} from '@/features/dam/components/DAMFilters';
import { DAMAdvancedFilters } from '@/features/dam/components/DAMAdvancedFilters';
import { DAMWorkspaceView } from '@/features/dam/components/DAMWorkspaceView';
import { DAMCollectionsView } from '@/features/dam/components/DAMCollectionsView';
import { DAMCreativePanel } from '@/features/dam/components/DAMCreativePanel';
import { FileDetailModal } from '@/features/dam/components/FileDetailModal';
import { NewFileModal } from '@/features/dam/components/NewFileModal';
import { PermissionModal } from '@/features/dam/components/PermissionModal';
import {
  DAMContextMenu,
  type ContextMenuState,
} from '@/features/dam/components/DAMContextMenu';
import { type DAMFile, type DAMTask } from '@/features/dam/components/DAMData';
import { DAMGridView } from '@/features/dam/components/DAMGridView';
import { DAMListView } from '@/features/dam/components/DAMListView';
import { RenameModal } from '@/features/dam/components/RenameModal';
import {
  GridViewIcon,
  ListViewIcon,
  SearchIcon,
} from '@/features/dam/components/DAMViewIcons';
import {
  copyAsset,
  createCollectionShareLink,
  deleteAsset,
  downloadAsset,
  downloadAssetUrl,
  getAssetDetail,
  getFolderTree,
  listAssets,
  listCollections,
  listWorkspaceTasks,
  renameAsset,
  updateWorkspaceTask,
  uploadAsset,
  type CollectionItem,
  type FolderNode,
} from '@/features/dam/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const toFileType = (fileType: string): DAMFile['type'] => {
  if (fileType === 'image') return 'image';
  if (fileType === 'video') return 'video';
  if (fileType === 'pdf') return 'pdf';
  if (fileType === 'zip') return 'zip';
  return 'other';
};

const formatBytes = (value: string) => {
  const bytes = Number.parseInt(value, 10);
  if (!Number.isFinite(bytes)) return value;
  if (bytes < 1024) return `${bytes}B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)}KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)}MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(1)}GB`;
};

const toLocalTime = (iso: string | Date): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return typeof iso === 'string' ? iso : iso.toISOString();
  }
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

const resolveUrl = (url?: string | null) => {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}${url}`;
};

const buildFolderMap = (nodes: FolderNode[]): Map<string, string> => {
  const map = new Map<string, string>();
  const walk = (list: FolderNode[]) => {
    list.forEach((node) => {
      map.set(node.id, node.name);
      if (node.children?.length) walk(node.children);
    });
  };
  walk(nodes);
  return map;
};

const normalizeStatus = (value: unknown): DAMFile['status'] => {
  if (value === 'approved') return 'approved';
  if (value === 'rejected') return 'rejected';
  if (value === 'pending') return 'pending';
  return 'none';
};

const toStringValue = (value: unknown): string | undefined => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return undefined;
};

const toStringRecord = (
  metadata: Record<string, unknown> | null | undefined,
): Record<string, string> => {
  if (!metadata) return {};
  return Object.entries(metadata).reduce<Record<string, string>>(
    (acc, [key, value]) => {
      const next = toStringValue(value);
      if (next !== undefined) acc[key] = next;
      return acc;
    },
    {},
  );
};

const getMetadataValue = (
  metadata: Record<string, unknown> | null | undefined,
  keys: string[],
): string | undefined => {
  if (!metadata) return undefined;
  for (const key of keys) {
    const value = toStringValue(metadata[key]);
    if (value !== undefined) return value;
  }
  return undefined;
};

const parseAiTags = (
  metadata: Record<string, unknown> | null | undefined,
): DAMFile['aiTags'] => {
  const raw = metadata?.ai_tags;
  if (!Array.isArray(raw)) return undefined;
  return raw
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const row = item as Record<string, unknown>;
      return {
        category: toStringValue(row.category) || '-',
        value: toStringValue(row.value) || '-',
        reason: toStringValue(row.reason) || '-',
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
};

const parseWorkfront = (
  metadata: Record<string, unknown> | null | undefined,
): DAMFile['workfront'] => {
  if (!metadata) return undefined;
  const projectName = getMetadataValue(metadata, [
    'workfront_project_name',
    'wf_project_name',
  ]);
  const projectId = getMetadataValue(metadata, [
    'workfront_project_id',
    'wf_project_id',
  ]);
  const documentId = getMetadataValue(metadata, [
    'workfront_document_id',
    'wf_document_id',
  ]);
  const taskName = getMetadataValue(metadata, [
    'workfront_task_name',
    'wf_task_name',
  ]);
  const taskDescription = getMetadataValue(metadata, [
    'workfront_task_description',
    'wf_task_description',
  ]);
  if (
    !projectName &&
    !projectId &&
    !documentId &&
    !taskName &&
    !taskDescription
  )
    return undefined;
  return {
    projectName: projectName || '-',
    projectId: projectId || '-',
    documentId: documentId || '-',
    taskName: taskName || '-',
    taskDescription: taskDescription || '-',
  };
};

const toFileFromDetail = (
  detail: Awaited<ReturnType<typeof getAssetDetail>>,
): DAMFile => {
  const metadata = detail.metadata || undefined;
  return {
    id: detail.id,
    type: toFileType(detail.file_type),
    name: detail.name,
    person: detail.uploaded_by,
    size: formatBytes(detail.file_size),
    createdAt: toLocalTime(detail.created_at),
    modifiedAt: toLocalTime(detail.updated_at),
    thumbnail: resolveUrl(detail.file_url),
    url: resolveUrl(detail.file_url),
    metadata: toStringRecord(metadata),
    status: normalizeStatus(metadata?.status),
    title: getMetadataValue(metadata, ['title', 'name']),
    description: getMetadataValue(metadata, ['description']),
    author: getMetadataValue(metadata, ['author', 'creator']),
    resolution: getMetadataValue(metadata, ['resolution']),
    make: getMetadataValue(metadata, ['make', 'camera_make']),
    model: getMetadataValue(metadata, ['model', 'camera_model']),
    lens: getMetadataValue(metadata, ['lens']),
    expirationDate: getMetadataValue(metadata, [
      'expiration_date',
      'expirationDate',
    ]),
    gps: {
      lat: getMetadataValue(metadata, ['gps_lat', 'latitude']) || '-',
      lng: getMetadataValue(metadata, ['gps_lng', 'longitude']) || '-',
      alt: getMetadataValue(metadata, ['gps_alt', 'altitude']) || '-',
    },
    aiTags: parseAiTags(metadata),
    aiSummary: getMetadataValue(metadata, ['ai_summary', 'aiSummary']),
    workfront: parseWorkfront(metadata),
    referenceImages: detail.reference_images?.filter(
      (image): image is string => typeof image === 'string',
    ),
  };
};

const getFileExtension = (name: string): string => {
  const parts = name.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : '';
};

const MOCK_COLLECTION_NAMES = [
  'Summer Campaign',
  'Ski Season 2026',
  'Modern Interior',
];

export const DAMPage: React.FC = () => {
  const [files, setFiles] = useState<DAMFile[]>([]);
  const [tasks, setTasks] = useState<DAMTask[]>([]);
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [collectionShareUrl, setCollectionShareUrl] = useState<string | null>(
    null,
  );
  const [folders, setFolders] = useState<FolderNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activePath, setActivePath] = useState<string>('DAM');
  const [searchText, setSearchText] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [detailFile, setDetailFile] = useState<DAMFile | null>(null);
  const [renamingFile, setRenamingFile] = useState<DAMFile | null>(null);
  const [permissionFile, setPermissionFile] = useState<DAMFile | null>(null);
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(true);
  const [isCreativePanelOpen, setIsCreativePanelOpen] = useState(true);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    fileId: null,
  });
  const [filters, setFilters] = useState<FilterState>({
    fileType: null,
    person: null,
    dateFrom: null,
    dateTo: null,
    status: null,
    mimeTypes: [],
  });

  const isWorkspaceView = activePath === 'My Workspace';
  const isCollectionView = activePath.startsWith('coll:');
  const activeCollectionId = isCollectionView
    ? activePath.replace('coll:', '')
    : '';
  const activeCollection = useMemo(
    () => collections.find((item) => item.id === activeCollectionId),
    [collections, activeCollectionId],
  );

  useEffect(() => {
    getFolderTree()
      .then(setFolders)
      .catch(() => setFolders([]));
    listWorkspaceTasks()
      .then((rows) => {
        setTasks(
          rows.map((task) => ({
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            creator: task.creator,
            createdAt: task.created_at,
            dueDate: task.due_date,
          })),
        );
      })
      .catch(() => setTasks([]));
    listCollections()
      .then(setCollections)
      .catch(() => {
        setCollections(
          MOCK_COLLECTION_NAMES.map((name, index) => ({
            id: `fallback-${index}`,
            name,
            asset_ids: [],
          })),
        );
      });
  }, []);

  useEffect(() => {
    if (isWorkspaceView) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const folderMap = buildFolderMap(folders);
    const specialPaths = ['DAM', '최근', '공유'];
    const projectCategories = [
      'SNS/마케팅 광고소재',
      '상세페이지/카탈로그 생성',
      '스튜디오 촬영 이미지 생성',
      '다국어 변환 이미지 생성',
      '인포그래픽 이미지 생성',
      '삽화 이미지 생성',
      '일러스트 이미지 완성',
    ];
    const isSpecial =
      specialPaths.includes(activePath) ||
      projectCategories.includes(activePath) ||
      activePath.startsWith('coll:');
    const folderId =
      !isSpecial && folderMap.has(activePath) ? activePath : undefined;

    listAssets({
      keyword: searchText || undefined,
      file_type: filters.fileType || undefined,
      user_name: filters.person || undefined,
      date_from: filters.dateFrom || undefined,
      date_to: filters.dateTo || undefined,
      folder_id: folderId,
    })
      .then((response) => {
        setFiles(
          response.items.map((asset) => ({
            id: asset.id,
            type: toFileType(asset.file_type),
            name: asset.name,
            person: asset.uploaded_by,
            size: formatBytes(asset.file_size),
            modifiedAt: toLocalTime(asset.updated_at),
            thumbnail: resolveUrl(asset.thumbnail_url || undefined),
            url: resolveUrl(asset.thumbnail_url || undefined),
            folder: folderId,
            status: normalizeStatus(asset.metadata?.status),
          })),
        );
      })
      .catch(() => setFiles([]))
      .finally(() => setLoading(false));
  }, [activePath, searchText, filters, folders, isWorkspaceView]);

  const filteredFiles = files.filter((file) => {
    if (
      isCollectionView &&
      activeCollection &&
      activeCollection.asset_ids.length > 0 &&
      !activeCollection.asset_ids.includes(file.id)
    ) {
      return false;
    }
    if (filters.status && file.status !== filters.status) return false;
    if (
      filters.mimeTypes.length > 0 &&
      !filters.mimeTypes.includes(getFileExtension(file.name))
    )
      return false;
    return true;
  });

  const folderMap = buildFolderMap(folders);
  let breadcrumbs = ['DAM'];
  if (isWorkspaceView) breadcrumbs = ['DAM', 'My Workspace'];
  else if (isCollectionView)
    breadcrumbs = [
      'DAM',
      'Collections',
      activeCollection?.name || activeCollectionId,
    ];
  else if (activePath !== 'DAM')
    breadcrumbs = ['DAM', folderMap.get(activePath) || activePath];

  const handleContextMenu = (e: React.MouseEvent, fileId: string) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, fileId });
  };

  const handleDotsClick = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, fileId });
  };

  const handleDownload = async (fileId: string) => {
    const file = files.find((item) => item.id === fileId);
    if (!file) return;
    try {
      const blob = await downloadAsset(fileId);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = file.name;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    } catch {
      const src =
        resolveUrl(downloadAssetUrl(fileId)) || file.thumbnail || file.url;
      if (!src) return;
      const anchor = document.createElement('a');
      anchor.href = src;
      anchor.download = file.name;
      anchor.target = '_blank';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    }
  };

  const handleRenameConfirm = async (newName: string) => {
    if (!renamingFile) return;
    try {
      await renameAsset(renamingFile.id, newName);
      setFiles((prev) =>
        prev.map((file) =>
          file.id === renamingFile.id ? { ...file, name: newName } : file,
        ),
      );
      if (detailFile?.id === renamingFile.id) {
        setDetailFile((prev) => (prev ? { ...prev, name: newName } : null));
      }
    } finally {
      setRenamingFile(null);
    }
  };

  const handleContextAction = async (action: string, fileId: string) => {
    const file = files.find((item) => item.id === fileId);
    if (!file) return;
    if (action === 'detail') {
      try {
        const detail = await getAssetDetail(fileId);
        setDetailFile(toFileFromDetail(detail));
      } catch {
        setDetailFile(file);
      }
      return;
    }
    if (action === 'download') return handleDownload(fileId);
    if (action === 'rename') return setRenamingFile(file);
    if (action === 'permission') return setPermissionFile(file);
    if (action === 'copy') {
      try {
        const copied = await copyAsset(fileId);
        setFiles((prev) => [
          {
            id: copied.id,
            type: toFileType(copied.file_type),
            name: copied.name,
            person: copied.uploaded_by,
            size: formatBytes(copied.file_size),
            modifiedAt: toLocalTime(copied.updated_at),
            thumbnail: resolveUrl(copied.file_url),
            url: resolveUrl(copied.file_url),
            status: normalizeStatus(copied.metadata?.status),
          },
          ...prev,
        ]);
      } catch {
        // ignore
      }
      return;
    }
    if (
      action === 'delete' &&
      window.confirm(`"${file.name}"을 삭제하시겠습니까?`)
    ) {
      try {
        await deleteAsset(fileId);
        setFiles((prev) => prev.filter((item) => item.id !== fileId));
        if (detailFile?.id === fileId) setDetailFile(null);
      } catch {
        // ignore
      }
    }
  };

  const handleSaveNewFile = async (
    metadata: Record<string, string>,
    uploadedFile: File | null,
  ) => {
    if (!uploadedFile) return;
    const folderId = buildFolderMap(folders).has(activePath)
      ? activePath
      : undefined;
    const asset = await uploadAsset(
      uploadedFile,
      uploadedFile.name,
      metadata,
      folderId,
    );
    setFiles((prev) => [
      {
        id: asset.id,
        type: toFileType(asset.file_type),
        name: asset.name,
        person: asset.uploaded_by,
        size: formatBytes(asset.file_size),
        modifiedAt: toLocalTime(asset.updated_at),
        thumbnail: resolveUrl(asset.file_url),
        url: resolveUrl(asset.file_url),
        status: normalizeStatus(asset.metadata?.status),
      },
      ...prev,
    ]);
  };

  const handleWorkspaceTaskStatus = async (
    taskId: string,
    status: DAMTask['status'],
  ) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status } : task)),
    );
    try {
      await updateWorkspaceTask(taskId, { status });
    } catch {
      // keep optimistic update
    }
  };

  const handleGenerateCollectionLink = async () => {
    if (!activeCollection) return;
    try {
      const result = await createCollectionShareLink(activeCollection.id);
      setCollectionShareUrl(result.url);
    } catch {
      setCollectionShareUrl(null);
    }
  };

  return (
    <div className="h-full flex overflow-hidden bg-white">
      <DAMSidebar
        activePath={activePath}
        onNavigate={setActivePath}
        folders={folders}
        collections={collections}
      />

      {!isWorkspaceView && (
        <DAMAdvancedFilters
          filters={filters}
          onFiltersChange={setFilters}
          isOpen={isAdvancedFilterOpen}
          onToggle={() => setIsAdvancedFilterOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden border-l border-[#E2E8F0]">
        <div className="flex items-center gap-[16px] px-[24px] py-[16px] border-b border-[#E2E8F0] bg-white z-10">
          {!isAdvancedFilterOpen && !isWorkspaceView && (
            <button
              onClick={() => setIsAdvancedFilterOpen(true)}
              className="p-[8px] rounded-[6px] hover:bg-[#F1F5F9] transition-colors"
              title="필터 열기"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#475569"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
                <line x1="2" y1="14" x2="6" y2="14" />
                <line x1="10" y1="8" x2="14" y2="8" />
                <line x1="18" y1="16" x2="22" y2="16" />
              </svg>
            </button>
          )}

          <div className="flex-1 flex items-center gap-[8px] text-[16px] font-semibold text-[#0F172B] truncate">
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb} className="flex items-center gap-[8px]">
                {index > 0 && (
                  <span className="text-[#94A3B8] font-normal">&gt;</span>
                )}
                <span
                  className={
                    index < breadcrumbs.length - 1
                      ? 'text-[#475569] font-normal text-[14px]'
                      : ''
                  }
                >
                  {crumb}
                </span>
              </span>
            ))}
          </div>

          {!isWorkspaceView && (
            <div className="w-[300px] flex items-center gap-[8px] bg-[#F1F5F9] rounded-[8px] px-[12px] py-[8px]">
              <SearchIcon />
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search assets"
                className="flex-1 bg-transparent text-[14px] text-[#0F172B] placeholder:text-[#94A3B8] outline-none"
              />
            </div>
          )}

          {!isWorkspaceView && (
            <div className="flex items-center gap-[4px]">
              <button
                onClick={() => setViewMode('grid')}
                className={`w-[32px] h-[32px] flex items-center justify-center rounded-[6px] ${viewMode === 'grid' ? 'bg-[#EFF6FF]' : 'hover:bg-[#F1F5F9]'}`}
              >
                <GridViewIcon active={viewMode === 'grid'} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`w-[32px] h-[32px] flex items-center justify-center rounded-[6px] ${viewMode === 'list' ? 'bg-[#EFF6FF]' : 'hover:bg-[#F1F5F9]'}`}
              >
                <ListViewIcon active={viewMode === 'list'} />
              </button>
            </div>
          )}

          <button
            onClick={() => setShowNewModal(true)}
            className="bg-[#155DFC] text-white px-[16px] py-[8px] rounded-[8px] text-[14px] font-medium whitespace-nowrap active:scale-[0.98] transition-transform shadow-sm"
          >
            {isWorkspaceView ? '태스크 생성' : '새로 만들기'}
          </button>
        </div>

        {isWorkspaceView ? (
          <DAMWorkspaceView
            tasks={tasks}
            onTaskClick={(id) => console.log('Task Clicked:', id)}
            onTaskStatusChange={handleWorkspaceTaskStatus}
          />
        ) : (
          <>
            {isCollectionView && (
              <DAMCollectionsView
                collectionName={activeCollection?.name || activeCollectionId}
                files={filteredFiles}
                shareUrl={collectionShareUrl}
                onGenerateShareLink={handleGenerateCollectionLink}
              />
            )}
            <div className="px-[24px] py-[12px] border-b border-[#E2E8F0] bg-white">
              <DAMFilters filters={filters} onFiltersChange={setFilters} />
            </div>
            <div className="flex-1 overflow-y-auto bg-[#F8FAFC]/30">
              {loading ? (
                <div className="flex items-center justify-center h-full text-[14px] text-[#94A3B8]">
                  에셋 불러오는 중...
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="flex items-center justify-center h-full text-[14px] text-[#94A3B8]">
                  표시할 파일이 없습니다.
                </div>
              ) : viewMode === 'grid' ? (
                <DAMGridView
                  files={filteredFiles}
                  onContextMenu={handleContextMenu}
                  onDotsClick={handleDotsClick}
                  onDownload={handleDownload}
                  onDelete={(id) => handleContextAction('delete', id)}
                />
              ) : (
                <DAMListView
                  files={filteredFiles}
                  onContextMenu={handleContextMenu}
                  onDotsClick={handleDotsClick}
                  onDownload={handleDownload}
                  onRename={(id) =>
                    setRenamingFile(
                      files.find((file) => file.id === id) || null,
                    )
                  }
                />
              )}
            </div>
          </>
        )}
      </div>

      {!isWorkspaceView && (
        <DAMCreativePanel
          files={filteredFiles}
          isOpen={isCreativePanelOpen}
          onToggle={() => setIsCreativePanelOpen((prev) => !prev)}
        />
      )}

      <DAMContextMenu
        menu={contextMenu}
        onClose={() => setContextMenu((prev) => ({ ...prev, visible: false }))}
        onAction={handleContextAction}
      />

      {renamingFile && (
        <RenameModal
          defaultValue={renamingFile.name}
          onConfirm={handleRenameConfirm}
          onCancel={() => setRenamingFile(null)}
        />
      )}
      {showNewModal && (
        <NewFileModal
          onClose={() => setShowNewModal(false)}
          onSave={handleSaveNewFile}
        />
      )}
      {detailFile && (
        <FileDetailModal
          file={detailFile}
          onClose={() => setDetailFile(null)}
          onOpenPermissions={(file) => setPermissionFile(file)}
        />
      )}
      {permissionFile && (
        <PermissionModal
          file={permissionFile}
          onClose={() => setPermissionFile(null)}
        />
      )}
    </div>
  );
};
