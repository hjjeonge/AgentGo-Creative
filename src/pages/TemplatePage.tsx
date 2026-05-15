import { useMemo } from 'react';
import type React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Button } from '@/commons/components/Button';
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from '@/features/project/queries';
import { TemplateFieldsSection } from '@/features/template/components/TemplateFieldsSection';
import { DEFAULT_TEMPLATE_KEY } from '@/features/template/constants/templateConfig';
import { useTemplateForm } from '@/features/template/hooks/useTemplateForm';
import { useTemplateGenerate } from '@/features/template/hooks/useTemplateGenerate';
import { getTemplateConfig } from '@/features/template/utils/getTemplateConfig';

export const TemplatePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const templateKey = searchParams.get('template') ?? DEFAULT_TEMPLATE_KEY;
  const template = useMemo(() => getTemplateConfig(templateKey), [templateKey]);
  const { mutateAsync: createProject, isPending: isCreatingProject } =
    useCreateProjectMutation();
  const { mutateAsync: updateProject } = useUpdateProjectMutation();

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
    const projectRes = await createProject();
    const projectId = projectRes.projectId;

    await updateProject({
      projectId,
      data: {
        title: 'new Project',
        snapshot: {
          backgroundImage: result.imageUrl ?? null,
          elements: [],
        },
        thumbnail_url: result.imageUrl,
      },
    });

    navigate(
      `/editor/${projectId}?templateName=${encodeURIComponent(
        template.title,
      )}&templatePath=${encodeURIComponent(`/template?template=${template.key}`)}`,
    );
  };

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="mx-auto w-full max-w-[992px] bg-white">
        {/* BreadCrumb */}
        <div className="flex items-center gap-4 mt-3">
          <button
            onClick={() => navigate('/')}
            className="border border-border-neutral rounded-xs flex items-center justify-center p-2"
          >
            <ArrowLeft />
          </button>
          <div className="flex items-center gap-1 text-sm text-[#1D293D]">
            <span className="text-[#62748E]">홈</span>
            <span>/</span>
            <span>{template.title}</span>
          </div>
        </div>

        {/* Template Fields */}
        <div className="border border-border-neutral rounded-sm flex flex-col mt-4 mb-6">
          <div className="font-bold text-text-primary text-lg border-b border-border-neutral px-6 py-4">
            {template.title} 템플릿 시작
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
        </div>
        {errorMessage && (
          <div className="mt-[24px] rounded-[8px] border border-[#FCA5A5] bg-[#FEF2F2] px-[14px] py-[10px] text-[13px] text-[#991B1B]">
            {errorMessage}
          </div>
        )}

        {/* Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleGenerate}
            disabled={!canGenerate || isSubmitting || isCreatingProject}
          >
            {isSubmitting || isCreatingProject ? '생성 중...' : '이미지 생성'}
          </Button>
        </div>
      </div>
    </div>
  );
};
