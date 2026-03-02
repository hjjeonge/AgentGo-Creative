import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import UploadIcon from "../assets/upload-cloud-2-line.svg";
import CloseIcon from "../assets/close-line.svg";
import AddIcon from "../assets/add.svg";
import { FormRow } from "../components/template/FormRow";
import { SizePreviewIcon } from "../components/template/SizePreviewIcon";
import { getImageJob, generateImage } from "../services/images";
import { uploadFile } from "../services/files";
import {
  DEFAULT_TEMPLATE_KEY,
  TARGET_KEYWORDS,
  getTemplateConfig,
  type TemplateField,
} from "../constants/templateConfigs";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const resolveImageUrl = (url: string | null | undefined) => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_BASE_URL}${url}`;
};

type FormValues = Record<string, string | string[]>;
type FormFiles = Record<string, File[]>;

const buildInitialValues = (fields: TemplateField[]): FormValues => {
  return fields.reduce<FormValues>((acc, field) => {
    acc[field.key] = field.type === "tags" ? [] : "";
    return acc;
  }, {});
};

export const TemplatePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const templateKey = searchParams.get("template") ?? DEFAULT_TEMPLATE_KEY;
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
    return typeof value === "string" ? value : "";
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
    setTagInput((prev) => ({ ...prev, [field.key]: "" }));
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

    if (field.type === "file" || field.type === "files") {
      return (files[field.key]?.length ?? 0) > 0;
    }

    if (field.type === "tags") {
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
      if (typeof value === "string" && value.trim().length === 0) return;

      const serialized = Array.isArray(value) ? value.join(", ") : value;
      lines.push(`${field.label}: ${serialized}`);
    });

    return lines.join("\n");
  };

  const handleGenerate = async () => {
    if (!canGenerate || isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const uploadedByField: Record<string, string[]> = {};

      for (const field of template.fields) {
        if (field.type !== "file" && field.type !== "files") continue;

        const selectedFiles = files[field.key] ?? [];
        if (!selectedFiles.length) continue;

        const urls = await Promise.all(
          selectedFiles.map(async (file) => {
            const uploaded = await uploadFile(file);
            return uploaded.file_url;
          })
        );
        uploadedByField[field.key] = urls;
      }

      const templateInputs: Record<string, string | string[]> = {};

      template.fields.forEach((field) => {
        if (field.type === "file") {
          const single = uploadedByField[field.key]?.[0];
          if (single) templateInputs[field.key] = single;
          return;
        }

        if (field.type === "files") {
          const many = uploadedByField[field.key] ?? [];
          if (many.length > 0) templateInputs[field.key] = many;
          return;
        }

        if (field.type === "tags") {
          const tags = getTagsValue(field.key);
          if (tags.length > 0) templateInputs[field.key] = tags;
          return;
        }

        const textValue = getStringValue(field.key).trim();
        if (textValue) templateInputs[field.key] = textValue;
      });

      const allReferenceUrls = Object.values(uploadedByField).flat();
      const prompt = buildPrompt(templateInputs);
      const sizeValue = getStringValue("size") || undefined;
      const targets = getTagsValue("target_audience");

      const res = await generateImage({
        prompt,
        concept: getStringValue("concept") || undefined,
        size: sizeValue,
        targets: targets.length > 0 ? targets : undefined,
        reference_urls: allReferenceUrls,
        template_key: template.key,
        template_name: template.title,
        template_inputs: templateInputs,
      });

      let job = res;
      if (job.status !== "completed") {
        const maxAttempts = 30;
        for (let i = 0; i < maxAttempts; i++) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          job = await getImageJob(res.job_id);
          if (job.status === "completed" || job.status === "failed") break;
        }
      }

      if (job.status === "completed" && job.result_url) {
        const imageUrl = resolveImageUrl(job.result_url);
        if (imageUrl) {
          navigate(
            `/editor?image=${encodeURIComponent(imageUrl)}&prompt=${encodeURIComponent(
              prompt
            )}&templateName=${encodeURIComponent(
              template.title
            )}&templatePath=${encodeURIComponent(`/template?template=${template.key}`)}`
          );
          return;
        }
      }

      if (job.status === "failed") {
        setErrorMessage("이미지 생성에 실패했습니다.");
        return;
      }

      setErrorMessage("이미지 생성 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "이미지 생성 요청에 실패했습니다.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: TemplateField) => {
    if (field.type === "file" || field.type === "files") {
      const inputId = `file-input-${field.key}`;
      const selectedFiles = files[field.key] ?? [];
      const isMulti = field.type === "files";

      return (
        <FormRow key={field.key} label={field.label} required={field.required}>
          <input
            id={inputId}
            type="file"
            accept="image/*"
            multiple={isMulti}
            className="hidden"
            onChange={(event) => {
              const nextFiles = Array.from(event.target.files ?? []);
              if (!nextFiles.length) return;

              if (isMulti) handleMultiFiles(field.key, nextFiles);
              else handleSingleFile(field.key, nextFiles[0] ?? null);

              event.target.value = "";
            }}
          />
          <div className="flex items-center gap-[8px] flex-wrap">
            {selectedFiles.map((file, index) => (
              <span
                key={`${file.name}-${index}`}
                className="flex items-center gap-[6px] text-[14px] text-[#0F172B]"
              >
                {file.name}
                <button onClick={() => removeFile(field.key, index)}>
                  <img src={CloseIcon} className="w-[14px] h-[14px]" />
                </button>
              </span>
            ))}
            <label
              htmlFor={inputId}
              className="border border-dashed border-[#CBD5E1] px-[14px] py-[7px] rounded-[8px] flex items-center gap-[6px] text-[13px] text-[#475569] cursor-pointer"
            >
              <img src={UploadIcon} className="w-[14px] h-[14px]" />
              {isMulti ? "파일 선택" : "업로드"}
            </label>
          </div>
        </FormRow>
      );
    }

    if (field.type === "tags") {
      const selectedTags = getTagsValue(field.key);
      const maxItems = field.maxItems ?? 5;
      const currentTagInput = tagInput[field.key] ?? "";
      const showPresets = field.key.includes("audience");

      return (
        <FormRow key={field.key} label={field.label} required={field.required}>
          <div className="border border-[#CBD5E1] rounded-[8px] p-[8px_12px] flex flex-wrap gap-[6px] min-h-[48px] focus-within:border-[#155DFC]">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-[4px] bg-[#EFF6FF] border border-[#155DFC] rounded-full px-[10px] py-[3px] text-[13px] text-[#155DFC]"
              >
                {tag}
                <button onClick={() => removeTag(field.key, tag)}>
                  <img src={CloseIcon} className="w-[12px] h-[12px]" />
                </button>
              </span>
            ))}
            <input
              value={currentTagInput}
              onChange={(event) => {
                setTagInput((prev) => ({ ...prev, [field.key]: event.target.value }));
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === ";") {
                  event.preventDefault();
                  addTag(field, currentTagInput);
                }
                if (event.key === "Backspace" && !currentTagInput && selectedTags.length > 0) {
                  const lastTag = selectedTags[selectedTags.length - 1];
                  removeTag(field.key, lastTag);
                }
              }}
              placeholder={
                selectedTags.length === 0
                  ? `${field.label}을(를) 입력해 주세요 (최대 ${maxItems}개)`
                  : ""
              }
              className="flex-1 outline-none text-[14px] min-w-[180px] placeholder:text-[#94A3B8] bg-transparent"
            />
          </div>
          <button
            onClick={() => addTag(field, currentTagInput)}
            className="mt-[8px] w-full border border-dashed border-[#CBD5E1] py-[8px] rounded-[8px] text-[14px] text-[#64748B] flex items-center justify-center gap-[4px]"
          >
            <img src={AddIcon} className="w-[14px] h-[14px]" />
            직접추가
          </button>
          {showPresets && (
            <div className="mt-[12px] flex flex-wrap gap-[8px]">
              {TARGET_KEYWORDS.map((keyword) => (
                <button
                  key={keyword}
                  onClick={() => {
                    if (selectedTags.includes(keyword)) removeTag(field.key, keyword);
                    else addTag(field, keyword);
                  }}
                  className={`px-[14px] py-[5px] rounded-full border text-[13px] ${
                    selectedTags.includes(keyword)
                      ? "border-[#155DFC] text-[#155DFC] bg-[#EFF6FF]"
                      : "border-[#CBD5E1] text-[#0F172B]"
                  }`}
                >
                  {keyword}
                </button>
              ))}
            </div>
          )}
        </FormRow>
      );
    }

    if (field.type === "textarea") {
      return (
        <FormRow key={field.key} label={field.label} required={field.required}>
          <textarea
            value={getStringValue(field.key)}
            onChange={(event) => setStringValue(field.key, event.target.value)}
            placeholder={field.placeholder}
            className="w-full border border-[#CBD5E1] rounded-[8px] p-[12px] text-[14px] resize-none h-[120px] placeholder:text-[#94A3B8] outline-none focus:border-[#155DFC]"
          />
        </FormRow>
      );
    }

    if (field.type === "select") {
      return (
        <FormRow key={field.key} label={field.label} required={field.required}>
          <select
            value={getStringValue(field.key)}
            onChange={(event) => setStringValue(field.key, event.target.value)}
            className="w-full h-[44px] border border-[#CBD5E1] rounded-[8px] px-[12px] text-[14px] text-[#0F172B] outline-none focus:border-[#155DFC] bg-white"
          >
            <option value="">선택해 주세요</option>
            {(field.options ?? []).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormRow>
      );
    }

    if (field.type === "size") {
      const options = field.options ?? ["1:1", "4:5", "16:9", "9:16"];
      const selected = getStringValue(field.key);

      return (
        <FormRow key={field.key} label={field.label} required={field.required}>
          <div className="flex gap-[12px] flex-wrap">
            {options.map((size) => (
              <button
                key={size}
                onClick={() => setStringValue(field.key, size)}
                className={`w-[118px] h-[72px] border-2 border-dashed rounded-[12px] flex items-center justify-center gap-[8px] text-[14px] ${
                  selected === size
                    ? "border-[#155DFC] text-[#155DFC] bg-[#EFF6FF]"
                    : "border-[#CBD5E1] text-[#64748B]"
                }`}
              >
                <SizePreviewIcon ratio={size} active={selected === size} />
                <span>{size}</span>
              </button>
            ))}
          </div>
        </FormRow>
      );
    }

    return (
      <FormRow key={field.key} label={field.label} required={field.required}>
        <input
          value={getStringValue(field.key)}
          onChange={(event) => setStringValue(field.key, event.target.value)}
          placeholder={field.placeholder}
          className="w-full h-[44px] border border-[#CBD5E1] rounded-[8px] px-[12px] text-[14px] text-[#0F172B] placeholder:text-[#94A3B8] outline-none focus:border-[#155DFC]"
        />
      </FormRow>
    );
  };

  return (
    <div className="h-full overflow-y-auto bg-[#F1F5F9]">
      <div className="max-w-[740px] mx-auto py-[40px] px-[20px]">
        <div className="flex items-center gap-[8px] text-[14px] mb-[16px]">
          <button onClick={() => navigate("/")} className="text-[#64748B] hover:text-[#155DFC]">
            홈
          </button>
          <span className="text-[#94A3B8]">&gt;</span>
          <span className="text-[#0F172B] font-medium">{template.title}</span>
        </div>

        <div className="mb-[24px] rounded-[10px] border border-[#DBEAFE] bg-[#EFF6FF] px-[14px] py-[10px] text-[13px] text-[#1E3A8A]">
          {template.aiStatus === "available"
            ? `AI 연동 기준: ${template.aiFeature} API 입력 규격`
            : "AI 서버 미구현 템플릿입니다. 입력값은 현재 key-value 프롬프트로 조합되어 생성됩니다."}
        </div>

        <div className="flex flex-col gap-[32px]">{template.fields.map((field) => renderField(field))}</div>

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
                ? "bg-[#155DFC] text-white"
                : "bg-[#CBD5E1] text-[#94A3B8] cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "생성 중..." : "이미지 생성"}
          </button>
        </div>
      </div>
    </div>
  );
};
