import type React from 'react';

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
  stageContainerRef: React.RefObject<HTMLDivElement | null>;
  stageSize: { width: number; height: number };
}

export const CanvasStageSection: React.FC<CanvasStageSectionProps> = ({
  brushPreview,
  children,
  hasBaseImage,
  stageContainerRef,
  stageSize,
}) => {
  return (
    <div className="flex-1 relative w-full shrink-0 flex items-center justify-center border border-[#E2E8F0] bg-[#F8FAFC] rounded-md shadow-[0_2px_4px_0px_rgba(50,56,62,0.08)]">
      {stageSize.width > 0 && stageSize.height > 0 && hasBaseImage ? (
        <div
          ref={stageContainerRef}
          className="relative shrink-0 m-[20px]"
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
      ) : (
        <div className="flex flex-col items-center justify-center mt-[20px] mb-[20px] gap-[8px] text-[#94A3B8] select-none rounded-[12px] border border-[#CBD5E1] bg-white h-[600px] w-[500px]">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 21V9" />
          </svg>
          <span className="text-[14px]">
            이미지를 업로드하거나 템플릿에서 생성해 주세요
          </span>
        </div>
      )}
    </div>
  );
};
