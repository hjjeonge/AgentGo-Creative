import type React from 'react';
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { Button } from '@/commons/components/Button';
import { IconButton } from '@/commons/components/IconButton';

interface Props {
  currentPage: number;
  totalPages: number;
  onMovePage: (page: number) => void;
  onMoveFirstPage: () => void;
  onMovePreviousPage: () => void;
  onMoveNextPage: () => void;
  onMoveLastPage: () => void;
}

export const Pagination: React.FC<Props> = ({
  currentPage,
  totalPages,
  onMovePage,
  onMoveFirstPage,
  onMovePreviousPage,
  onMoveNextPage,
  onMoveLastPage,
}: Props) => {
  const maxVisiblePageCount = 10;
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;
  const pageGroupIndex = Math.floor((currentPage - 1) / maxVisiblePageCount);
  const startPage = pageGroupIndex * maxVisiblePageCount + 1;
  const endPage = Math.min(startPage + maxVisiblePageCount - 1, totalPages);
  const visiblePages = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index,
  );

  return (
    <div className="flex items-center justify-end">
      <IconButton
        variant="primary-plain"
        onClick={onMoveFirstPage}
        disabled={isFirstPage}
        className="text-[#45556C]!"
      >
        <ChevronFirst />
      </IconButton>
      <IconButton
        variant="primary-plain"
        onClick={onMovePreviousPage}
        disabled={isFirstPage}
        className="text-[#45556C]!"
      >
        <ChevronLeft />
      </IconButton>
      {visiblePages.map((page) => {
        const isSelected = page === currentPage;

        return (
          <Button
            key={page}
            variant="primary-plain"
            className={`min-w-[32px] px-2! ${isSelected ? 'text-[#155DFC]!' : 'text-text-primary!'}`}
            onClick={() => onMovePage(page)}
          >
            {page}
          </Button>
        );
      })}
      <IconButton
        variant="primary-plain"
        onClick={onMoveNextPage}
        disabled={isLastPage}
        className="text-[#45556C]!"
      >
        <ChevronRight />
      </IconButton>
      <IconButton
        variant="primary-plain"
        onClick={onMoveLastPage}
        disabled={isLastPage}
        className="text-[#45556C]!"
      >
        <ChevronLast />
      </IconButton>
    </div>
  );
};
