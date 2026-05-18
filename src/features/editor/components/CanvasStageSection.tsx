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
  isGenerating?: boolean;
  onUploadImage?: (url: string) => void;
  stageContainerRef: React.RefObject<HTMLDivElement | null>;
  toolbar?: React.ReactNode;
}

const generatingOverlay = (
  <div className="absolute inset-0 z-30 flex items-center justify-center bg-white">
    <div className="flex h-full w-full items-center justify-center rounded-[2px] bg-[linear-gradient(180deg,#FFCECC_0%,#B9D5FD_100%)]">
      <div className="rounded-[32px] bg-[#45556C80] px-12 py-4 text-sm text-white">
        생성 중...
      </div>
    </div>
  </div>
);

export const CanvasStageSection: React.FC<CanvasStageSectionProps> = ({
  brushPreview,
  children,
  hasBaseImage,
  isGenerating = false,
  onUploadImage,
  stageContainerRef,
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
      <div className="relative flex w-full min-h-0 flex-1 overflow-hidden rounded-md border border-[#E2E8F0] bg-[#F8FAFC] shadow-[0_2px_4px_0px_rgba(50,56,62,0.08)]">
        {toolbar ? (
          <div className="absolute left-1/2 top-4 z-20 -translate-x-1/2">
            {toolbar}
          </div>
        ) : null}
        <div
          ref={stageContainerRef}
          className="relative h-full w-full overflow-hidden rounded-sm border border-[#CBD5E1] bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
        >
          {brushPreview.visible && !isGenerating && (
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
          {!hasBaseImage ? (
            <div className="absolute inset-0 z-10 flex select-none flex-col items-center justify-center gap-4 bg-white/88 text-[#94A3B8]">
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
          ) : null}
          {isGenerating ? generatingOverlay : null}
        </div>
      </div>
    </>
  );
};
