import type React from 'react';
import dayjs from 'dayjs';
import { Trash2 } from 'lucide-react';

import { IconButton } from '@/commons/components/IconButton';
import { partitionCanvasElements } from '@/features/editor/utils/elementAdapters';
import type { HistoryItemRes } from '@/features/project/types';
import { resolveImageUrl } from '@/features/template/utils/resolveImageUrl';

interface Props {
  entry: HistoryItemRes;
  onClick: (entry: HistoryItemRes) => void;
}

export const HistoryItem: React.FC<Props> = ({ entry, onClick }) => {
  const uploadedImageShape = partitionCanvasElements(
    'elements' in entry.snapshot && Array.isArray(entry.snapshot.elements)
      ? entry.snapshot.elements
      : [],
  ).shapes.find((shape) => shape.type === 'uploaded_image' && shape.imageUrl);
  const previewUrl = resolveImageUrl(
    entry.snapshot.backgroundImage || uploadedImageShape?.imageUrl,
  );

  return (
    <div className="flex items-center justify-between border-b border-border-neutral pb-2">
      <button
        type="button"
        onClick={() => onClick(entry)}
        className="flex min-w-0 flex-1 items-center gap-1 text-left"
      >
        <img src={previewUrl ?? ''} className="w-10 h-10 rounded-xs" />
        <div className="flex flex-col gap-0.5 text-text-primary font-sm">
          <span>{entry.title}</span>
          <span className="text-[#314158] text-sm">
            {dayjs(entry.timestamp).format('YYYY년MM월DD일 hh:mm:ss')}
          </span>
        </div>
      </button>
      <IconButton variant="neutral-outlined">
        <Trash2 size={16} />
      </IconButton>
    </div>
  );
};
