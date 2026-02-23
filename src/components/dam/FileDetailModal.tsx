import type React from "react";
import { useState } from "react";
import CloseIcon from "../../assets/close-line.svg";
import type { DAMFile } from "./DAMData";

interface Props {
  file: DAMFile;
  onClose: () => void;
}

const DETAIL_FIELDS = [
  { key: "productName",  label: "제품명" },
  { key: "productCode",  label: "상품코드" },
  { key: "price",        label: "가격" },
  { key: "category",     label: "카테고리" },
  { key: "description",  label: "제품 설명" },
  { key: "pattern",      label: "패턴/무늬" },
  { key: "material",     label: "소재" },
  { key: "fit",          label: "핏/스타일" },
  { key: "mood",         label: "무드" },
  { key: "purpose",      label: "용도" },
  { key: "season",       label: "시즌" },
  { key: "targetGender", label: "타겟 성별" },
  { key: "targetAge",    label: "타겟 연령" },
  { key: "hashtag",      label: "해시태그" },
];

const SAMPLE_DETAIL: Record<string, string> = {
  productName:  "Christopher White Christopher White",
  productCode:  "XYZAB6789C",
  price:        "145,900",
  category:     "가방",
  description:  "가격 대비 성능이 훌륭해요. 제가 기대했던 것 이상으로 좋은 제품이었습니다. 가격 대비 성능이 훌륭해요.",
  pattern:      "가방",
  material:     "가죽",
  fit:          "토트백",
  mood:         "모던",
  purpose:      "-",
  season:       "사계절",
  targetGender: "남녀공용",
  targetAge:    "20-30",
  hashtag:      "#모던 #직장인 #데일리백",
};

export const FileDetailModal: React.FC<Props> = ({ file, onClose }: Props) => {
  const [editMode, setEditMode] = useState(false);
  const [values, setValues] = useState<Record<string, string>>(SAMPLE_DETAIL);

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
          {/* 좌측: 이미지 */}
          <div className="w-[380px] shrink-0 p-[20px] border-r border-[#E2E8F0] flex flex-col justify-between">
            <div className="flex-1 flex items-center justify-center">
              {file.thumbnail ? (
                <img
                  src={file.thumbnail}
                  alt={file.name}
                  className="max-w-full max-h-[320px] object-contain rounded-[8px]"
                />
              ) : (
                <div className="w-full h-[280px] bg-[#F1F5F9] rounded-[8px] flex items-center justify-center">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="18" cy="20" r="5" stroke="#CBD5E1" strokeWidth="2" />
                    <path d="M6 38L16 26L22 32L30 22L42 38" stroke="#CBD5E1" strokeWidth="2" strokeLinejoin="round" fill="none" />
                  </svg>
                </div>
              )}
            </div>
            <div className="mt-[12px] text-[11px] text-[#94A3B8] flex flex-col gap-[2px]">
              <span>생성일시 | 01/10/2026</span>
              <span>업데이트일시 | 02/05/2026</span>
            </div>
          </div>

          {/* 우측: 상세 정보 */}
          <div className="flex-1 overflow-y-auto p-[20px]">
            {DETAIL_FIELDS.map((field) => (
              <div key={field.key} className="flex border-b border-[#F1F5F9]">
                <div className="w-[80px] shrink-0 py-[10px] text-[13px] text-[#475569]">{field.label}</div>
                {editMode ? (
                  <input
                    value={values[field.key] ?? ""}
                    onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    className="flex-1 py-[10px] px-[8px] text-[13px] text-[#0F172B] outline-none bg-transparent"
                  />
                ) : (
                  <div className="flex-1 py-[10px] px-[8px] text-[13px] text-[#0F172B]">
                    {values[field.key] ?? "-"}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-center gap-[8px] p-[16px_20px] border-t border-[#E2E8F0]">
          <button
            onClick={() => setEditMode((prev) => !prev)}
            className="px-[32px] py-[10px] border border-[#CBD5E1] text-[#475569] rounded-[8px] text-[14px]"
          >
            {editMode ? "취소" : "편집"}
          </button>
          <button
            onClick={onClose}
            className="px-[32px] py-[10px] bg-[#155DFC] text-white rounded-[8px] text-[14px] font-medium"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};