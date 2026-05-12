import type React from 'react';

import Close from '@/assets/close-line.svg';

interface PromptPreviewListProps {
  images: { url: string }[];
  onRemoveImage: (index: number) => void;
  previewSize: number;
}

export const PromptPreviewList: React.FC<PromptPreviewListProps> = ({
  images,
  onRemoveImage,
  previewSize,
}) => {
  if (images.length === 0) return null;

  return (
    <div className="flex items-center gap-[8px] flex-wrap">
      {images.map((image, index) => (
        <div
          key={`${image.url}-${index}`}
          className="relative rounded-[8px] overflow-hidden"
          style={{ width: previewSize, height: previewSize }}
        >
          <img
            src={image.url}
            className="w-full h-full object-cover"
            alt="preview"
          />
          <button
            onClick={() => onRemoveImage(index)}
            className="absolute top-[4px] right-[4px] w-[16px] h-[16px] bg-black/60 rounded-full flex items-center justify-center"
          >
            <img src={Close} className="w-[10px] h-[10px]" alt="close" />
          </button>
        </div>
      ))}
    </div>
  );
};
