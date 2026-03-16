import type React from 'react';
import { useRef, useState } from 'react';
import CloseIcon from '@/assets/close-line.svg';

interface Props {
  onClose: () => void;
  onSave: (metadata: Record<string, string>, file: File | null) => void;
}

interface AiTagRow {
  category: string;
  value: string;
  reason: string;
}

const REQUIRED_FIELDS = ['제품명'];

const FORM_FIELDS = [
  { label: '제품명', placeholder: '예: 2026 S/S 신상 수납장', required: true },
  { label: '상품코드', placeholder: '예: FUR-ST-001' },
  { label: '가격', placeholder: '예: 120,000' },
  { label: '카테고리', placeholder: '예: 가구 > 수납장' },
  {
    label: '제품 설명',
    placeholder: '제품의 상세 설명을 입력하세요.',
    type: 'textarea',
  },
  { label: '소재', placeholder: '예: 오크 우드' },
  { label: '무드', placeholder: '예: 내추럴, 모던' },
  { label: '해시태그', placeholder: '예: #수납장 #신상 #인테리어' },
];

export const NewFileModal: React.FC<Props> = ({ onClose, onSave }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [aiTags, setAiTags] = useState<AiTagRow[]>([]);

  const startAiAnalysis = (fileName: string) => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAiTags([]);

    const progressTimer = window.setInterval(() => {
      setAnalysisProgress((prev) => (prev >= 92 ? prev : prev + 8));
    }, 120);

    window.setTimeout(() => {
      window.clearInterval(progressTimer);
      setAnalysisProgress(100);
      setAiTags([
        {
          category: '유형',
          value: '제품 이미지',
          reason: '단일 오브젝트 중심 구도와 배경 분리도가 높습니다.',
        },
        {
          category: '소재',
          value: '우드',
          reason: '표면 텍스처와 색상 패턴이 목재 특성과 유사합니다.',
        },
        {
          category: '무드',
          value: '모던',
          reason: '중성 계열 컬러와 미니멀한 연출이 감지되었습니다.',
        },
      ]);
      setFormValues((prev) => ({
        ...prev,
        제품명: fileName.split('.')[0],
        카테고리: '가구 > 수납장',
        소재: '우드',
        무드: '모던',
      }));
      setIsAnalyzing(false);
    }, 1600);
  };

  const handleFile = (file: File) => {
    if (uploadedUrl) URL.revokeObjectURL(uploadedUrl);
    setUploadedFile(file);
    setUploadedUrl(URL.createObjectURL(file));
    startAiAnalysis(file.name);
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (uploadedUrl) URL.revokeObjectURL(uploadedUrl);
    setUploadedFile(null);
    setUploadedUrl(null);
    setFormValues({});
    setAiTags([]);
    setIsAnalyzing(false);
    setAnalysisProgress(0);
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
      alert(`필수 항목을 입력해주세요: ${missing.join(', ')}`);
      return;
    }
    onSave(formValues, uploadedFile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <div className="bg-white rounded-[16px] shadow-2xl w-[900px] max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-[20px_24px] border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <h2 className="text-[18px] font-bold text-[#0F172B]">
            에셋 신규 등록
          </h2>
          <button
            onClick={onClose}
            className="p-[4px] hover:bg-[#E2E8F0] rounded-full transition-colors"
          >
            <img src={CloseIcon} className="w-[20px] h-[20px]" />
          </button>
        </div>

        {/* 본문 */}
        <div className="flex flex-1 overflow-hidden">
          {/* 좌측: 업로드 드롭존 */}
          <div className="w-[420px] shrink-0 p-[32px] border-r border-[#E2E8F0] flex flex-col items-center gap-[24px] bg-[#F8FAFC]/50">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
                e.target.value = '';
              }}
            />

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => !uploadedFile && fileInputRef.current?.click()}
              className={`w-full aspect-[4/3] border-2 border-dashed rounded-[12px] flex flex-col items-center justify-center gap-[16px] transition-all relative overflow-hidden ${
                uploadedFile
                  ? 'border-[#155DFC] bg-white shadow-sm'
                  : dragOver
                    ? 'border-[#155DFC] bg-[#EFF6FF]'
                    : 'border-[#CBD5E1] bg-white hover:border-[#94A3B8]'
              } ${!uploadedFile ? 'cursor-pointer' : ''}`}
            >
              {uploadedUrl ? (
                <>
                  <img
                    src={uploadedUrl}
                    alt="preview"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center group">
                    <button
                      onClick={handleRemoveFile}
                      className="opacity-0 group-hover:opacity-100 p-[8px] bg-red-500 text-white rounded-full shadow-lg transition-all transform hover:scale-110"
                    >
                      <img
                        src={CloseIcon}
                        className="w-[16px] h-[16px] brightness-0 invert"
                      />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-[64px] h-[64px] bg-[#EFF6FF] rounded-full flex items-center justify-center">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#155DFC"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-[15px] font-bold text-[#0F172B]">
                      이미지 또는 영상 업로드
                    </p>
                    <p className="text-[13px] text-[#64748B] mt-[4px]">
                      드래그 앤 드롭하거나 클릭하여 선택
                    </p>
                  </div>
                </>
              )}
            </div>

            {uploadedFile && (
              <div className="w-full p-[16px] bg-white rounded-[8px] border border-[#E2E8F0] shadow-sm flex items-center gap-[12px]">
                <div className="w-[40px] h-[40px] bg-[#F1F5F9] rounded-[4px] flex items-center justify-center text-[10px] font-bold text-[#94A3B8] uppercase">
                  {uploadedFile.name.split('.').pop()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[#0F172B] truncate">
                    {uploadedFile.name}
                  </p>
                  <p className="text-[11px] text-[#94A3B8]">
                    {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
            )}

            {isAnalyzing && (
              <div className="w-full flex flex-col gap-[8px] p-[12px] bg-[#EFF6FF] text-[#155DFC] rounded-[8px] border border-[#155DFC]/20">
                <div className="flex items-center gap-[10px]">
                  <div className="w-[14px] h-[14px] border-2 border-[#155DFC] border-t-transparent rounded-full animate-spin" />
                  <span className="text-[12px] font-bold">
                    AI 스마트 태깅 분석 중...
                  </span>
                </div>
                <div className="w-full h-[6px] bg-white rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#155DFC] transition-all duration-150"
                    style={{ width: `${analysisProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 우측: 메타데이터 폼 */}
          <div className="flex-1 overflow-y-auto p-[32px]">
            <h3 className="text-[14px] font-bold text-[#475569] mb-[20px] uppercase tracking-wider">
              Asset Information
            </h3>
            <div className="flex flex-col gap-[20px]">
              {FORM_FIELDS.map((field) => (
                <div key={field.label} className="flex flex-col gap-[6px]">
                  <label className="text-[13px] font-bold text-[#475569] flex items-center gap-[4px]">
                    {field.label}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={formValues[field.label] ?? ''}
                      onChange={(e) =>
                        handleChange(field.label, e.target.value)
                      }
                      placeholder={field.placeholder}
                      className="w-full px-[12px] py-[10px] text-[14px] text-[#0F172B] bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] focus:border-[#155DFC] focus:bg-white outline-none transition-all resize-none h-[100px]"
                    />
                  ) : (
                    <input
                      value={formValues[field.label] ?? ''}
                      onChange={(e) =>
                        handleChange(field.label, e.target.value)
                      }
                      placeholder={field.placeholder}
                      className="w-full px-[12px] py-[10px] text-[14px] text-[#0F172B] bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] focus:border-[#155DFC] focus:bg-white outline-none transition-all"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-[28px] border border-[#E2E8F0] rounded-[10px] overflow-hidden">
              <div className="flex items-center justify-between px-[14px] py-[10px] bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <p className="text-[12px] font-semibold text-[#475569] uppercase tracking-wider">
                  AI Analysis
                </p>
                <button
                  disabled={!uploadedFile || isAnalyzing}
                  onClick={() =>
                    uploadedFile && startAiAnalysis(uploadedFile.name)
                  }
                  className={`text-[12px] font-medium ${
                    uploadedFile && !isAnalyzing
                      ? 'text-[#155DFC] hover:underline'
                      : 'text-[#94A3B8] cursor-not-allowed'
                  }`}
                >
                  AI 다시 분석하기
                </button>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E2E8F0]">
                    <th className="px-[12px] py-[8px] text-[12px] text-[#64748B]">
                      Category
                    </th>
                    <th className="px-[12px] py-[8px] text-[12px] text-[#64748B]">
                      Value
                    </th>
                    <th className="px-[12px] py-[8px] text-[12px] text-[#64748B]">
                      Reason
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {aiTags.length > 0 ? (
                    aiTags.map((tag) => (
                      <tr
                        key={tag.category}
                        className="border-b border-[#F1F5F9] last:border-0"
                      >
                        <td className="px-[12px] py-[8px] text-[13px] text-[#475569]">
                          {tag.category}
                        </td>
                        <td className="px-[12px] py-[8px] text-[13px] text-[#0F172B] font-medium">
                          {tag.value}
                        </td>
                        <td className="px-[12px] py-[8px] text-[12px] text-[#64748B]">
                          {tag.reason}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-[12px] py-[16px] text-[12px] text-[#94A3B8] text-center"
                      >
                        {uploadedFile
                          ? '분석 대기 중입니다.'
                          : '파일 업로드 후 AI 분석 결과가 표시됩니다.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-end p-[20px_24px] border-t border-[#E2E8F0] gap-[12px] bg-white">
          <button
            onClick={onClose}
            className="px-[24px] py-[12px] text-[14px] font-medium text-[#475569] hover:bg-[#F1F5F9] rounded-[8px] transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={!uploadedFile}
            className={`px-[32px] py-[12px] text-[14px] font-bold rounded-[8px] shadow-lg transition-all active:scale-[0.98] ${
              uploadedFile
                ? 'bg-[#155DFC] text-white hover:bg-[#155DFC]/90'
                : 'bg-[#CBD5E1] text-[#94A3B8] cursor-not-allowed'
            }`}
          >
            DAM에 저장하기
          </button>
        </div>
      </div>
    </div>
  );
};
