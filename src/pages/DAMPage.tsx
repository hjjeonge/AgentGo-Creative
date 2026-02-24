import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import DotsIcon from "../assets/dots.svg";
import { DAMSidebar } from "../components/dam/DAMSidebar";
import { DAMFilters, type FilterState } from "../components/dam/DAMFilters";
import { FileDetailModal } from "../components/dam/FileDetailModal";
import { NewFileModal } from "../components/dam/NewFileModal";
import { DAMContextMenu, type ContextMenuState } from "../components/dam/DAMContextMenu";
import { FileIcon } from "../components/dam/DAMFileIcons";
import { MOCK_FILES, type DAMFile } from "../components/dam/DAMData";
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

/* ─── 아이콘 ─────────────────────────────────────────────── */
const GridViewIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="1" y="1" width="6" height="6" rx="1" stroke={active ? "#155DFC" : "#64748B"} strokeWidth="1.5" />
    <rect x="11" y="1" width="6" height="6" rx="1" stroke={active ? "#155DFC" : "#64748B"} strokeWidth="1.5" />
    <rect x="1" y="11" width="6" height="6" rx="1" stroke={active ? "#155DFC" : "#64748B"} strokeWidth="1.5" />
    <rect x="11" y="11" width="6" height="6" rx="1" stroke={active ? "#155DFC" : "#64748B"} strokeWidth="1.5" />
  </svg>
);

const ListViewIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <line x1="1" y1="4" x2="17" y2="4" stroke={active ? "#155DFC" : "#64748B"} strokeWidth="1.5" strokeLinecap="round" />
    <line x1="1" y1="9" x2="17" y2="9" stroke={active ? "#155DFC" : "#64748B"} strokeWidth="1.5" strokeLinecap="round" />
    <line x1="1" y1="14" x2="17" y2="14" stroke={active ? "#155DFC" : "#64748B"} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

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

const SearchIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="7" cy="7" r="5" stroke="#94A3B8" strokeWidth="1.5" />
    <path d="M11 11L14 14" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/* ─── 그리드 뷰 ──────────────────────────────────────────── */
interface GridProps {
  files: DAMFile[];
  onContextMenu: (e: React.MouseEvent, fileId: string) => void;
  onDotsClick: (e: React.MouseEvent, fileId: string) => void;
}

const DAMGridView: React.FC<GridProps> = ({ files, onContextMenu, onDotsClick }: GridProps) => (
  <div className="grid grid-cols-5 gap-[20px] p-[20px]">
    {files.map((file) => (
      <div
        key={file.id}
        onContextMenu={(e) => onContextMenu(e, file.id)}
        className="group relative bg-white border border-[#E2E8F0] rounded-[10px] overflow-hidden cursor-pointer hover:shadow-md"
      >
        {/* 3-dot 메뉴 */}
        <button
          onClick={(e) => onDotsClick(e, file.id)}
          className="absolute top-[8px] right-[8px] z-[10] opacity-0 group-hover:opacity-100 w-[24px] h-[24px] flex items-center justify-center rounded-[4px] hover:bg-[#F1F5F9]"
        >
          <img src={DotsIcon} className="w-[14px] h-[14px]" />
        </button>

        {/* 썸네일 */}
        <div className="h-[160px] flex items-center justify-center bg-[#F8FAFC]">
          {file.thumbnail ? (
            <img src={file.thumbnail} alt={file.name} className="w-full h-full object-cover" />
          ) : (
            <FileIcon type={file.type} size={56} />
          )}
        </div>

        {/* 파일명 */}
        <div className="px-[10px] py-[8px]">
          <p className="text-[12px] text-[#0F172B] font-medium truncate">{file.name}</p>
        </div>
      </div>
    ))}
  </div>
);

/* ─── 리스트 뷰 ──────────────────────────────────────────── */
interface ListProps {
  files: DAMFile[];
  onContextMenu: (e: React.MouseEvent, fileId: string) => void;
  onDotsClick: (e: React.MouseEvent, fileId: string) => void;
  onDownload: (fileId: string) => void;
  onRename: (fileId: string) => void;
}

const DownloadIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 2V11M8 11L5 8M8 11L11 8" stroke="#475569" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 13H14" stroke="#475569" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const RenameIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M11 2L14 5L5 14H2V11L11 2Z" stroke="#475569" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

