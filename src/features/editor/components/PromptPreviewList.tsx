import type React from 'react';
import { Trash2 } from 'lucide-react';

import { IconButton } from '@/commons/components/IconButton';

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
    <div className="flex items-center gap-1 flex-wrap">
      {images.map((image, index) => (
        <div
          key={`${image.url}-${index}`}
          className="group relative rounded-[8px] overflow-hidden"
          style={{ width: previewSize, height: previewSize }}
        >
          <img
            src={image.url}
            className="w-full h-full object-cover"
            alt="preview"
          />
          <IconButton
            variant="neutral-outlined"
            onClick={() => onRemoveImage(index)}
            className="absolute top-[4px] right-[4px] opacity-0 transition-opacity group-hover:opacity-100"
          >
            <Trash2 size={18} />
          </IconButton>
        </div>
      ))}
    </div>
  );
};
