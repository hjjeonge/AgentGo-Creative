import type React from 'react';
import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TemplateFieldRenderer } from '../components/template/TemplateFieldRenderer';
import { getImageJob, generateImage } from '../services/images';
import { uploadFile } from '../services/files';
import { DEFAULT_TEMPLATE_KEY } from '../constants/templateConfigs';
import type { TemplateField } from '../types/template';
import { getTemplateConfig } from '../utils/getTemplateConfig';
import { useTemplateForm } from '../hooks/template/useTemplateForm';
import { buildPrompt } from '../utils/template/buildPrompt';
import {
  buildTemplateInputs,
  extractReferenceUrls,
} from '../utils/template/buildTemplateInputs';
import { resolveImageUrl } from '../utils/template/resolveImageUrl';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!canGenerate || isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const uploadedByField: Record<string, string[]> = {};

      for (const field of template.fields) {
        if (field.type !== 'file' && field.type !== 'files') continue;

        const selectedFiles = files[field.key] ?? [];
        if (!selectedFiles.length) continue;

        const urls = await Promise.all(
          selectedFiles.map(async (file) => {
            const uploaded = await uploadFile(file);
            return uploaded.file_url;
          }),
        );
        uploadedByField[field.key] = urls;
      }

      const templateInputs = buildTemplateInputs({
        fields: template.fields,
        uploadedByField,
        getStringValue,
        getTagsValue,
      });

      const allReferenceUrls = extractReferenceUrls(uploadedByField);
      const prompt = buildPrompt(
        template.title,
        template.fields,
        templateInputs,
      );
      const sizeValue = getStringValue('size') || undefined;
      const targets = getTagsValue('target_audience');

      const res = await generateImage({
        prompt,
        concept: getStringValue('concept') || undefined,
        size: sizeValue,
        targets: targets.length > 0 ? targets : undefined,
        reference_urls: allReferenceUrls,
        template_key: template.key,
        template_name: template.title,
        template_inputs: templateInputs,
      });

      let job = res;
      if (job.status !== 'completed') {
        const maxAttempts = 30;
        for (let i = 0; i < maxAttempts; i++) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          job = await getImageJob(res.job_id);
          if (job.status === 'completed' || job.status === 'failed') break;
        }
      }

      if (job.status === 'completed' && job.result_url) {
        const imageUrl = resolveImageUrl(job.result_url);
        if (imageUrl) {
          navigate(
            `/editor?image=${encodeURIComponent(imageUrl)}&prompt=${encodeURIComponent(
              prompt,
            )}&templateName=${encodeURIComponent(
              template.title,
            )}&templatePath=${encodeURIComponent(`/template?template=${template.key}`)}`,
          );
          return;
        }
      }

      if (job.status === 'failed') {
        setErrorMessage('이미지 생성에 실패했습니다.');
        return;
      }

      setErrorMessage(
        '이미지 생성 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.',
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : '이미지 생성 요청에 실패했습니다.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: TemplateField) => {
    return (
      <TemplateFieldRenderer
        key={field.key}
        field={field}
        stringValue={getStringValue(field.key)}
        selectedTags={getTagsValue(field.key)}
        selectedFiles={files[field.key] ?? []}
        currentTagInput={tagInput[field.key] ?? ''}
        onSetStringValue={(value) => setStringValue(field.key, value)}
        onSetTagInput={(value) => setTagInputValue(field.key, value)}
        onAddTag={(raw) => addTag(field, raw)}
        onRemoveTag={(tag) => removeTag(field.key, tag)}
        onSingleFileChange={(selected) => handleSingleFile(field.key, selected)}
        onMultiFilesChange={(selected) => handleMultiFiles(field.key, selected)}
        onRemoveFile={(index) => removeFile(field.key, index)}
      />
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

        <div className="flex flex-col gap-[32px]">
          {template.fields.map((field) => renderField(field))}
        </div>

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
