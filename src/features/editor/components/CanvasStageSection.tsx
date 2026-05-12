import { useRef } from 'react';
import type React from 'react';

import { Button } from '@/commons/components/Button';
import { UploadCloudIcon } from '@/commons/components/icons/UploadCloudIcon';
import {
  TOOLBAR_ALLOWED_IMAGE_TYPES,
  TOOLBAR_UPLOAD_ERROR_MESSAGE,
} from '@/features/editor/constants/toolbar';

interface BrushPreview {
  x: number;
  y: number;
  size: number;
  visible: boolean;
}

interface CanvasStageSectionProps {
  brushPreview: BrushPreview;
  children: React.ReactNode;
  hasBaseImage: boolean;
  onUploadImage?: (url: string) => void;
  stageContainerRef: React.RefObject<HTMLDivElement | null>;
  stageSize: { width: number; height: number };
  toolbar?: React.ReactNode;
}

export const CanvasStageSection: React.FC<CanvasStageSectionProps> = ({
  brushPreview,
  children,
  hasBaseImage,
  onUploadImage,
  stageContainerRef,
  stageSize,
  toolbar,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    onUploadImage?.(url);
    e.target.value = '';
  };

  return (
    <>
      {hasBaseImage ? (
        <div className="relative flex w-full min-h-0 flex-1 items-center justify-center overflow-hidden rounded-md border border-[#E2E8F0] bg-[#F8FAFC] shadow-[0_2px_4px_0px_rgba(50,56,62,0.08)]">
          {toolbar ? (
            <div className="absolute left-1/2 top-4 z-20 -translate-x-1/2">
              {toolbar}
            </div>
          ) : null}
          <div
            ref={stageContainerRef}
            className="relative shrink-0 mb-[20px] mt-[84px]"
            style={{
              width: `${stageSize.width}px`,
              height: `${stageSize.height}px`,
            }}
          >
            {brushPreview.visible && (
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: brushPreview.x - brushPreview.size / 2,
                  top: brushPreview.y - brushPreview.size / 2,
                  width: brushPreview.size,
                  height: brushPreview.size,
                  borderRadius: '50%',
                  border: '1.5px solid rgba(21,93,252,0.9)',
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.8)',
                  pointerEvents: 'none',
                  zIndex: 5,
                }}
              />
            )}
            {children}
          </div>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 select-none flex-col items-center justify-center gap-4 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] text-[#E2E8F0]">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
          <UploadCloudIcon />
          <Button onClick={() => fileInputRef.current?.click()}>
            사진 업로드
          </Button>
        </div>
      )}
    </>
  );
};
