import type React from "react";
import { useEffect, useState } from "react";
import CloseIcon from "../../assets/close-line.svg";
import type { DAMFile } from "./DAMData";
import { FileIcon } from "./DAMFileIcons";
import { updateAssetMetadata } from "../../services/dam";

interface Props {
  file: DAMFile;
  onClose: () => void;
}

const DETAIL_FIELDS = [
  "제품명",
  "상품코드",
  "가격",
  "카테고리",
  "제품 설명",
  "패턴/무늬",
  "소재",
  "핏/스타일",
  "무드",
  "용도",
  "시즌",
  "타겟 성별",
  "타겟 연령",
  "해시태그",
];

const buildInitialValues = (metadata?: Record<string, string>): Record<string, string> => {
  const values: Record<string, string> = {};
  DETAIL_FIELDS.forEach((field) => {
    values[field] = metadata?.[field] ?? "";
  });
  return values;
};

export const FileDetailModal: React.FC<Props> = ({ file, onClose }: Props) => {
  const [editMode, setEditMode] = useState(false);
  const [values, setValues] = useState<Record<string, string>>(() => buildInitialValues(file.metadata));
  const [savedValues, setSavedValues] = useState<Record<string, string>>(() => buildInitialValues(file.metadata));

  useEffect(() => {
    const initial = buildInitialValues(file.metadata);
    setValues(initial);
    setSavedValues(initial);
  }, [file]);

  const handleSave = async () => {
    try {
      await updateAssetMetadata(file.id, values);
      setSavedValues(values);
      setEditMode(false);
    } catch {
      setEditMode(false);
    }
  };

  const handleCancel = () => {
    setValues(savedValues);
    setEditMode(false);
  };

  const renderPreview = () => {
    if (file.type === "video") {
      if (file.url) {
        return (
          <video
            src={file.url}
            controls
            className="max-w-full max-h-[280px] rounded-[8px]"
          />
        );
      }
      return (
        <div className="w-full h-[280px] bg-[#F1F5F9] rounded-[8px] flex flex-col items-center justify-center gap-[12px]">
          <FileIcon type="video" size={64} />
          <span className="text-[13px] text-[#94A3B8]">{file.name}</span>
        </div>
      );
    }

    if (file.type === "pdf") {
      if (file.url) {
        return (
          <iframe
            src={file.url}
            title={file.name}
            className="w-full h-[280px] rounded-[8px] border border-[#E2E8F0]"
          />
        );
      }
      return (
        <div className="w-full h-[280px] bg-[#F1F5F9] rounded-[8px] flex flex-col items-center justify-center gap-[12px]">
          <FileIcon type="pdf" size={64} />
          <span className="text-[13px] text-[#94A3B8]">{file.name}</span>
        </div>
      );
    }

    if (file.thumbnail) {
      return (
        <img
          src={file.thumbnail}
          alt={file.name}
          className="max-w-full max-h-[280px] object-contain rounded-[8px]"
        />
      );
    }

    return (
      <div className="w-full h-[280px] bg-[#F1F5F9] rounded-[8px] flex flex-col items-center justify-center gap-[12px]">
        <FileIcon type={file.type} size={64} />
        <span className="text-[13px] text-[#94A3B8]">{file.name}</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-[12px] shadow-xl w-[820px] max-h-[85vh] flex flex-col overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-end p-[16px_20px] border-b border-[#E2E8F0]">
          <button onClick={onClose}>
            <img src={CloseIcon} className="w-[18px] h-[18px]" />
          </button>
        </div>

        {/* 본문 */}
        <div className="flex flex-1 overflow-hidden">
          {/* 좌측: 미리보기 + 날짜 */}
          <div className="w-[380px] shrink-0 p-[20px] border-r border-[#E2E8F0] flex flex-col gap-[16px] overflow-y-auto">
            <div className="flex items-center justify-center">
              {renderPreview()}
            </div>

            <div className="text-[11px] text-[#94A3B8] flex flex-col gap-[2px]">
              <span>등록일시 | {file.createdAt ?? "-"}</span>
              <span>업데이트일시 | {file.modifiedAt ?? "-"}</span>
            </div>

            {file.referenceImages && file.referenceImages.length > 0 && (
              <div>
                <p className="text-[12px] text-[#475569] font-medium mb-[8px]">레퍼런스 이미지</p>
                <div className="flex flex-wrap gap-[8px]">
                  {file.referenceImages.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`reference-${i}`}
                      className="w-[80px] h-[80px] object-cover rounded-[6px] border border-[#E2E8F0]"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 우측: 상세 정보 */}
          <div className="flex-1 overflow-y-auto p-[20px]">
            {DETAIL_FIELDS.map((field) => (
              <div key={field} className="flex border-b border-[#F1F5F9]">
                <div className="w-[80px] shrink-0 py-[10px] text-[13px] text-[#475569]">{field}</div>
                {editMode ? (
                  <input
                    value={values[field] ?? ""}
                    onChange={(e) => setValues((prev) => ({ ...prev, [field]: e.target.value }))}
                    className="flex-1 py-[10px] px-[8px] text-[13px] text-[#0F172B] outline-none bg-transparent"
                  />
                ) : (
                  <div className="flex-1 py-[10px] px-[8px] text-[13px] text-[#0F172B]">
                    {values[field] || "-"}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-center gap-[8px] p-[16px_20px] border-t border-[#E2E8F0]">
          {editMode ? (
            <>
              <button
                onClick={handleCancel}
                className="px-[32px] py-[10px] border border-[#CBD5E1] text-[#475569] rounded-[8px] text-[14px]"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                className="px-[32px] py-[10px] bg-[#155DFC] text-white rounded-[8px] text-[14px] font-medium"
              >
                저장
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditMode(true)}
                className="px-[32px] py-[10px] border border-[#CBD5E1] text-[#475569] rounded-[8px] text-[14px]"
              >
                편집
              </button>
              <button
                onClick={onClose}
                className="px-[32px] py-[10px] bg-[#155DFC] text-white rounded-[8px] text-[14px] font-medium"
              >
                확인
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};