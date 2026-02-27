import type React from "react";
import { useEffect, useState } from "react";
import { DAMSidebar } from "../components/dam/DAMSidebar";
import { DAMFilters, type FilterState } from "../components/dam/DAMFilters";
import { FileDetailModal } from "../components/dam/FileDetailModal";
import { NewFileModal } from "../components/dam/NewFileModal";
import { DAMContextMenu, type ContextMenuState } from "../components/dam/DAMContextMenu";
import { MOCK_FILES, type DAMFile } from "../components/dam/DAMData";
import { DAMGridView } from "../components/dam/DAMGridView";
import { DAMListView } from "../components/dam/DAMListView";
import { RenameModal } from "../components/dam/RenameModal";
import { GridViewIcon, ListViewIcon, SearchIcon } from "../components/dam/DAMViewIcons";
import {
  copyAsset,
  deleteAsset,
  downloadAsset,
  downloadAssetUrl,
  getAssetDetail,
  getFolderTree,
  listAssets,
  renameAsset,
  uploadAsset,
  type FolderNode,
} from "../services/dam";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const toFileType = (fileType: string): DAMFile["type"] => {
  if (fileType === "image") return "image";
  if (fileType === "video") return "video";
  if (fileType === "pdf") return "pdf";
  if (fileType === "zip") return "zip";
  return "other";
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

const toLocalTime = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const resolveUrl = (url?: string | null) => {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
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

/* ─── 메인 DAM 페이지 ─────────────────────────────────────── */
export const DAMPage: React.FC = () => {
  const [files, setFiles] = useState<DAMFile[]>(MOCK_FILES);
  const [folders, setFolders] = useState<FolderNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activePath, setActivePath] = useState<string>("DAM");
  const [searchText, setSearchText] = useState("");
  const [showNewModal, setShowNewModal] = useState(false);
  const [detailFile, setDetailFile] = useState<DAMFile | null>(null);
  const [renamingFile, setRenamingFile] = useState<DAMFile | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false, x: 0, y: 0, fileId: null,
  });
  const [filters, setFilters] = useState<FilterState>({
    fileType: null, person: null, dateFrom: null, dateTo: null,
  });

  useEffect(() => {
    getFolderTree()
      .then((data) => {
        setFolders(data);
      })
      .catch(() => {
        // keep fallback
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    const folderId = buildFolderMap(folders).has(activePath) ? activePath : undefined;
    listAssets({
      keyword: searchText || undefined,
      file_type: filters.fileType || undefined,
      user_name: filters.person || undefined,
      date_from: filters.dateFrom || undefined,
      date_to: filters.dateTo || undefined,
      folder_id: folderId,
    })
      .then((response) => {
        const items = response.items.map((asset) => ({
          id: asset.id,
          type: toFileType(asset.file_type),
          name: asset.name,
          person: asset.uploaded_by,
          size: formatBytes(asset.file_size),
          modifiedAt: toLocalTime(asset.updated_at),
          thumbnail: resolveUrl(asset.thumbnail_url || undefined),
          url: resolveUrl(asset.thumbnail_url || undefined),
          folder: folderId,
        }));
        setFiles(items.length > 0 ? items : []);
      })
      .catch(() => {
        // fallback to mock data on failure
      })
      .finally(() => {
        setLoading(false);
      });
  }, [activePath, searchText, filters.fileType, filters.person, filters.dateFrom, filters.dateTo, folders]);

  const handleContextMenu = (e: React.MouseEvent, fileId: string) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, fileId });
  };

  const handleDotsClick = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, fileId });
  };

  const handleDownload = async (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    if (!file) return;
    try {
      const blob = await downloadAsset(fileId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      const src = resolveUrl(downloadAssetUrl(fileId)) || file.thumbnail || file.url;
      if (src) {
        const a = document.createElement("a");
        a.href = src;
        a.download = file.name;
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }
  };

  const handleRename = (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    if (file) setRenamingFile(file);
  };

  const handleRenameConfirm = async (newName: string) => {
    if (!renamingFile) return;
    try {
      await renameAsset(renamingFile.id, newName);
      setFiles((prev) => prev.map((f) => f.id === renamingFile.id ? { ...f, name: newName } : f));
      if (detailFile?.id === renamingFile.id) {
        setDetailFile((prev) => prev ? { ...prev, name: newName } : null);
      }
    } catch {
      // ignore and keep UI state
    } finally {
      setRenamingFile(null);
    }
  };

  const handleContextAction = async (action: string, fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    if (!file) return;

    if (action === "detail") {
      try {
        const detail = await getAssetDetail(fileId);
        setDetailFile({
          id: detail.id,
          type: toFileType(detail.file_type),
          name: detail.name,
          person: detail.uploaded_by,
          size: formatBytes(detail.file_size),
          modifiedAt: toLocalTime(detail.updated_at),
          thumbnail: resolveUrl(detail.file_url),
          url: resolveUrl(detail.file_url),
          metadata: detail.metadata ? (detail.metadata as Record<string, string>) : undefined,
        });
      } catch {
        setDetailFile(file);
      }
    } else if (action === "download") {
      handleDownload(fileId);
    } else if (action === "rename") {
      setRenamingFile(file);
    } else if (action === "copy") {
      try {
        const copied = await copyAsset(fileId);
        const mapped: DAMFile = {
          id: copied.id,
          type: toFileType(copied.file_type),
          name: copied.name,
          person: copied.uploaded_by,
          size: formatBytes(copied.file_size),
          modifiedAt: toLocalTime(copied.updated_at),
          thumbnail: resolveUrl(copied.file_url),
          url: resolveUrl(copied.file_url),
        };
        setFiles((prev) => {
          const idx = prev.findIndex((f) => f.id === fileId);
          const next = [...prev];
          next.splice(idx + 1, 0, mapped);
          return next;
        });
      } catch {
        // ignore
      }
    } else if (action === "delete") {
      if (window.confirm(`"${file.name}"을 삭제하시겠습니까?`)) {
        try {
          await deleteAsset(fileId);
          setFiles((prev) => prev.filter((f) => f.id !== fileId));
          if (detailFile?.id === fileId) setDetailFile(null);
        } catch {
          // ignore
        }
      }
    }
  };

  const handleSaveNewFile = async (metadata: Record<string, string>, uploadedFile: File | null) => {
    if (!uploadedFile) return;
    const folderId = buildFolderMap(folders).has(activePath) ? activePath : undefined;
    const assetName = uploadedFile.name;
    try {
      const asset = await uploadAsset(uploadedFile, assetName, metadata, folderId);
      const mapped: DAMFile = {
        id: asset.id,
        type: toFileType(asset.file_type),
        name: asset.name,
        person: asset.uploaded_by,
        size: formatBytes(asset.file_size),
        modifiedAt: toLocalTime(asset.updated_at),
        thumbnail: resolveUrl(asset.file_url),
        url: resolveUrl(asset.file_url),
      };
      setFiles((prev) => [mapped, ...prev]);
    } catch {
      // ignore
    }
  };

  // 필터 적용
  const filteredFiles = files.filter((file) => {
    if (activePath !== "DAM" && activePath !== "최근" && activePath !== "공유") {
      if (file.folder !== activePath) return false;
    }
    if (searchText && !file.name.toLowerCase().includes(searchText.toLowerCase())) return false;
    if (filters.fileType && file.type !== filters.fileType) return false;
    if (filters.person && file.person !== filters.person) return false;
    return true;
  });

  // 브레드크럼
  const folderMap = buildFolderMap(folders);
  const breadcrumbs = activePath === "DAM" ? ["DAM"] : ["DAM", folderMap.get(activePath) || activePath];

  return (
    <div className="h-full flex overflow-hidden bg-white">
      {/* 사이드바 */}
      <DAMSidebar activePath={activePath} onNavigate={setActivePath} folders={folders} />

      {/* 메인 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 상단 헤더 */}
        <div className="flex items-center gap-[16px] px-[24px] py-[16px] border-b border-[#E2E8F0]">
          {/* 브레드크럼 */}
          <div className="flex items-center gap-[8px] text-[16px] font-semibold text-[#0F172B] shrink-0">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb} className="flex items-center gap-[8px]">
                {i > 0 && <span className="text-[#94A3B8] font-normal">&gt;</span>}
                <span className={i < breadcrumbs.length - 1 ? "text-[#475569] font-normal text-[14px]" : ""}>
                  {crumb}
                </span>
              </span>
            ))}
          </div>

          {/* 검색 */}
          <div className="flex-1 flex items-center gap-[8px] bg-[#F1F5F9] rounded-[8px] px-[12px] py-[8px]">
            <SearchIcon />
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search assets"
              className="flex-1 bg-transparent text-[14px] text-[#0F172B] placeholder:text-[#94A3B8] outline-none"
            />
          </div>

          {/* 뷰 토글 */}
          <div className="flex items-center gap-[4px]">
            <button
              onClick={() => setViewMode("grid")}
              className={`w-[32px] h-[32px] flex items-center justify-center rounded-[6px] ${
                viewMode === "grid" ? "bg-[#EFF6FF]" : "hover:bg-[#F1F5F9]"
              }`}
            >
              <GridViewIcon active={viewMode === "grid"} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`w-[32px] h-[32px] flex items-center justify-center rounded-[6px] ${
                viewMode === "list" ? "bg-[#EFF6FF]" : "hover:bg-[#F1F5F9]"
              }`}
            >
              <ListViewIcon active={viewMode === "list"} />
            </button>
          </div>

          {/* 새로 만들기 */}
          <button
            onClick={() => setShowNewModal(true)}
            className="bg-[#155DFC] text-white px-[16px] py-[8px] rounded-[8px] text-[14px] font-medium whitespace-nowrap"
          >
            새로 만들기
          </button>
        </div>

        {/* 필터 */}
        <div className="px-[24px] py-[12px] border-b border-[#E2E8F0]">
          <DAMFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* 파일 목록 */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full text-[14px] text-[#94A3B8]">
              에셋 불러오는 중...
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="flex items-center justify-center h-full text-[14px] text-[#94A3B8]">
              표시할 파일이 없습니다.
            </div>
          ) : viewMode === "grid" ? (
            <DAMGridView
              files={filteredFiles}
              onContextMenu={handleContextMenu}
              onDotsClick={handleDotsClick}
            />
          ) : (
            <DAMListView
              files={filteredFiles}
              onContextMenu={handleContextMenu}
              onDotsClick={handleDotsClick}
              onDownload={handleDownload}
              onRename={handleRename}
            />
          )}
        </div>
      </div>

      {/* 컨텍스트 메뉴 */}
      <DAMContextMenu
        menu={contextMenu}
        onClose={() => setContextMenu((prev) => ({ ...prev, visible: false }))}
        onAction={handleContextAction}
      />

      {/* 이름 변경 모달 */}
      {renamingFile && (
        <RenameModal
          defaultValue={renamingFile.name}
          onConfirm={handleRenameConfirm}
          onCancel={() => setRenamingFile(null)}
        />
      )}

      {/* 새로 만들기 모달 */}
      {showNewModal && (
        <NewFileModal
          onClose={() => setShowNewModal(false)}
          onSave={handleSaveNewFile}
        />
      )}

      {/* 파일 상세 모달 */}
      {detailFile && (
        <FileDetailModal
          file={detailFile}
          onClose={() => setDetailFile(null)}
        />
      )}
    </div>
  );
};
