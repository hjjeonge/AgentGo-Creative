import type React from 'react';
import type { DAMFile } from './DAMData';

interface Props {
  files: DAMFile[];
  isOpen: boolean;
  onToggle: () => void;
}

export const DAMCreativePanel: React.FC<Props> = ({
  files,
  isOpen,
  onToggle,
}: Props) => {
  const previewFiles = files.slice(0, 8);

  return (
    <aside
      className={`shrink-0 border-l border-[#E2E8F0] bg-white transition-all ${isOpen ? 'w-[260px]' : 'w-[44px]'}`}
    >
      <div className="h-full flex flex-col">
        <div className="p-[8px] border-b border-[#E2E8F0] flex items-center justify-between">
          {isOpen && (
            <span className="text-[12px] font-semibold text-[#475569]">
              Creative Panel
            </span>
          )}
          <button
            onClick={onToggle}
            className="w-[28px] h-[28px] rounded-[6px] hover:bg-[#F1F5F9] text-[#64748B] text-[12px]"
          >
            {isOpen ? '>' : '<'}
          </button>
        </div>
        {isOpen && (
          <div className="p-[10px] overflow-y-auto flex-1">
            <p className="text-[11px] text-[#94A3B8] mb-[8px]">
              Drag assets to creative app
            </p>
            <div className="grid grid-cols-2 gap-[8px]">
              {previewFiles.map((file) => (
                <div
                  key={file.id}
                  draggable
                  onDragStart={(e) =>
                    e.dataTransfer.setData(
                      'text/plain',
                      JSON.stringify({ id: file.id, name: file.name }),
                    )
                  }
                  className="border border-[#E2E8F0] rounded-[8px] p-[6px] bg-[#F8FAFC] cursor-grab active:cursor-grabbing"
                >
                  <div className="aspect-square rounded-[6px] bg-white border border-[#E2E8F0] overflow-hidden flex items-center justify-center">
                    {file.thumbnail ? (
                      <img
                        src={file.thumbnail}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-[#94A3B8]">
                        No preview
                      </span>
                    )}
                  </div>
                  <p className="mt-[6px] text-[11px] text-[#475569] truncate">
                    {file.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
