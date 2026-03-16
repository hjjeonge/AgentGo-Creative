import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import Close from '@/assets/close-line.svg';
import type { PromptGeneratePayload } from '@/features/editor/types';

interface Props {
  onGenerate?: (payload: PromptGeneratePayload) => Promise<void>;
  isSubmitting?: boolean;
}

type PreviewImage = {
  file: File;
  url: string;
};

const MAX_IMAGES = 10;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const Prompt: React.FC<Props> = ({
  onGenerate,
  isSubmitting = false,
}) => {
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState<PreviewImage[]>([]);

  const imagesRef = useRef(images);
  imagesRef.current = images;

  const canSend = prompt.trim().length > 0 && !isSubmitting;
  const isMaxImages = images.length >= MAX_IMAGES;

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || isMaxImages) return;

    const files = Array.from(fileList);

    if (files.some((file) => !ALLOWED_IMAGE_TYPES.includes(file.type))) {
      return alert(
        'jpg, jpeg, png, webp, gif 이미지 파일만 업로드 가능합니다.',
      );
    }

    const availableCount = MAX_IMAGES - images.length;
    if (files.length > availableCount) {
      alert(`레퍼런스 이미지는 최대 ${MAX_IMAGES}장까지 업로드할 수 있습니다.`);
    }

    const newImages = files.slice(0, availableCount).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleRemoveImage = (index: number) => {
    URL.revokeObjectURL(images[index].url);
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

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
      images.forEach((img) => URL.revokeObjectURL(img.url));
      setPrompt('');
      setImages([]);
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

  // 4. 올바른 언마운트 클린업 (최신 이미지를 바라보는 ref 사용)
  useEffect(() => {
    return () => {
      imagesRef.current.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, []);

  const previewSize = images.length <= 1 ? 100 : 55;

  return (
    <div className="z-[40] w-full max-w-[768px] bg-white border border-[#155DFC] rounded-[8px] p-[10px_8px] flex flex-col gap-[12px] mb-[20px]">
      {images.length > 0 && (
        <div className="flex items-center gap-[8px] flex-wrap">
          {images.map((img, index) => (
            <div
              key={`${img.url}-${index}`}
              className="relative rounded-[8px] overflow-hidden"
              style={{ width: previewSize, height: previewSize }}
            >
              <img
                src={img.url}
                className="w-full h-full object-cover"
                alt="preview"
              />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-[4px] right-[4px] w-[16px] h-[16px] bg-black/60 rounded-full flex items-center justify-center"
              >
                <img src={Close} className="w-[10px] h-[10px]" alt="close" />
              </button>
            </div>
          ))}
        </div>
      )}
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
              className={`text-[12px] leading-[19.88px] rounded-[4px] border px-[10px] py-[4px] transition-colors ${
                isMaxImages
                  ? 'text-[#90A1B9] border-[#CAD5E2] cursor-not-allowed'
                  : 'text-[#0F172B] border-[#CAD5E2] hover:bg-[#F8FAFF] cursor-pointer'
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
                {images.length}/10
              </span>
            )}
          </div>
          <button
            onClick={handleSend}
            disabled={!canSend}
            className={`w-[32px] h-[32px] rounded-[4px] flex items-center justify-center transition-colors ${
              canSend
                ? 'bg-[#155DFC] hover:bg-[#0044CC]'
                : 'bg-[#90A1B9] cursor-not-allowed'
            }`}
          >
            <span className="text-white text-[16px] leading-none">
              {isSubmitting ? '…' : '↑'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
