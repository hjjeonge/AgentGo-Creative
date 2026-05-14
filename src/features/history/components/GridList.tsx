import type React from 'react';

import { GridItem } from './GridItem';

import type { ImageGenerationHistoryItem } from '../api/type';

interface GridListProps {
  list: ImageGenerationHistoryItem[];
  onRemove: (item: ImageGenerationHistoryItem) => void;
  onSelect: (item: ImageGenerationHistoryItem) => void;
}

export const GridList: React.FC<GridListProps> = ({
  list,
  onRemove,
  onSelect,
}: GridListProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {list.map((el) => (
        <GridItem
          key={el.id}
          item={el}
          onRemove={() => onRemove(el)}
          onSelect={() => onSelect(el)}
        />
      ))}
    </div>
  );
};
