import type React from 'react';
import { useState } from 'react';

import { TextIcon } from '@/commons/components/icons/TextIcon';
import type { TextObject } from '@/features/editor/types';

import { TextEditor } from './TextEditor';

interface Props {
  onAddText?: () => void;
  selectedTextObject?: TextObject;
  handleUpdateTextObject?: (id: string, updates: Partial<TextObject>) => void;
}

export const Aside: React.FC<Props> = ({
  onAddText,
  selectedTextObject,
  handleUpdateTextObject,
}) => {
  const [textClick, setTextClick] = useState(false);

  const handleTextTool = () => {
    onAddText?.();
    setTextClick(true);
  };

  return (
    <>
      <aside className="relative flex flex-col justify-between p-[14px_7px] w-[85px] bg-white shrink-0 shadow-[8px_0_8px_-6px_rgba(50,56,62,0.08),12px_0_12px_-6px_rgba(50,56,62,0.08)]">
        <div className="flex flex-col gap-[34px]">
          <button
            className="flex flex-col gap-[4px] items-center hover:opacity-70"
            onClick={handleTextTool}
          >
            <TextIcon />
            <span className="text-[#0F172B] text-[13px] leading-[19.88px]">
              텍스트
            </span>
          </button>
        </div>
      </aside>

      {textClick && selectedTextObject && handleUpdateTextObject && (
        <div className="absolute left-[85px] top-0 bottom-0 z-[60] w-fit bg-white border-l border-r border-[#E2E8F0] shadow-[8px_0_8px_-6px_rgba(50,56,62,0.08),12px_0_12px_-6px_rgba(50,56,62,0.08)]">
          <TextEditor
            selectedTextObject={selectedTextObject}
            handleUpdateTextObject={handleUpdateTextObject}
          />
        </div>
      )}
    </>
  );
};
