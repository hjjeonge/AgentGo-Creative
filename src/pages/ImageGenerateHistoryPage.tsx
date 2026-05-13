import type React from 'react';
import { useState } from 'react';

import { IconButton } from '@/commons/components/IconButton';
import { GridIcon } from '@/commons/components/icons/GridIcon';
import { ListIcon } from '@/commons/components/icons/ListIcon';
import type { ImageGenerationHistoryItem } from '@/features/history/api/type';
import { DeletePopup } from '@/features/history/components/DeletePopup';
import { GridList } from '@/features/history/components/GridList';
import { Table } from '@/features/history/components/Table';
import { imageGenerationHistoryMock } from '@/features/history/constants/mock';

export const ImageGenerateHistoryPage: React.FC = () => {
  const [viewType, setViewType] = useState<'grid' | 'table'>('grid');
  const [selectedHistoryItem, setSelectedHistoryItem] =
    useState<ImageGenerationHistoryItem | null>(null);

  const handleViewType = (value: 'grid' | 'table') => {
    setViewType(value);
  };

  const handleOpenDeletePopup = (item: ImageGenerationHistoryItem) => {
    setSelectedHistoryItem(item);
  };

  const handleCloseDeletePopup = () => {
    setSelectedHistoryItem(null);
  };

  return (
    <div className="h-full bg-white p-8">
      <div className="flex justify-between items-center mb-4">
        <span className="text-text-primary text-2xl font-semibold">
          이미지 생성 기록
        </span>
        <div className="flex items-center">
          <IconButton
            variant="neutral-outlined"
            className={`rounded-r-none! ${viewType === 'grid' && 'bg-[#CAD5E2]!'}`}
            onClick={() => handleViewType('grid')}
          >
            <GridIcon />
          </IconButton>
          <IconButton
            variant="neutral-outlined"
            className={`rounded-l-none! ${viewType === 'table' && 'bg-[#CAD5E2]!'}`}
            onClick={() => handleViewType('table')}
          >
            <ListIcon />
          </IconButton>
        </div>
      </div>
      <div>
        {viewType === 'grid' ? (
          <GridList
            list={imageGenerationHistoryMock}
            onRemove={handleOpenDeletePopup}
          />
        ) : (
          <Table
            list={imageGenerationHistoryMock}
            onRemove={handleOpenDeletePopup}
          />
        )}
      </div>
      {selectedHistoryItem ? (
        <DeletePopup
          title={selectedHistoryItem.title}
          onCancel={handleCloseDeletePopup}
          onRemove={handleCloseDeletePopup}
        />
      ) : null}
    </div>
  );
};
