import type React from "react";
import { useState } from "react";
import type { CollectionItem, FolderNode } from "../../services/dam";
import ArrowDown from "../../assets/arrow_down.svg";

const FOLDER_YEARS = [
  {
    year: "2025",
    children: [],
  },
  {
    year: "2026",
    children: ["23STUV4567W8X9Y1", "David Garcia David Garci...", "8월"],
  },
];

const PROJECT_CATEGORIES = [
  "SNS/마케팅 광고소재",
  "상세페이지/카탈로그 생성",
  "스튜디오 촬영 이미지 생성",
  "다국어 변환 이미지 생성",
  "인포그래픽 이미지 생성",
  "삽화 이미지 생성",
  "일러스트 이미지 완성",
];

interface Props {
  activePath: string;
  onNavigate: (path: string) => void;
  folders?: FolderNode[];
  collections?: CollectionItem[];
}

export const DAMSidebar: React.FC<Props> = ({ activePath, onNavigate, folders, collections }: Props) => {
  const [allFilesOpen, setAllFilesOpen] = useState(true);
  const [expandedYears, setExpandedYears] = useState<string[]>(["2026"]);

  const toggleYear = (year: string) => {
    setExpandedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    );
  };


  const renderFolders = (nodes: FolderNode[], depth: number = 0) => {
    return nodes.map((node) => {
      const hasChildren = (node.children || []).length > 0;
      const isExpanded = expandedYears.includes(node.id);
      return (
        <div key={node.id}>
          <button
            onClick={() => {
              if (hasChildren) {
                toggleYear(node.id);
              }
              onNavigate(node.id);
            }}
            className={`w-full flex items-center gap-[6px] px-[16px] py-[6px] text-[13px] truncate ${
              activePath === node.id
                ? "text-[#155DFC] bg-[#EFF6FF]"
                : "text-[#475569] hover:bg-[#F1F5F9]"
            }`}
            style={{ paddingLeft: `${16 + depth * 10}px` }}
          >
            {hasChildren && (
              <img
                src={ArrowDown}
                className={`w-[10px] h-[10px] transition-transform ${
                  isExpanded ? "" : "-rotate-90"
                }`}
              />
            )}
            {!hasChildren && <span className="w-[10px]" />}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1.5 3.5C1.5 2.95 1.95 2.5 2.5 2.5H5.5L6.5 3.5H11.5C12.05 3.5 12.5 3.95 12.5 4.5V10.5C12.5 11.05 12.05 11.5 11.5 11.5H2.5C1.95 11.5 1.5 11.05 1.5 10.5V3.5Z"
                fill="#3B82F6"
              />
            </svg>
            {node.name}
          </button>
          {hasChildren && isExpanded && (
            <div>{renderFolders(node.children || [], depth + 1)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <aside className="w-[180px] shrink-0 bg-white border-r border-[#569DFF]/20 overflow-y-auto py-[16px] flex flex-col gap-[4px]">
      {/* 모든파일 */}
      <div>
        <button
          onClick={() => setAllFilesOpen((prev) => !prev)}
          className="w-full flex items-center gap-[6px] px-[16px] py-[8px] text-[14px] text-[#0F172B] hover:bg-[#F1F5F9]"
        >
          <img
            src={ArrowDown}
            className={`w-[12px] h-[12px] transition-transform ${allFilesOpen ? "" : "-rotate-90"}`}
          />
          <span className="font-medium">모든파일</span>
        </button>
        {allFilesOpen && (
          <div className="pl-[8px]">
            {folders && folders.length > 0 ? renderFolders(folders) : FOLDER_YEARS.map((folder) => (
              <div key={folder.year}>
                <button
                  onClick={() => {
                    if (folder.children.length > 0) toggleYear(folder.year);
                    else onNavigate(folder.year);
                  }}
                  className="w-full flex items-center gap-[6px] px-[16px] py-[6px] text-[13px] text-[#475569] hover:bg-[#F1F5F9]"
                >
                  {folder.children.length > 0 && (
                    <img
                      src={ArrowDown}
                      className={`w-[10px] h-[10px] transition-transform ${
                        expandedYears.includes(folder.year) ? "" : "-rotate-90"
                      }`}
                    />
                  )}
                  {folder.children.length === 0 && <span className="w-[10px]" />}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M1.5 3.5C1.5 2.95 1.95 2.5 2.5 2.5H5.5L6.5 3.5H11.5C12.05 3.5 12.5 3.95 12.5 4.5V10.5C12.5 11.05 12.05 11.5 11.5 11.5H2.5C1.95 11.5 1.5 11.05 1.5 10.5V3.5Z"
                      fill="#3B82F6"
                    />
                  </svg>
                  {folder.year}
                </button>
                {folder.children.length > 0 && expandedYears.includes(folder.year) && (
                  <div className="pl-[16px]">
                    {folder.children.map((child) => (
                      <button
                        key={child}
                        onClick={() => onNavigate(child)}
                        className={`w-full text-left px-[16px] py-[5px] text-[12px] truncate ${
                          activePath === child
                            ? "text-[#155DFC] bg-[#EFF6FF]"
                            : "text-[#475569] hover:bg-[#F1F5F9]"
                        }`}
                      >
                        {child}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 최근 / 공유 / 워크스페이스 */}
      {["최근", "공유", "My Workspace"].map((label) => (
        <button
          key={label}
          onClick={() => onNavigate(label)}
          className={`w-full text-left px-[16px] py-[8px] text-[14px] ${
            activePath === label
              ? "text-[#155DFC] bg-[#EFF6FF]"
              : "text-[#0F172B] hover:bg-[#F1F5F9]"
          }`}
        >
          {label === "My Workspace" ? (
            <div className="flex items-center gap-[6px]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
              </svg>
              <span className="font-semibold">My Workspace</span>
            </div>
          ) : (
            label
          )}
        </button>
      ))}

      {/* 컬렉션 (Collections) */}
      <div className="mt-[4px]">
        <div className="px-[16px] py-[8px] text-[12px] font-bold text-[#94A3B8] uppercase tracking-wider">Collections</div>
        {(collections && collections.length > 0 ? collections : [
          { id: "fallback-summer", name: "Summer Campaign", asset_ids: [] },
          { id: "fallback-ski", name: "Ski Season 2026", asset_ids: [] },
          { id: "fallback-modern", name: "Modern Interior", asset_ids: [] },
        ]).map((coll) => (
          <button
            key={coll.id}
            onClick={() => onNavigate(`coll:${coll.id}`)}
            className={`w-full text-left px-[16px] py-[6px] text-[13px] truncate ${
              activePath === `coll:${coll.id}`
                ? "text-[#155DFC] bg-[#EFF6FF]"
                : "text-[#475569] hover:bg-[#F1F5F9]"
            }`}
          >
            <div className="flex items-center gap-[6px]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              {coll.name}
            </div>
          </button>
        ))}
      </div>

      {/* 프로젝트 카테고리 */}
      <div className="mt-[4px] border-t border-[#F1F5F9] pt-[4px]">
        <div className="px-[16px] py-[8px] text-[11px] font-bold text-[#94A3B8] uppercase">Categories</div>
        {PROJECT_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onNavigate(cat)}
            className={`w-full text-left px-[16px] py-[7px] text-[13px] truncate ${
              activePath === cat
                ? "text-[#155DFC] bg-[#EFF6FF]"
                : "text-[#475569] hover:bg-[#F1F5F9]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </aside>
  );
};
