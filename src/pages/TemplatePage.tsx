import type React from "react";
import { useRef, useState } from "react";
import { generateImage } from "../services/images";
import { uploadFile } from "../services/files";
import { useNavigate } from "react-router-dom";
import UploadIcon from "../assets/upload-cloud-2-line.svg";
import CloseIcon from "../assets/close-line.svg";
import AddIcon from "../assets/add.svg";

const TARGET_KEYWORDS = [
  "10대", "20대", "30대", "40대", "50대", "자기관리", "메이크업",
  "학생", "직장인", "신혼", "자취", "사회초년", "인테리어", "여행",
  "재테크", "1인가구", "반려동물", "집밥", "자기계발", "가성비",
];

const SIZE_OPTIONS = [
  { label: "1:1", value: "1:1" },
  { label: "4:5", value: "4:5" },
  { label: "16:9", value: "16:9" },
  { label: "9:16", value: "9:16" },
];

interface FormRowProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

const FormRow: React.FC<FormRowProps> = ({ label, required, children }) => (
  <div className="flex gap-[24px]">
    <div className="w-[80px] shrink-0 pt-[10px] text-right">
      <span className="text-[14px] text-[#475569]">
        {required && <span className="text-[#E11D48]">*</span>}
        {label}
      </span>
    </div>
    <div className="flex-1">{children}</div>
  </div>
);

const SizePreviewIcon: React.FC<{ ratio: string; active: boolean }> = ({ ratio, active }) => {
  const dims: Record<string, { w: number; h: number }> = {
    "1:1":  { w: 28, h: 28 },
    "4:5":  { w: 22, h: 28 },
    "16:9": { w: 36, h: 20 },
    "9:16": { w: 20, h: 36 },
  };
  const d = dims[ratio] ?? { w: 28, h: 28 };
  const color = active ? "#155DFC" : "#94A3B8";
  return (
    <svg width={d.w} height={d.h} viewBox={`0 0 ${d.w} ${d.h}`} fill="none">
      <rect
        x="1" y="1" width={d.w - 2} height={d.h - 2}
        rx="2" ry="2"
        stroke={color} strokeWidth="1.5" strokeDasharray="3 2"
      />
      <circle cx={d.w * 0.33} cy={d.h * 0.35} r="2" fill={color} />
      <path
        d={`M3 ${d.h - 3} L${d.w * 0.28} ${d.h * 0.55} L${d.w * 0.5} ${d.h * 0.72} L${d.w * 0.68} ${d.h * 0.55} L${d.w - 3} ${d.h - 3}`}
        stroke={color} strokeWidth="1.2" strokeLinejoin="round"
      />
    </svg>
  );
};

