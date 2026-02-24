import type React from "react";
import { useRef, useState } from "react";
import CloseIcon from "../../assets/close-line.svg";
import type { DAMFile } from "./DAMData";

interface Props {
  onClose: () => void;
  onSave: (metadata: Record<string, string>, file: File | null) => void;
}

const REQUIRED_FIELDS = ["제품명"];

const FORM_FIELDS = [
  "제품명", "상품코드", "가격", "카테고리", "제품 설명",
  "패턴/무늬", "소재", "핏/스타일", "무드", "용도",
  "시즌", "타겟 성별", "타겟 연령", "해시태그",
];

export const NewFileModal: React.FC<Props> = ({ onClose, onSave }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const handleFile = (file: File) => {
    if (uploadedUrl) URL.revokeObjectURL(uploadedUrl);
    setUploadedFile(file);
    setUploadedUrl(URL.createObjectURL(file));
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (uploadedUrl) URL.revokeObjectURL(uploadedUrl);
    setUploadedFile(null);
    setUploadedUrl(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (field: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const missing = REQUIRED_FIELDS.filter((f) => !formValues[f]?.trim());
    if (missing.length > 0) {
      alert(`필수 항목을 입력해주세요: ${missing.join(", ")}`);
      return;
    }
    onSave(formValues, uploadedFile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-[12px] shadow-xl w-[800px] max-h-[85vh] flex flex-col overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-end p-[16px_20px] border-b border-[#E2E8F0]">
          <button onClick={onClose}>
            <img src={CloseIcon} className="w-[18px] h-[18px]" />
          </button>
        </div>

        {/* 본문 */}
        <div className="flex flex-1 overflow-hidden">
          {/* 좌측: 업로드 */}
          <div className="w-[380px] shrink-0 p-[20px] border-r border-[#E2E8F0] flex flex-col items-center justify-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
                e.target.value = "";
              }}
            />
            {uploadedUrl ? (
              <div className="relative w-full h-[280px] rounded-[8px] overflow-hidden">
                <img src={uploadedUrl} alt={uploadedFile?.name} className="w-full h-full object-contain bg-[#F8FAFC]" />
                <button
                  onClick={handleRemoveFile}
                  className="absolute top-[8px] right-[8px] w-[24px] h-[24px] bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center"
                >
                  <img src={CloseIcon} className="w-[12px] h-[12px] brightness-0 invert" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full h-[280px] border-2 border-dashed rounded-[8px] flex flex-col items-center justify-center gap-[8px] cursor-pointer ${
                  dragOver ? "border-[#155DFC] bg-[#EFF6FF]" : "border-[#CBD5E1] bg-[#F8FAFC]"
                }`}
              >
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="18" cy="20" r="5" stroke="#94A3B8" strokeWidth="2" />
                  <path d="M6 38L16 26L22 32L30 22L42 38" stroke="#94A3B8" strokeWidth="2" strokeLinejoin="round" fill="none" />
                </svg>
                <span className="text-[14px] text-[#64748B]">여기로 이미지를 드래그하거나</span>
                <button
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  className="text-[14px] text-[#155DFC] underline"
                >
                  파일을 업로드 하세요.
                </button>
              </div>
            )}
          </div>

          {/* 우측: 폼 */}
          <div className="flex-1 overflow-y-auto p-[20px]">
            <div className="flex flex-col gap-[2px]">
              {FORM_FIELDS.map((field) => (
                <div key={field} className="flex border-b border-[#F1F5F9]">
                  <div className="w-[80px] shrink-0 py-[10px] text-[13px] text-[#475569] flex items-center gap-[2px]">
                    {field}
                    {REQUIRED_FIELDS.includes(field) && (
                      <span className="text-[#E11D48]">*</span>
                    )}
                  </div>
                  <input
                    value={formValues[field] ?? ""}
                    onChange={(e) => handleChange(field, e.target.value)}
                    placeholder={REQUIRED_FIELDS.includes(field) ? "필수 입력 사항입니다." : "입력하세요."}
                    className="flex-1 py-[10px] px-[8px] text-[13px] text-[#0F172B] placeholder:text-[#CBD5E1] outline-none bg-transparent"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-center p-[16px_20px] border-t border-[#E2E8F0]">
          <button
            className="px-[40px] py-[10px] bg-[#155DFC] text-white rounded-[8px] text-[14px] font-medium"
            onClick={handleSave}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};