import type React from 'react';
import { Trash2 } from 'lucide-react';

import { Button } from '@/commons/components/Button';

import type { ImageGenerationHistoryItem } from '../api/type';

interface TableProps {
  list: ImageGenerationHistoryItem[];
  onRemove: (item: ImageGenerationHistoryItem) => void;
}

export const Table: React.FC<TableProps> = ({ list, onRemove }: TableProps) => {
  return (
    <table className="border border-border-neutral w-full">
      <thead>
        <tr className="border-b border-border-neutral rounded-t-xs text-left font-bold text-text-secondary font-sm bg-[#F1F5F9]">
          <th className="px-2 py-2.5">이미지 이름</th>
          <th className="px-2 py-2.5">템플릿</th>
          <th className="px-2 py-2.5">생성 일시</th>
          <th className="px-2 py-2.5">수정 일시</th>
          <th className="px-2 py-2.5">만든 사람</th>
          <th className="px-2 py-2.5" />
        </tr>
      </thead>
      <tbody>
        {list.map((el) => (
          <tr
            key={el.id}
            className="border border-border-neutral text-[#1D293D]"
          >
            <td className="px-2 py-1.5">{el.title}</td>
            <td className="px-2 py-1.5">{el.templateName ?? '--'}</td>
            <td className="px-2 py-1.5">{el.createdAt}</td>
            <td className="px-2 py-1.5">{el.updatedAt ?? '--'}</td>
            <td className="px-2 py-1.5">{el.lastModifiedBy}</td>
            <td className="px-2 py-1.5">
              <Button
                variant="neutral-outlined"
                startDecorator={<Trash2 size={18} />}
                onClick={() => onRemove(el)}
              >
                삭제
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
