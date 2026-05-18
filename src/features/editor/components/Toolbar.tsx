import type React from 'react';
import { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

import { Button } from '@/commons/components/Button';
import { ColorPalette } from '@/commons/components/ColorPalette';
import { ColorPickerPopup } from '@/commons/components/ColorPickerPopup';
import { LassoIcon } from '@/commons/components/icons/LassoIcon';
import { ShapeIcon } from '@/commons/components/icons/ShapeIcon';
import { getPenColorImg, getPenStrokeWidthImg } from '@/commons/utils/getImage';
import {
  TOOLBAR_ALLOWED_IMAGE_TYPES,
  TOOLBAR_DISPLAY_COLORS,
  TOOLBAR_ITEMS,
  TOOLBAR_PEN_STROKE_WIDTHS,
  TOOLBAR_UPLOAD_ERROR_MESSAGE,
} from '@/features/editor/constants/toolbar';
import { useToolbarPopup } from '@/features/editor/hooks/useToolbarPopup';
import { useColorHistoryStore } from '@/features/editor/store/colorHistoryStore';
import type { TextObject } from '@/features/editor/types';

import { AiEffectPopover } from './AiEffectPopover';
import { DiagramPopup } from './DiagramPopup';
import { TextEditor } from './TextEditor';
import { ToolbarButton } from './ToolbarButton';
import { ToolButton } from './ToolButton';

interface Props {
  activeTool: string;
  onToolChange: (tool: string) => void;
  onUploadImage?: (url: string) => void;
  onChangeImage?: (url: string) => void;
  selectedTextObject?: TextObject;
  handleUpdateTextObject?: (id: string, updates: Partial<TextObject>) => void;
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
  onChangeImage,
  selectedTextObject,
  handleUpdateTextObject,
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
  const changeInputRef = useRef<HTMLInputElement>(null);
  const {
    colorPopupMode,
    hasPopup,
    isToolPopupOpen,
    setColorPopupMode,
    setIsToolPopupOpen,
    syncPopupState,
  } = useToolbarPopup(toolbarRef);
  const recentColors = useColorHistoryStore((state) => state.recentColors);
  const addRecentColor = useColorHistoryStore((state) => state.addRecentColor);

  useEffect(() => {
    syncPopupState(activeTool);
  }, [activeTool, syncPopupState]);

  const isTextPopupVisible =
    activeTool === 'text' && !!selectedTextObject && !!handleUpdateTextObject;

  const onClickColorOption = (value: string) => {
    if (value === 'empty') {
      setColorPopupMode('picker');
      return;
    }
    handlePenStrokeColor(value);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onSelectImage?: (url: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (
      !TOOLBAR_ALLOWED_IMAGE_TYPES.includes(
        file.type as (typeof TOOLBAR_ALLOWED_IMAGE_TYPES)[number],
      )
    ) {
      window.alert(TOOLBAR_UPLOAD_ERROR_MESSAGE);
      e.target.value = '';
      return;
    }

    const url = URL.createObjectURL(file);
    onSelectImage?.(url);
    e.target.value = '';
  };

  const handleToolClick = (tool: string) => {
    if (tool === 'upload') {
      fileInputRef.current?.click();
      return;
    }

    if (tool === 'change') {
      changeInputRef.current?.click();
      return;
    }

    if (tool === activeTool) {
      if (hasPopup(tool)) setIsToolPopupOpen(true);
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
        onChange={(e) => handleFileChange(e, onUploadImage)}
      />
      <input
        ref={changeInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFileChange(e, onChangeImage)}
      />
      <div className="flex items-center justify-center gap-2.5 px-3 py-1.5 bg-white rounded-md shadow-[0_6px_12px_-2px_rgba(50,56,62,0.08)]">
        {TOOLBAR_ITEMS.map((item) => (
          <ToolButton
            key={item.tool}
            toolName={item.tool}
            activeTool={activeTool}
            icon={<item.icon />}
            label={item.tool}
            onToolChange={onToolChange}
            onClick={() => handleToolClick(item.tool)}
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
          {TOOLBAR_PEN_STROKE_WIDTHS.map((strokeWidth) => (
            <ToolbarButton
              key={strokeWidth}
              tooltip={`${strokeWidth}px`}
              icon={getPenStrokeWidthImg(strokeWidth)}
              onClick={() => handlePenStrokeWidth(strokeWidth)}
              isActive={penStrokeWidth === strokeWidth}
              className="w-[34px] h-[34px] rounded-[6px]"
            />
          ))}
          {activeTool == 'pen' && (
            <>
              <div className="w-[2.5px] h-[25px] bg-[#45556C]" />
              {TOOLBAR_DISPLAY_COLORS.map((color) => {
                const isPresetColor = TOOLBAR_DISPLAY_COLORS.includes(
                  penStrokeColor as (typeof TOOLBAR_DISPLAY_COLORS)[number],
                );
                const isActive =
                  penStrokeColor === color ||
                  (color === 'empty' && !isPresetColor);
                return (
                  <ToolbarButton
                    key={color}
                    tooltip={color}
                    icon={getPenColorImg(color)}
                    onClick={() => onClickColorOption(color)}
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
      {isToolPopupOpen && activeTool === 'crop' && (
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
      {isTextPopupVisible && (
        <div className="absolute top-full left-1/2 z-20 mt-[7px] w-[470px] -translate-x-1/2 overflow-visible rounded-[8px] border border-border-neutral bg-[#F8FAFC] shadow-[0_6px_12px_-2px_rgba(50,56,62,0.08)]">
          <TextEditor
            selectedTextObject={selectedTextObject}
            handleUpdateTextObject={handleUpdateTextObject}
          />
        </div>
      )}
      {isToolPopupOpen && activeTool === 'diagram' && (
        <DiagramPopup shapeType={shapeType} setShapeType={setShapeType} />
      )}
    </div>
  );
};
