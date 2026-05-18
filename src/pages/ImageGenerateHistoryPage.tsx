import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { IconButton } from '@/commons/components/IconButton';
import { GridIcon } from '@/commons/components/icons/GridIcon';
import { ListIcon } from '@/commons/components/icons/ListIcon';
import type { ImageGenerationHistoryItem } from '@/features/history/api/type';
import { DeletePopup } from '@/features/history/components/DeletePopup';
import { GridList } from '@/features/history/components/GridList';
import { Pagination } from '@/features/history/components/Pagination';
import { Table } from '@/features/history/components/Table';
import { imageGenerationHistoryMock } from '@/features/history/constants/mock';

export const ImageGenerateHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [viewType, setViewType] = useState<'grid' | 'table'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedHistoryItem, setSelectedHistoryItem] =
    useState<ImageGenerationHistoryItem | null>(null);

  const handleViewType = (value: 'grid' | 'table') => {
    setViewType(value);
    setCurrentPage(1);
  };

  const handleOpenDeletePopup = (item: ImageGenerationHistoryItem) => {
    setSelectedHistoryItem(item);
  };

  const handleCloseDeletePopup = () => {
    setSelectedHistoryItem(null);
  };

  const pageSize = viewType === 'grid' ? 12 : 10;
  const totalPages = Math.max(
    1,
    Math.ceil(imageGenerationHistoryMock.length / pageSize),
  );
  const pageStartIndex = (currentPage - 1) * pageSize;
  const paginatedHistoryList = imageGenerationHistoryMock.slice(
    pageStartIndex,
    pageStartIndex + pageSize,
  );

  const handleMoveFirstPage = () => {
    setCurrentPage(1);
  };

  const handleMovePage = (page: number) => {
    setCurrentPage(page);
  };

  const handleMovePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(1, prevPage - 1));
  };

  const handleMoveNextPage = () => {
    setCurrentPage((prevPage) => Math.min(totalPages, prevPage + 1));
  };

  const handleMoveLastPage = () => {
    setCurrentPage(totalPages);
  };

  const handleSelectHistoryItem = (item: ImageGenerationHistoryItem) => {
    navigate(`/history/${item.projectId}/edit?historyId=${item.id}`);
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
            list={paginatedHistoryList}
            onRemove={handleOpenDeletePopup}
            onSelect={handleSelectHistoryItem}
          />
        ) : (
          <Table
            list={paginatedHistoryList}
            onRemove={handleOpenDeletePopup}
            onSelect={handleSelectHistoryItem}
          />
        )}
      </div>
      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onMovePage={handleMovePage}
          onMoveFirstPage={handleMoveFirstPage}
          onMovePreviousPage={handleMovePreviousPage}
          onMoveNextPage={handleMoveNextPage}
          onMoveLastPage={handleMoveLastPage}
        />
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
