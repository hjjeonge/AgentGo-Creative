import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { Button } from '@/commons/components/Button';
import { ColorPalette } from '@/commons/components/ColorPalette';
import { ColorPickerPopup } from '@/commons/components/ColorPickerPopup';
import { ChangeIcon } from '@/commons/components/icons/ChangeIcon';
import { ClickIcon } from '@/commons/components/icons/ClickIcon';
import { CropIcon } from '@/commons/components/icons/CropIcon';
import { EraserIcon } from '@/commons/components/icons/EraserIcon';
import { LassoIcon } from '@/commons/components/icons/LassoIcon';
import { PencilIcon } from '@/commons/components/icons/PencilIcon';
import { ShapeIcon } from '@/commons/components/icons/ShapeIcon';
import { TextIcon } from '@/commons/components/icons/TextIcon';
import { UploadIcon } from '@/commons/components/icons/UploadIcon';
import { getPenColorImg, getPenStrokeWidthImg } from '@/commons/utils/getImage';
import { useColorHistoryStore } from '@/features/editor/store/colorHistoryStore';

import { AiEffectPopover } from './AiEffectPopover';
import { DiagramPopup } from './DiagramPopup';
import { ToolbarButton } from './ToolbarButton';
import { ToolButton } from './ToolButton';

interface Props {
  activeTool: string;
  onToolChange: (tool: string) => void;
  onUploadImage?: (url: string) => void;
  penStrokeWidth: number;
  handlePenStrokeWidth: (value: number) => void;
  penStrokeColor: string;
  handlePenStrokeColor: (value: string) => void;
  shapeType: string;
  setShapeType: (value: string) => void;
  shapeSelectMode: 'rect' | 'lasso';
  setShapeSelectMode: (mode: 'rect' | 'lasso') => void;
}

