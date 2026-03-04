import type React from "react";
import { useEffect, useRef, useState } from "react";
import CloseIcon from "../../assets/close-line.svg";
import type { DAMFile } from "./DAMData";
import { FileIcon } from "./DAMFileIcons";
import { updateAssetMetadata } from "../../services/dam";

interface Props {
  file: DAMFile;
  onClose: () => void;
  onOpenPermissions?: (file: DAMFile) => void;
}

type TabType = "Basic" | "Advanced" | "Tags" | "Workfront";
type DAMStatus = NonNullable<DAMFile["status"]>;
type BasicValues = {
  title: string;
  description: string;
  status: DAMStatus;
  author: string;
};

const TABS: TabType[] = ["Basic", "Advanced", "Tags", "Workfront"];
const STATUS_OPTIONS: DAMStatus[] = ["none", "approved", "rejected", "pending"];

const toStatus = (value: string): DAMStatus => {
  if (value === "approved" || value === "rejected" || value === "pending") return value;
  return "none";
};

export const FileDetailModal: React.FC<Props> = ({ file, onClose, onOpenPermissions }: Props) => {
  const [activeTab, setActiveTab] = useState<TabType>("Basic");
  const [editMode, setEditMode] = useState(false);
  const [videoSpeed, setVideoSpeed] = useState(1);
  const [smartCropRatio, setSmartCropRatio] = useState<"original" | "1:1" | "4:5" | "16:9">("original");
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Local state for basic fields
  const [basicValues, setBasicValues] = useState<BasicValues>({
    title: file.title || "",
    description: file.description || "",
    status: file.status ?? "none",
    author: file.author || "",
  });

  useEffect(() => {
    setBasicValues({
      title: file.title || "",
      description: file.description || "",
      status: file.status ?? "none",
      author: file.author || "",
    });
  }, [file]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = videoSpeed;
    }
  }, [videoSpeed]);

  const handleSave = async () => {
    try {
      // API call to update metadata/basic info
      await updateAssetMetadata(file.id, basicValues);
      setEditMode(false);
    } catch {
      setEditMode(false);
    }
  };

  const handleCancel = () => {
    setBasicValues({
      title: file.title || "",
      description: file.description || "",
      status: file.status ?? "none",
      author: file.author || "",
    });
    setEditMode(false);
  };

  const renderPreview = () => {
    if (file.type === "video") {
      return file.url ? (
        <div className="relative w-full">
          <video ref={videoRef} src={file.url} controls className="max-w-full max-h-[400px] rounded-[8px] w-full" />
          <div className="absolute top-[10px] right-[10px] flex items-center gap-[6px]">
            {[1, 1.5, 2].map((speed) => (
              <button
                key={speed}
                onClick={() => setVideoSpeed(speed)}
                className={`px-[6px] py-[3px] rounded-[6px] text-[10px] font-medium ${
                  videoSpeed === speed ? "bg-[#155DFC] text-white" : "bg-white/90 text-[#475569]"
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full h-[300px] bg-[#F1F5F9] rounded-[8px] flex flex-col items-center justify-center gap-[12px]">
          <FileIcon type="video" size={64} />
          <span className="text-[13px] text-[#94A3B8]">{file.name}</span>
        </div>
      );
    }
    if (file.type === "pdf") {
      return file.url ? (
        <iframe src={file.url} title={file.name} className="w-full h-[400px] rounded-[8px] border border-[#E2E8F0]" />
      ) : (
        <div className="w-full h-[300px] bg-[#F1F5F9] rounded-[8px] flex flex-col items-center justify-center gap-[12px]">
          <FileIcon type="pdf" size={64} />
          <span className="text-[13px] text-[#94A3B8]">{file.name}</span>
        </div>
      );
    }
    return file.thumbnail || file.url ? (
      <img
        src={file.thumbnail || file.url}
        alt={file.name}
        className={`max-w-full max-h-[400px] object-contain rounded-[8px] ${
          smartCropRatio === "1:1" ? "aspect-square" : smartCropRatio === "4:5" ? "aspect-[4/5]" : smartCropRatio === "16:9" ? "aspect-video" : ""
        }`}
      />
    ) : (
      <div className="w-full h-[300px] bg-[#F1F5F9] rounded-[8px] flex flex-col items-center justify-center gap-[12px]">
        <FileIcon type={file.type} size={64} />
        <span className="text-[13px] text-[#94A3B8]">{file.name}</span>
      </div>
    );
  };

  const renderBasicTab = () => (
    <div className="flex flex-col gap-[4px]">
      {[
        { label: "File name", value: file.name, readonly: true },
        { label: "Title", value: basicValues.title, field: "title" },
        { label: "Description", value: basicValues.description, field: "description", type: "textarea" },
        { label: "Uploaded by", value: file.person, readonly: true },
        { label: "Author", value: basicValues.author, field: "author" },
        { label: "Status", value: basicValues.status, field: "status", type: "status" },
        { label: "Creation Date", value: file.createdAt || "-", readonly: true },
        { label: "Modified Date", value: file.modifiedAt, readonly: true },
        { label: "Resolution", value: file.resolution || "-", readonly: true },
        { label: "Size", value: file.size, readonly: true },
      ].map((item) => (
        <div key={item.label} className="flex border-b border-[#F1F5F9] py-[10px]">
          <div className="w-[120px] shrink-0 text-[13px] text-[#64748B]">{item.label}</div>
          <div className="flex-1">
            {editMode && !item.readonly ? (
              item.type === "status" ? (
                <select
                  value={basicValues.status}
                  onChange={(e) => setBasicValues((v) => ({ ...v, status: toStatus(e.target.value) }))}
                  className="w-full text-[13px] text-[#0F172B] outline-none bg-transparent border border-[#E2E8F0] rounded-[4px] px-[4px]"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status === "none" ? "No Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              ) : item.type === "textarea" ? (
                <textarea
                  value={item.value}
                  onChange={(e) => setBasicValues(v => ({ ...v, [item.field!]: e.target.value }))}
                  className="w-full text-[13px] text-[#0F172B] outline-none bg-transparent resize-none h-[60px]"
                />
              ) : (
                <input
                  value={item.value}
                  onChange={(e) => setBasicValues(v => ({ ...v, [item.field!]: e.target.value }))}
                  className="w-full text-[13px] text-[#0F172B] outline-none bg-transparent"
                />
              )
            ) : (
              <span className={`text-[13px] ${item.label === "Status" ? getStatusColor(item.value) : "text-[#0F172B]"}`}>
                {item.value || "-"}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderAdvancedTab = () => (
    <div className="flex flex-col gap-[4px]">
      {[
        { label: "Make", value: file.make },
        { label: "Model", value: file.model },
        { label: "GPS longitude", value: file.gps?.lng },
        { label: "GPS latitude", value: file.gps?.lat },
        { label: "GPS altitude", value: file.gps?.alt },
        { label: "Lens", value: file.lens },
        { label: "Expiration date", value: file.expirationDate },
      ].map((item) => (
        <div key={item.label} className="flex border-b border-[#F1F5F9] py-[10px]">
          <div className="w-[120px] shrink-0 text-[13px] text-[#64748B]">{item.label}</div>
          <div className="flex-1 text-[13px] text-[#0F172B]">{item.value || "-"}</div>
        </div>
      ))}
    </div>
  );

  const renderTagsTab = () => (
    <div className="flex flex-col gap-[20px]">
      <div className="border border-[#E2E8F0] rounded-[8px] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <th className="px-[12px] py-[10px] text-[12px] font-semibold text-[#475569] w-[100px]">Category</th>
              <th className="px-[12px] py-[10px] text-[12px] font-semibold text-[#475569] w-[120px]">Value</th>
              <th className="px-[12px] py-[10px] text-[12px] font-semibold text-[#475569]">Reason</th>
            </tr>
          </thead>
          <tbody>
            {(file.aiTags || []).length > 0 ? (
              file.aiTags!.map((tag, i) => (
                <tr key={i} className="border-b border-[#F1F5F9] last:border-0">
                  <td className="px-[12px] py-[10px] text-[13px] text-[#64748B]">{tag.category}</td>
                  <td className="px-[12px] py-[10px] text-[13px] text-[#0F172B] font-medium">{tag.value}</td>
                  <td className="px-[12px] py-[10px] text-[12px] text-[#94A3B8] italic">
                    <div className="inline-flex items-center gap-[6px] group/reason relative">
                      <span>View reason</span>
                      <span className="w-[16px] h-[16px] rounded-full border border-[#CBD5E1] text-[#64748B] text-[10px] font-bold inline-flex items-center justify-center cursor-help">i</span>
                      <div className="absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 z-10 w-[260px] p-[10px] bg-[#0F172B] text-white text-[11px] leading-[1.5] rounded-[8px] shadow-lg opacity-0 pointer-events-none group-hover/reason:opacity-100 transition-opacity">
                        {tag.reason}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-[12px] py-[20px] text-center text-[13px] text-[#94A3B8]">AI 분석 데이터가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {file.aiSummary && (
        <div className="bg-[#F1F5F9] p-[16px] rounded-[8px]">
          <p className="text-[12px] font-semibold text-[#475569] mb-[8px]">AI Summary</p>
          <p className="text-[13px] text-[#475569] leading-relaxed">{file.aiSummary}</p>
        </div>
      )}
    </div>
  );

  const renderWorkfrontTab = () => {
    const wf = file.workfront;
    return (
      <div className="flex flex-col gap-[4px]">
        {[
          { label: "Project Name", value: wf?.projectName },
          { label: "Project ID", value: wf?.projectId },
          { label: "Document ID", value: wf?.documentId },
          { label: "Task Name", value: wf?.taskName },
          { label: "Task Description", value: wf?.taskDescription, full: true },
        ].map((item) => (
          <div key={item.label} className={`flex border-b border-[#F1F5F9] py-[10px] ${item.full ? "flex-col gap-[4px]" : ""}`}>
            <div className={`${item.full ? "w-full" : "w-[120px]"} shrink-0 text-[13px] text-[#64748B]`}>{item.label}</div>
            <div className="flex-1 text-[13px] text-[#0F172B]">{item.value || "-"}</div>
          </div>
        ))}
      </div>
    );
  };

  const getStatusColor = (status: string) => {
    if (status === "approved") return "text-[#059669] font-semibold";
    if (status === "rejected") return "text-[#DC2626] font-semibold";
    if (status === "pending") return "text-[#D97706] font-semibold";
    return "text-[#64748B]";
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-[16px] shadow-2xl w-[960px] max-h-[90vh] flex flex-col overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-[16px_24px] border-b border-[#E2E8F0]">
          <h2 className="text-[16px] font-bold text-[#0F172B] truncate max-w-[60%]">{file.name}</h2>
          <div className="flex items-center gap-[10px]">
            {onOpenPermissions && (
              <button
                onClick={() => onOpenPermissions(file)}
                className="px-[12px] py-[7px] border border-[#155DFC] text-[#155DFC] rounded-[8px] text-[12px] font-medium hover:bg-[#EFF6FF]"
              >
                권한 설정
              </button>
            )}
            <button onClick={onClose} className="p-[4px] hover:bg-[#F1F5F9] rounded-full transition-colors">
              <img src={CloseIcon} className="w-[20px] h-[20px]" />
            </button>
          </div>
        </div>

        {/* 본문 */}
        <div className="flex flex-1 overflow-hidden">
          {/* 좌측: 미리보기 + 레퍼런스 */}
          <div className="w-[440px] shrink-0 p-[24px] border-r border-[#E2E8F0] flex flex-col gap-[20px] overflow-y-auto bg-[#F8FAFC]/50">
            <div className="flex items-center justify-center bg-white p-[12px] rounded-[12px] border border-[#E2E8F0] shadow-sm">
              {renderPreview()}
            </div>

            {(file.type === "image" || file.type === "video") && (
              <div className="bg-white border border-[#E2E8F0] rounded-[10px] p-[12px]">
                <p className="text-[12px] font-semibold text-[#475569] mb-[8px]">Smart Crop / Rich Media</p>
                <div className="flex items-center gap-[6px] flex-wrap">
                  {(["original", "1:1", "4:5", "16:9"] as const).map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => setSmartCropRatio(ratio)}
                      className={`px-[8px] py-[5px] rounded-[6px] text-[11px] ${
                        smartCropRatio === ratio ? "bg-[#155DFC] text-white" : "bg-[#F1F5F9] text-[#475569]"
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {file.referenceImages && file.referenceImages.length > 0 && (
              <div>
                <p className="text-[12px] text-[#475569] font-bold mb-[10px] flex items-center gap-[6px]">
                  레퍼런스 이미지
                  <span className="text-[10px] px-[6px] py-[2px] bg-[#EFF6FF] text-[#155DFC] rounded-full">{file.referenceImages.length}</span>
                </p>
                <div className="flex flex-wrap gap-[10px]">
                  {file.referenceImages.map((src, i) => (
                    <div key={i} className="group relative w-[90px] h-[90px] rounded-[8px] overflow-hidden border border-[#E2E8F0] hover:border-[#155DFC] transition-colors cursor-pointer">
                      <img src={src} alt={`ref-${i}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 우측: 상세 정보 탭 */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* 탭 헤더 */}
            <div className="flex border-b border-[#E2E8F0] px-[20px]">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setEditMode(false); }}
                  className={`px-[16px] py-[14px] text-[14px] font-medium transition-colors relative ${
                    activeTab === tab ? "text-[#155DFC]" : "text-[#64748B] hover:text-[#0F172B]"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#155DFC]" />
                  )}
                </button>
              ))}
            </div>

            {/* 탭 콘텐츠 */}
            <div className="flex-1 overflow-y-auto p-[24px]">
              {activeTab === "Basic" && renderBasicTab()}
              {activeTab === "Advanced" && renderAdvancedTab()}
              {activeTab === "Tags" && renderTagsTab()}
              {activeTab === "Workfront" && renderWorkfrontTab()}
            </div>

            {/* 하단 액션 바 (Basic 탭 전용) */}
            <div className="p-[16px_24px] border-t border-[#E2E8F0] flex justify-end gap-[10px] bg-white">
              {activeTab === "Basic" ? (
                editMode ? (
                  <>
                    <button onClick={handleCancel} className="px-[24px] py-[10px] border border-[#CBD5E1] text-[#475569] rounded-[8px] text-[14px] font-medium hover:bg-[#F1F5F9]">취소</button>
                    <button onClick={handleSave} className="px-[24px] py-[10px] bg-[#155DFC] text-white rounded-[8px] text-[14px] font-bold shadow-md hover:bg-[#155DFC]/90 active:scale-[0.98]">저장</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setEditMode(true)} className="px-[24px] py-[10px] border border-[#155DFC] text-[#155DFC] rounded-[8px] text-[14px] font-medium hover:bg-[#EFF6FF]">편집</button>
                    <button onClick={onClose} className="px-[24px] py-[10px] bg-[#155DFC] text-white rounded-[8px] text-[14px] font-bold hover:bg-[#155DFC]/90 active:scale-[0.98]">확인</button>
                  </>
                )
              ) : (
                <button onClick={onClose} className="px-[24px] py-[10px] bg-[#155DFC] text-white rounded-[8px] text-[14px] font-bold hover:bg-[#155DFC]/90 active:scale-[0.98]">확인</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
