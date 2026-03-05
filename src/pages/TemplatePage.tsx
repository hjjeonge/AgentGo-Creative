import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TemplateFieldRenderer } from '../components/template/TemplateFieldRenderer';
import { getImageJob, generateImage } from '../services/images';
import { uploadFile } from '../services/files';
import { DEFAULT_TEMPLATE_KEY } from '../constants/templateConfigs';
import type { TemplateField } from '../types/template';
import { getTemplateConfig } from '../utils/getTemplateConfig';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const resolveImageUrl = (url: string | null | undefined) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${API_BASE_URL}${url}`;
};

type FormValues = Record<string, string | string[]>;
type FormFiles = Record<string, File[]>;

const buildInitialValues = (fields: TemplateField[]): FormValues => {
  return fields.reduce<FormValues>((acc, field) => {
    acc[field.key] = field.type === 'tags' ? [] : '';
    return acc;
  }, {});
};

export const TemplatePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const templateKey = searchParams.get('template') ?? DEFAULT_TEMPLATE_KEY;
  const template = useMemo(() => getTemplateConfig(templateKey), [templateKey]);

  const [values, setValues] = useState<FormValues>({});
  const [files, setFiles] = useState<FormFiles>({});
  const [tagInput, setTagInput] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setValues(buildInitialValues(template.fields));
    setFiles({});
    setTagInput({});
  }, [template.key, template.fields]);

  const getStringValue = (key: string): string => {
    const value = values[key];
    return typeof value === 'string' ? value : '';
  };

  const getTagsValue = (key: string): string[] => {
    const value = values[key];
    return Array.isArray(value) ? value : [];
  };

  const setStringValue = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const addTag = (field: TemplateField, raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    const maxItems = field.maxItems ?? 5;
    const current = getTagsValue(field.key);
    if (current.includes(trimmed) || current.length >= maxItems) return;

    setValues((prev) => ({
      ...prev,
      [field.key]: [...current, trimmed],
    }));
    setTagInput((prev) => ({ ...prev, [field.key]: '' }));
  };

  const removeTag = (fieldKey: string, tag: string) => {
    const current = getTagsValue(fieldKey);
    setValues((prev) => ({
      ...prev,
      [fieldKey]: current.filter((item) => item !== tag),
    }));
  };

  const handleSingleFile = (fieldKey: string, selected: File | null) => {
    setFiles((prev) => ({
      ...prev,
      [fieldKey]: selected ? [selected] : [],
    }));
  };

  const handleMultiFiles = (fieldKey: string, selected: File[]) => {
    setFiles((prev) => ({
      ...prev,
      [fieldKey]: selected,
    }));
  };

  const removeFile = (fieldKey: string, index: number) => {
    const current = files[fieldKey] ?? [];
    setFiles((prev) => ({
      ...prev,
      [fieldKey]: current.filter((_, idx) => idx !== index),
    }));
  };

  const isFieldFilled = (field: TemplateField): boolean => {
    if (!field.required) return true;

    if (field.type === 'file' || field.type === 'files') {
      return (files[field.key]?.length ?? 0) > 0;
    }

    if (field.type === 'tags') {
      return getTagsValue(field.key).length > 0;
    }

    return getStringValue(field.key).trim().length > 0;
  };

  const canGenerate = template.fields.every((field) => isFieldFilled(field));

  const buildPrompt = (templateInputs: Record<string, string | string[]>) => {
    const lines: string[] = [template.title];

    template.fields.forEach((field) => {
      const value = templateInputs[field.key];
      if (!value) return;
      if (Array.isArray(value) && value.length === 0) return;
      if (typeof value === 'string' && value.trim().length === 0) return;

      const serialized = Array.isArray(value) ? value.join(', ') : value;
      lines.push(`${field.label}: ${serialized}`);
    });

    return lines.join('\n');
  };

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

      const templateInputs: Record<string, string | string[]> = {};

      template.fields.forEach((field) => {
        if (field.type === 'file') {
          const single = uploadedByField[field.key]?.[0];
          if (single) templateInputs[field.key] = single;
          return;
        }

        if (field.type === 'files') {
          const many = uploadedByField[field.key] ?? [];
          if (many.length > 0) templateInputs[field.key] = many;
          return;
        }

        if (field.type === 'tags') {
          const tags = getTagsValue(field.key);
          if (tags.length > 0) templateInputs[field.key] = tags;
          return;
        }

        const textValue = getStringValue(field.key).trim();
        if (textValue) templateInputs[field.key] = textValue;
      });

      const allReferenceUrls = Object.values(uploadedByField).flat();
      const prompt = buildPrompt(templateInputs);
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
        onSetTagInput={(value) => {
          setTagInput((prev) => ({ ...prev, [field.key]: value }));
        }}
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