const DAMListView: React.FC<ListProps> = ({ files, onContextMenu, onDotsClick, onDownload, onRename }: ListProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="px-[20px]">
      {/* 헤더 */}
      <div className="grid grid-cols-[40px_1fr_180px_100px_200px_64px] gap-[8px] px-[8px] py-[10px] border-b border-[#E2E8F0] text-[12px] text-[#94A3B8] font-medium">
        <span>종류</span>
        <span>이름</span>
        <span>사람</span>
        <span>크기</span>
        <span>수정한 날짜</span>
        <span />
      </div>

      {/* 행 */}
      {files.map((file) => (
        <div
          key={file.id}
          onContextMenu={(e) => onContextMenu(e, file.id)}
          onMouseEnter={() => setHoveredId(file.id)}
          onMouseLeave={() => setHoveredId(null)}
          className={`group grid grid-cols-[40px_1fr_180px_100px_200px_64px] gap-[8px] px-[8px] py-[12px] border-b border-[#F1F5F9] items-center cursor-pointer ${
            hoveredId === file.id ? "bg-[#F8FAFC]" : ""
          }`}
        >
          <div className="flex items-center justify-center">
            <FileIcon type={file.type} size={18} />
          </div>
          <span className="text-[13px] text-[#0F172B] truncate">{file.name}</span>
          <span className="text-[13px] text-[#475569] truncate">{file.person}</span>
          <span className="text-[13px] text-[#475569]">{file.size}</span>
          <span className="text-[13px] text-[#475569]">{file.modifiedAt}</span>
          <div className="flex items-center gap-[4px] justify-end">
            {hoveredId === file.id ? (
              <>
                <div className="relative group/dl">
                  <button
                    onClick={() => onDownload(file.id)}
                    className="w-[24px] h-[24px] flex items-center justify-center rounded-[4px] hover:bg-[#E2E8F0]"
                  >
                    <DownloadIcon />
                  </button>
                  <span className="absolute bottom-[calc(100%+4px)] right-0 bg-[#0F172B] text-white text-[11px] px-[6px] py-[3px] rounded-[4px] whitespace-nowrap opacity-0 group-hover/dl:opacity-100 pointer-events-none">
                    다운로드
                  </span>
                </div>
                <div className="relative group/rn">
                  <button
                    onClick={() => onRename(file.id)}
                    className="w-[24px] h-[24px] flex items-center justify-center rounded-[4px] hover:bg-[#E2E8F0]"
                  >
                    <RenameIcon />
                  </button>
                  <span className="absolute bottom-[calc(100%+4px)] right-0 bg-[#0F172B] text-white text-[11px] px-[6px] py-[3px] rounded-[4px] whitespace-nowrap opacity-0 group-hover/rn:opacity-100 pointer-events-none">
                    이름수정
                  </span>
                </div>
              </>
            ) : (
              <button
                onClick={(e) => onDotsClick(e, file.id)}
                className="w-[24px] h-[24px] flex items-center justify-center rounded-[4px] opacity-0 group-hover:opacity-100 hover:bg-[#E2E8F0]"
              >
                <img src={DotsIcon} className="w-[14px] h-[14px]" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

/* ─── 이름 변경 모달 ──────────────────────────────────────── */
const RenameModal: React.FC<{
  defaultValue: string;
  onConfirm: (name: string) => void;
  onCancel: () => void;
}> = ({ defaultValue, onConfirm, onCancel }) => {
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-[12px] shadow-xl p-[24px] w-[400px] flex flex-col gap-[16px]">
        <p className="text-[15px] font-semibold text-[#0F172B]">이름 변경</p>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && value.trim()) onConfirm(value.trim()); }}
          autoFocus
          className="border border-[#CBD5E1] rounded-[8px] px-[12px] py-[8px] text-[14px] text-[#0F172B] outline-none focus:border-[#155DFC]"
        />
        <div className="flex justify-end gap-[8px]">
          <button
            onClick={onCancel}
            className="px-[16px] py-[8px] border border-[#CBD5E1] text-[#475569] rounded-[8px] text-[13px]"
          >
            취소
          </button>
          <button
            onClick={() => { if (value.trim()) onConfirm(value.trim()); }}
            className="px-[16px] py-[8px] bg-[#155DFC] text-white rounded-[8px] text-[13px] font-medium"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
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

  const folderMap = useMemo(() => {
    const map = new Map<string, string>();
    const walk = (nodes: FolderNode[]) => {
      nodes.forEach((node) => {
        map.set(node.id, node.name);
        if (node.children && node.children.length > 0) walk(node.children);
      });
    };
    walk(folders);
    return map;
  }, [folders]);


  useEffect(() => {
  let alive = true;
  getFolderTree()
    .then((data) => {
      if (!alive) return;
      setFolders(data);
    })
    .catch(() => {
      // keep fallback
    });
  return () => {
    alive = false;
  };
}, []);

  useEffect(() => {
  let alive = true;
  setLoading(true);
  const folderId = folderMap.has(activePath) ? activePath : undefined;
  listAssets({
    keyword: searchText || undefined,
    file_type: filters.fileType || undefined,
    user_name: filters.person || undefined,
    date_from: filters.dateFrom || undefined,
    date_to: filters.dateTo || undefined,
    folder_id: folderId,
  })
    .then((response) => {
      if (!alive) return;
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
        metadata: asset.metadata ? (asset.metadata as Record<string, string>) : undefined,
      }));
      setFiles(items.length > 0 ? items : []);
    })
    .catch(() => {
      // fallback to mock data on failure
    })
    .finally(() => {
      if (alive) setLoading(false);
    });

  return () => {
    alive = false;
  };
}, [activePath, searchText, filters.fileType, filters.person, filters.dateFrom, filters.dateTo, folderMap]);

  const handleContextMenu = (e: React.MouseEvent, fileId: string) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, fileId });
  };

  const handleDotsClick = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, fileId });
  };

  const handleDownload = useCallback(async (fileId: string) => {
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
  }, [files]);

  const handleRename = useCallback((fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    if (file) setRenamingFile(file);
  }, [files]);

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

  const handleContextAction = useCallback(async (action: string, fileId: string) => {
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
      if (window.confirm(`"${file.name}"? ?????????`)) {
        try {
          await deleteAsset(fileId);
          setFiles((prev) => prev.filter((f) => f.id !== fileId));
          if (detailFile?.id === fileId) setDetailFile(null);
        } catch {
          // ignore
        }
      }
    }
  }, [files, detailFile, handleDownload]);

  const handleSaveNewFile = async (metadata: Record<string, string>, uploadedFile: File | null) => {
    if (!uploadedFile) return;
    const folderId = folderMap.has(activePath) ? activePath : undefined;
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
      setFiles((prev) => [mapped, ...prev]);
    } catch {
      // ignore
    }
  };
    setFiles((prev) => [newFile, ...prev]);
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
              ???? ?...
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