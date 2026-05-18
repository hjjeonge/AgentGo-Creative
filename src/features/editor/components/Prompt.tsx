import type React from 'react';
import { useRef, useState } from 'react';
import { ArrowUp, Paperclip } from 'lucide-react';

import { Button } from '@/commons/components/Button';
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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
    e.target.style.height = `${Math.min(e.target.scrollHeight, 96)}px`;
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
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
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
    <div className="z-[40] flex max-h-[190px] w-full max-w-[768px] flex-col overflow-hidden rounded-[8px] border border-[#155DFC] bg-white px-2.5 py-2 shadow-[0_20px_24px_-4px_rgba(50,56,62,0.08)]">
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
        <PromptPreviewList
          images={images}
          onRemoveImage={handleRemoveImage}
          previewSize={previewSize}
        />
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={handlePromptChange}
          onKeyDown={handleKeyDown}
          placeholder="무엇이든 물어보고 만들어보세요."
          disabled={isSubmitting}
          className="min-h-6 w-full resize-none overflow-y-auto text-md text-text-primary outline-none"
          rows={1}
        />
      </div>
      <div className="mt-3 flex shrink-0 items-center justify-between">
        <div className="flex items-center gap-[6px]">
          <input
            ref={fileInputRef}
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
          <Button
            variant="neutral-outlined"
            size="sm"
            startDecorator={<Paperclip size={18} />}
            disabled={isMaxImages || isSubmitting}
            onClick={() => fileInputRef.current?.click()}
          >
            레퍼런스 첨부
          </Button>
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
  );
};
