import type React from 'react';
import { Trash2 } from 'lucide-react';

import { IconButton } from '@/commons/components/IconButton';

import type { ImageGenerationHistoryItem } from '../api/type';

interface GridItemProps {
  item: ImageGenerationHistoryItem;
  onRemove?: () => void;
}

export const GridItem: React.FC<GridItemProps> = ({
  item,
  onRemove,
}: GridItemProps) => {
  return (
    <div className="flex flex-col gap-3.5 rounded-md border border-border-neutral relative group overflow-hidden">
      <img src={item.thumbnailUrl} className="w-full h-[214px] object-cover" />
      <div className="flex flex-col gap-1.5 p-4 pt-0">
        <span className="text-text-primary font-bold text-md">
          {item.title}
        </span>
        <div className="flex items-center justify-between text-[#314158] text-xs">
          <span>{item.updatedAt}</span>
          <span>{item.lastModifiedBy}</span>
        </div>
      </div>
      <IconButton
        variant="neutral-outlined"
        className="absolute opacity-0 group-hover:opacity-100 top-2 right-2"
        onClick={onRemove}
      >
        <Trash2 size={18} />
      </IconButton>
    </div>
  );
};