export const Toolbar: React.FC<Props> = ({
  activeTool,
  onToolChange,
  onUploadImage,
  penStrokeWidth,
  handlePenStrokeWidth,
  penStrokeColor,
  handlePenStrokeColor,
  shapeType,
  setShapeType,
  shapeSelectMode,
  setShapeSelectMode,
}) => {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isToolPopupOpen, setIsToolPopupOpen] = useState(false);
  const [colorPopupMode, setColorPopupMode] = useState<
    'picker' | 'palette' | null
  >(null);
  const recentColors = useColorHistoryStore((state) => state.recentColors);
  const addRecentColor = useColorHistoryStore((state) => state.addRecentColor);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!toolbarRef.current?.contains(e.target as Node)) {
        setIsToolPopupOpen(false);
        setColorPopupMode(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const hasToolPopup =
      activeTool === 'pen' ||
      activeTool === 'eraser' ||
      activeTool === 'shape' ||
      activeTool === 'diagram';

    setIsToolPopupOpen(hasToolPopup);
    if (activeTool !== 'pen') {
      setColorPopupMode(null);
    }
  }, [activeTool]);

  const tools = [
    { tool: 'mouse', icon: <ClickIcon /> },
    { tool: 'change', icon: <ChangeIcon /> },
    { tool: 'crop', icon: <CropIcon /> },
    { tool: 'text', icon: <TextIcon /> },
    { tool: 'upload', icon: <UploadIcon /> },
    { tool: 'pen', icon: <PencilIcon /> },
    { tool: 'eraser', icon: <EraserIcon /> },
  ];
  const penStrokeWidths = [2, 3, 5, 6];
  const displayColors = ['#E7000B', '#155DFC', '#FFD230', 'empty'];
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];

  const onClickColorOption = (value: string) => {
    if (value === 'empty') {
      setColorPopupMode('picker');
      return;
    }
    handlePenStrokeColor(value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!allowedImageTypes.includes(file.type)) {
      window.alert('jpg, jpeg, png, webp 파일만 업로드 가능합니다.');
      e.target.value = '';
      return;
    }

    const url = URL.createObjectURL(file);
    onUploadImage?.(url);
    e.target.value = '';
  };

  const handleToolClick = (tool: string) => {
    if (tool === 'upload') {
      fileInputRef.current?.click();
      return;
    }

    const hasPopup =
      tool === 'pen' ||
      tool === 'eraser' ||
      tool === 'shape' ||
      tool === 'diagram';

    if (tool === activeTool) {
      if (hasPopup) setIsToolPopupOpen(true);
      return;
    }

    onToolChange(tool);
  };

  return (
    <div ref={toolbarRef} className="relative flex flex-col items-center">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="flex items-center justify-center gap-2.5 px-3 py-1.5 bg-white rounded-md shadow-[0_6px_12px_-2px_rgba(50,56,62,0.08)]">
        {tools.map((el) => (
          <ToolButton
            key={el.tool}
            toolName={el.tool}
            activeTool={activeTool}
            icon={el.icon}
            label={el.tool}
            onToolChange={onToolChange}
            onClick={() => handleToolClick(el.tool)}
          />
        ))}
        <AiEffectPopover>
          <Button
            variant="neutral-outlined"
            endDecorator={<ChevronDown size={18} />}
            size="sm"
          >
            Ai 요소
          </Button>
        </AiEffectPopover>
      </div>

      {/* 하단 서브 바 - absolute 로 캔버스 영역에 영향 없이 표시 */}
      {isToolPopupOpen && (activeTool === 'pen' || activeTool === 'eraser') && (
        <div
          ref={wrapperRef}
          className="absolute top-full mt-[7px] border flex items-center gap-[12px] border-[#90A1B9] p-[8px_10px] rounded-[6px] bg-[#F1F5F9] z-20"
        >
          {penStrokeWidths.map((el) => (
            <ToolbarButton
              key={el}
              tooltip={`${el}px`}
              icon={getPenStrokeWidthImg(el)}
              onClick={() => handlePenStrokeWidth(el)}
              isActive={penStrokeWidth === el}
              className="w-[34px] h-[34px] rounded-[6px]"
            />
          ))}
          {activeTool == 'pen' && (
            <>
              <div className="w-[2.5px] h-[25px] bg-[#45556C]" />
              {displayColors.map((el) => {
                const isPresetColor = displayColors.includes(penStrokeColor);
                const isActive =
                  penStrokeColor === el || (el === 'empty' && !isPresetColor);
                return (
                  <ToolbarButton
                    key={el}
                    tooltip={el}
                    icon={getPenColorImg(el)}
                    onClick={() => onClickColorOption(el)}
                    isActive={isActive}
                    className="w-[30px] h-[30px] p-[5px] rounded-[20px]"
                  />
                );
              })}
            </>
          )}
          {colorPopupMode && (
            <div className="absolute top-full right-0 mt-[6px] z-50">
              {colorPopupMode === 'picker' ? (
                <ColorPickerPopup
                  onClose={() => setColorPopupMode(null)}
                  onOpenPalette={() => setColorPopupMode('palette')}
                  currentColor={penStrokeColor}
                  recentlyUseColorList={recentColors}
                  onSelectColor={(value) => {
                    handlePenStrokeColor(value);
                    addRecentColor(value);
                  }}
                />
              ) : (
                <ColorPalette
                  colorCode={penStrokeColor}
                  handleColorCode={(value) => {
                    handlePenStrokeColor(value);
                    addRecentColor(value);
                  }}
                  onBack={() => setColorPopupMode('picker')}
                />
              )}
            </div>
          )}
        </div>
      )}
      {isToolPopupOpen && activeTool === 'shape' && (
        <div className="absolute top-full mt-[7px] z-20 flex items-center gap-[6px] border border-[#90A1B9] p-[6px_10px] rounded-[6px] bg-[#F1F5F9]">
          <button
            onClick={() => setShapeSelectMode('rect')}
            className={`flex items-center gap-[4px] px-[8px] py-[4px] rounded-[4px] text-[13px] transition-colors ${
              shapeSelectMode === 'rect'
                ? 'bg-[#1447E6] text-white'
                : 'text-[#45556C] hover:bg-[#E2E8F0]'
            }`}
          >
            <ShapeIcon />
            정사형
          </button>
          <button
            onClick={() => setShapeSelectMode('lasso')}
            className={`flex items-center gap-[4px] px-[8px] py-[4px] rounded-[4px] text-[13px] transition-colors ${
              shapeSelectMode === 'lasso'
                ? 'bg-[#1447E6] text-white'
                : 'text-[#45556C] hover:bg-[#E2E8F0]'
            }`}
          >
            <LassoIcon />
            자유형
          </button>
        </div>
      )}
      {isToolPopupOpen && activeTool === 'diagram' && (
        <DiagramPopup shapeType={shapeType} setShapeType={setShapeType} />
      )}
    </div>
  );
};
