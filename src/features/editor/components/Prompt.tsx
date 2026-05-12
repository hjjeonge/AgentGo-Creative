import type React from 'react';
import { useState } from 'react';
import { ArrowUp } from 'lucide-react';

import { IconButton } from '@/commons/components/IconButton';
import { PROMPT_MAX_REFERENCE_IMAGES } from '@/features/editor/constants/prompt';
import { usePromptFiles } from '@/features/editor/hooks/usePromptFiles';
import type { PromptGeneratePayload } from '@/features/editor/types';

import { PromptPreviewList } from './PromptPreviewList';

interface Props {
  onGenerate?: (payload: PromptGeneratePayload) => Promise<void>;
  isSubmitting?: boolean;
}

export const Prompt: React.FC<Props> = ({
  onGenerate,
  isSubmitting = false,
}) => {
  const [prompt, setPrompt] = useState('');
  const {
    clearImages,
    handleFiles,
    handleRemoveImage,
    images,
    isMaxImages,
    previewSize,
  } = usePromptFiles();

  const canSend = prompt.trim().length > 0 && !isSubmitting;

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 320)}px`;
  };

  const handleSend = async () => {
    if (!canSend) return;
    if (!onGenerate) return;

    try {
      await onGenerate({
        prompt: prompt.trim(),
        referenceFiles: images.map((img) => img.file),
      });
      setPrompt('');
      clearImages();
    } catch {
      // Error state is owned by the parent generate flow.
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="z-[40] w-full max-w-[768px] bg-white border border-[#155DFC] rounded-[8px] p-[10px_8px] flex flex-col gap-[12px] shadow-[0_20px_24px_-4px_rgba(50,56,62,0.08)]">
      <PromptPreviewList
        images={images}
        onRemoveImage={handleRemoveImage}
        previewSize={previewSize}
      />
      <div className="flex flex-col gap-[16px]">
        <textarea
          value={prompt}
          onChange={handlePromptChange}
          onKeyDown={handleKeyDown}
          placeholder="AgentGo에게 물어보세요."
          disabled={isSubmitting}
          className="w-full rounded-[8px] p-[10px] text-[14px] leading-[20px] max-h-[150px] overflow-y-auto resize-none outline-none"
          rows={1}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[6px]">
            <label
              className={`text-sm rounded-xs border px-3 py-0.5 transition-colors font-bold ${
                isMaxImages
                  ? 'text-[#90A1B9] border-[#CAD5E2] cursor-not-allowed'
                  : 'text-[#1D293D] border-border-neutral hover:bg-[#F8FAFF] cursor-pointer'
              }`}
            >
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                disabled={isMaxImages || isSubmitting}
                onChange={(e) => {
                  handleFiles(e.target.files);
                  e.currentTarget.value = '';
                }}
              />
              레퍼런스 첨부
            </label>
            {!!images.length && (
              <span
                className={`text-[12px] ${
                  isMaxImages ? 'text-[#E7000B] font-medium' : 'text-[#64748B]'
                }`}
              >
                {images.length}/{PROMPT_MAX_REFERENCE_IMAGES}
              </span>
            )}
          </div>

          <IconButton onClick={handleSend} disabled={!canSend}>
            <ArrowUp size={18} />
          </IconButton>
        </div>
      </div>
    </div>
  );
};
