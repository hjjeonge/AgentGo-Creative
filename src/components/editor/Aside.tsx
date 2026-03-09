import type React from 'react';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import New from './../../assets/file-new-line.svg';
import Upload from './../../assets/upload-cloud-2-line.svg';
import AI from './../../assets/ai.svg';
import Home from './../../assets/home.svg';
import { useState } from 'react';
import { AiToolPanel } from './AiToolPanel';
import type { TextObject } from './EditorCanvas';
import { TextIcon } from '../icons/TextIcon';
import { TextEditor } from './TextEditor';

interface Props {
  hasImage: boolean;
  onUpload: (url: string) => void;
  onNewProject: () => void;
  onAddText?: () => void;
  selectedTextObject?: TextObject;
  handleUpdateTextObject?: (id: string, updates: Partial<TextObject>) => void;
}

export const Aside: React.FC<Props> = ({
  hasImage,
  onUpload,
  onNewProject,
  onAddText,
  selectedTextObject,
  handleUpdateTextObject,
}) => {
  const navigate = useNavigate();
  const [aiClick, setAiClick] = useState(false);
  const [textClick, setTextClick] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAiTool = () => {
    setTextClick(false);
    setAiClick((prev) => !prev);
  };

  const handleTextTool = () => {
    onAddText?.();
    setAiClick(false);
    setTextClick(true);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onUpload(url);
    e.target.value = '';
  };

  return (
    <>
      <aside className="relative flex flex-col justify-between p-[14px_7px] w-[85px] bg-white shrink-0 shadow-[8px_0_8px_-6px_rgba(50,56,62,0.08),12px_0_12px_-6px_rgba(50,56,62,0.08)]">
        <div className="flex flex-col gap-[34px]">
          <button
            onClick={onNewProject}
            className="flex flex-col gap-[4px] items-center hover:opacity-70"
          >
            <img src={New} className="w-[30px] h-[30px]" />
            <span className="text-[#0F172B] text-[13px] leading-[19.88px]">
              새프로젝트
            </span>
          </button>
          <button
            onClick={handleUploadClick}
            className="flex flex-col gap-[4px] items-center hover:opacity-70"
          >
            <img src={Upload} className="w-[30px] h-[30px]" />
            <span className="text-[#0F172B] text-[13px] leading-[19.88px]">
              업로드
            </span>
          </button>
          <button
            className="flex flex-col gap-[4px] items-center hover:opacity-70"
            onClick={handleAiTool}
          >
            <img src={AI} className="w-[30px] h-[30px]" />
            <span className="text-[#0F172B] text-[13px] leading-[19.88px]">
              AI 도구
            </span>
          </button>
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
        <button
          onClick={() => navigate('/')}
          className="flex flex-col gap-[4px] items-center hover:opacity-70"
        >
          <img src={Home} className="w-[30px] h-[30px]" />
          <span className="text-[#0F172B] text-[13px] leading-[19.88px]">
            홈으로
          </span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </aside>
      {aiClick && (
        <div className="absolute left-[85px] top-0 bottom-0 z-[60] w-fit bg-white border-l border-r border-[#E2E8F0] shadow-[8px_0_8px_-6px_rgba(50,56,62,0.08),12px_0_12px_-6px_rgba(50,56,62,0.08)]">
          <AiToolPanel hasImage={hasImage} />
        </div>
      )}
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
