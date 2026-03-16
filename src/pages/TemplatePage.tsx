import type React from 'react';
import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TemplateFieldsSection } from '@/features/template/components/TemplateFieldsSection';
import { DEFAULT_TEMPLATE_KEY } from '@/features/template/constants/templateConfig';
import { getTemplateConfig } from '@/features/template/utils/getTemplateConfig';
import { useTemplateForm } from '@/features/template/hooks/useTemplateForm';
import { useTemplateGenerate } from '@/features/template/hooks/useTemplateGenerate';

export const TemplatePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const templateKey = searchParams.get('template') ?? DEFAULT_TEMPLATE_KEY;
  const template = useMemo(() => getTemplateConfig(templateKey), [templateKey]);

  const {
    files,
    tagInput,
    getStringValue,
    getTagsValue,
    setStringValue,
    setTagInputValue,
    addTag,
    removeTag,
    handleSingleFile,
    handleMultiFiles,
    removeFile,
    canGenerate,
  } = useTemplateForm(template.fields);
  const { isSubmitting, errorMessage, generateFromTemplate } =
    useTemplateGenerate({
      template,
      files,
      getStringValue,
      getTagsValue,
    });

  const handleGenerate = async () => {
    if (!canGenerate || isSubmitting) return;

    const result = await generateFromTemplate();
    if (!result) return;

    navigate(
      `/editor?image=${encodeURIComponent(result.imageUrl)}&prompt=${encodeURIComponent(
        result.prompt,
      )}&templateName=${encodeURIComponent(
        template.title,
      )}&templatePath=${encodeURIComponent(`/template?template=${template.key}`)}`,
    );
  };

  return (
    <div className="h-full overflow-y-auto bg-[#F8FAFC]">
      <div className="max-w-[1000px] mx-auto py-[40px] px-[20px] bg-white border-l border-r border-[#E2E8F0]">
        <div className="flex items-center gap-[8px] text-[14px] mb-[16px]">
          <button
            onClick={() => navigate('/')}
            className="text-[#64748B] hover:text-[#155DFC]"
          >
            홈
          </button>
          <span className="text-[#94A3B8]">&gt;</span>
          <span className="text-[#0F172B] font-bold">{template.title}</span>
        </div>

        <div className="mb-[24px] rounded-[10px] border border-[#DBEAFE] bg-[#EFF6FF] px-[14px] py-[10px] text-[13px] text-[#1E3A8A]">
          {template.aiStatus === 'available'
            ? `AI 연동 기준: ${template.aiFeature} API 입력 규격`
            : 'AI 서버 미구현 템플릿입니다. 입력값은 현재 key-value 프롬프트로 조합되어 생성됩니다.'}
        </div>

        <TemplateFieldsSection
          fields={template.fields}
          files={files}
          tagInput={tagInput}
          getStringValue={getStringValue}
          getTagsValue={getTagsValue}
          setStringValue={setStringValue}
          setTagInputValue={setTagInputValue}
          addTag={addTag}
          removeTag={removeTag}
          handleSingleFile={handleSingleFile}
          handleMultiFiles={handleMultiFiles}
          removeFile={removeFile}
        />

        {errorMessage && (
          <div className="mt-[24px] rounded-[8px] border border-[#FCA5A5] bg-[#FEF2F2] px-[14px] py-[10px] text-[13px] text-[#991B1B]">
            {errorMessage}
          </div>
        )}

        <div className="flex justify-center mt-[40px]">
          <button
            onClick={handleGenerate}
            disabled={!canGenerate || isSubmitting}
            className={`px-[40px] py-[12px] rounded-[8px] text-[15px] font-medium ${
              canGenerate && !isSubmitting
                ? 'bg-[#155DFC] text-white'
                : 'bg-[#CBD5E1] text-[#94A3B8] cursor-not-allowed'
            }`}
          >
            {isSubmitting ? '생성 중...' : '이미지 생성'}
          </button>
        </div>
      </div>
    </div>
  );
};