export const TemplatePage: React.FC = () => {
  const navigate = useNavigate();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const referenceInputRef = useRef<HTMLInputElement>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [concept, setConcept] = useState("");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setImageFile(e.target.files[0]);
    e.target.value = "";
  };

  const handleReferenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setReferenceFile(e.target.files[0]);
    e.target.value = "";
  };

  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (tag && !selectedTags.includes(tag) && selectedTags.length < 5) {
      setSelectedTags((prev) => [...prev, tag]);
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ";") {
      e.preventDefault();
      addTag(tagInput);
      setTagInput("");
    }
    if (e.key === "Backspace" && tagInput === "" && selectedTags.length > 0) {
      setSelectedTags((prev) => prev.slice(0, -1));
    }
  };

  const removeTag = (tag: string) =>
    setSelectedTags((prev) => prev.filter((t) => t !== tag));

  const toggleKeyword = (kw: string) => {
    if (selectedTags.includes(kw)) removeTag(kw);
    else addTag(kw);
  };

  const canGenerate = imageFile !== null && selectedTags.length > 0 && selectedSize !== null;

  const handleGenerate = async () => {
    if (!canGenerate || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const uploads: string[] = [];
      if (imageFile) {
        const uploaded = await uploadFile(imageFile);
        uploads.push(uploaded.file_url);
      }
      if (referenceFile) {
        const uploaded = await uploadFile(referenceFile);
        uploads.push(uploaded.file_url);
      }

      const prompt = selectedTags.join(", ");
      const res = await generateImage({
        prompt,
        concept,
        size: selectedSize || undefined,
        targets: selectedTags,
        reference_urls: uploads,
      });
      alert(`??? ???????. Job ID: ${res.job_id}`);
    } catch (err: any) {
      alert(err?.message || "??? ?? ??? ??????.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="h-full overflow-y-auto bg-[#F1F5F9]">
      <div className="max-w-[740px] mx-auto py-[40px] px-[20px]">
        {/* 브레드크럼 */}
        <div className="flex items-center gap-[8px] text-[14px] mb-[32px]">
          <button
            onClick={() => navigate("/")}
            className="text-[#64748B] hover:text-[#155DFC]"
          >
            홈
          </button>
          <span className="text-[#94A3B8]">&gt;</span>
          <span className="text-[#0F172B] font-medium">SNS/마케팅 광고소재</span>
        </div>

        {/* 폼 */}
        <div className="flex flex-col gap-[32px]">

          {/* 이미지 */}
          <FormRow label="이미지" required>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            {imageFile ? (
              <div className="flex items-center gap-[8px] flex-wrap">
                <span className="text-[14px] text-[#0F172B]">{imageFile.name}</span>
                <button onClick={() => setImageFile(null)}>
                  <img src={CloseIcon} className="w-[14px] h-[14px]" />
                </button>
                <button
                  disabled
                  className="border border-dashed border-[#CBD5E1] px-[14px] py-[7px] rounded-[8px] flex items-center gap-[6px] text-[13px] text-[#CBD5E1] cursor-not-allowed"
                >
                  <img src={UploadIcon} className="w-[14px] h-[14px] opacity-40" />
                  업로드
                </button>
                <button
                  disabled
                  className="bg-[#CBD5E1] text-white px-[14px] py-[7px] rounded-[8px] text-[13px] cursor-not-allowed"
                >
                  기존 이미지 찾기
                </button>
              </div>
            ) : (
              <div className="flex gap-[8px]">
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="border border-dashed border-[#94A3B8] px-[14px] py-[7px] rounded-[8px] flex items-center gap-[6px] text-[13px] text-[#475569]"
                >
                  <img src={UploadIcon} className="w-[14px] h-[14px]" />
                  업로드
                </button>
                <button className="bg-[#1E293B] text-white px-[14px] py-[7px] rounded-[8px] flex items-center gap-[6px] text-[13px]">
                  기존 이미지 찾기
                </button>
              </div>
            )}
          </FormRow>

          {/* 타겟설정 */}
          <FormRow label="타겟설정" required>
            <div
              className="border border-[#CBD5E1] rounded-[8px] p-[8px_12px] flex flex-wrap gap-[6px] min-h-[48px] focus-within:border-[#155DFC] cursor-text"
              onClick={() => document.getElementById("tag-input")?.focus()}
            >
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-[4px] bg-[#EFF6FF] border border-[#155DFC] rounded-full px-[10px] py-[3px] text-[13px] text-[#155DFC] whitespace-nowrap"
                >
                  {tag}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTag(tag);
                    }}
                  >
                    <img src={CloseIcon} className="w-[12px] h-[12px]" />
                  </button>
                </span>
              ))}
              <input
                id="tag-input"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder={
                  selectedTags.length === 0
                    ? "아래에서 어울리는 키워드를 골라주세요 (최대 5개 )"
                    : ""
                }
                className="flex-1 outline-none text-[14px] min-w-[180px] placeholder:text-[#94A3B8] bg-transparent"
              />
            </div>
            <button
              onClick={() => { addTag(tagInput); setTagInput(""); }}
              className="mt-[8px] w-full border border-dashed border-[#CBD5E1] py-[8px] rounded-[8px] text-[14px] text-[#64748B] flex items-center justify-center gap-[4px]"
            >
              <img src={AddIcon} className="w-[14px] h-[14px]" />
              직접추가
            </button>
            <div className="mt-[12px] flex flex-wrap gap-[8px]">
              {TARGET_KEYWORDS.map((kw) => (
                <button
                  key={kw}
                  onClick={() => toggleKeyword(kw)}
                  className={`px-[14px] py-[5px] rounded-full border text-[13px] ${
                    selectedTags.includes(kw)
                      ? "border-[#155DFC] text-[#155DFC] bg-[#EFF6FF]"
                      : "border-[#CBD5E1] text-[#0F172B]"
                  }`}
                >
                  {kw}
                </button>
              ))}
            </div>
          </FormRow>

          {/* 컨셉 */}
          <FormRow label="컨셉">
            <textarea
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="생각하시는 컨셉을 보다 자세히 적어주세요."
              className="w-full border border-[#CBD5E1] rounded-[8px] p-[12px] text-[14px] resize-none h-[120px] placeholder:text-[#94A3B8] outline-none focus:border-[#155DFC]"
            />
          </FormRow>

          {/* 사이즈 */}
          <FormRow label="사이즈" required>
            <div className="flex gap-[12px] flex-wrap">
              {SIZE_OPTIONS.map((size) => (
                <button
                  key={size.value}
                  onClick={() => setSelectedSize(size.value)}
                  className={`w-[118px] h-[72px] border-2 border-dashed rounded-[12px] flex items-center justify-center gap-[8px] text-[14px] ${
                    selectedSize === size.value
                      ? "border-[#155DFC] text-[#155DFC] bg-[#EFF6FF]"
                      : "border-[#CBD5E1] text-[#64748B]"
                  }`}
                >
                  <SizePreviewIcon ratio={size.value} active={selectedSize === size.value} />
                  <span>{size.label}</span>
                </button>
              ))}
            </div>
          </FormRow>

          {/* 레퍼런스 */}
          <FormRow label="레퍼런스">
            <input
              ref={referenceInputRef}
              type="file"
              className="hidden"
              onChange={handleReferenceUpload}
            />
            <div className="flex items-center gap-[8px] flex-wrap">
              {referenceFile && (
                <>
                  <span className="text-[14px] text-[#0F172B]">{referenceFile.name}</span>
                  <button onClick={() => setReferenceFile(null)}>
                    <img src={CloseIcon} className="w-[14px] h-[14px]" />
                  </button>
                </>
              )}
              <button
                onClick={() => referenceInputRef.current?.click()}
                disabled={!!referenceFile}
                className="border border-dashed border-[#CBD5E1] px-[14px] py-[7px] rounded-[8px] flex items-center gap-[6px] text-[13px] text-[#475569] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                첨부
              </button>
            </div>
          </FormRow>

          {/* 항목추가 */}
          <FormRow label="항목추가">
            <button className="border border-dashed border-[#CBD5E1] px-[14px] py-[7px] rounded-[8px] flex items-center gap-[6px] text-[13px] text-[#475569]">
              추가
              <img src={AddIcon} className="w-[14px] h-[14px]" />
            </button>
          </FormRow>

          {/* 이미지 생성 */}
          <div className="flex justify-center mt-[8px]">
            <button
              disabled={!canGenerate}
              className={`px-[40px] py-[12px] rounded-[8px] text-[15px] font-medium ${
                canGenerate
                  ? "bg-[#155DFC] text-white"
                  : "bg-[#CBD5E1] text-[#94A3B8] cursor-not-allowed"
              }`}
            >
              이미지 생성
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
