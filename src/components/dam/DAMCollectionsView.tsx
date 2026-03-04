import type React from "react";
import { useMemo } from "react";
import type { DAMFile } from "./DAMData";

interface Props {
  collectionName: string;
  files: DAMFile[];
  shareUrl: string | null;
  onGenerateShareLink: () => void;
}

export const DAMCollectionsView: React.FC<Props> = ({ collectionName, files, shareUrl, onGenerateShareLink }: Props) => {
  const assetCountText = useMemo(() => `${files.length} assets`, [files.length]);

  return (
    <div className="px-[24px] py-[14px] border-b border-[#E2E8F0] bg-[#F8FAFC]">
      <div className="flex items-center justify-between gap-[14px]">
        <div>
          <p className="text-[14px] font-semibold text-[#0F172B]">{collectionName}</p>
          <p className="text-[12px] text-[#64748B] mt-[2px]">{assetCountText}</p>
        </div>
        <div className="flex items-center gap-[8px]">
          <button
            onClick={onGenerateShareLink}
            className="px-[12px] py-[7px] border border-[#155DFC] text-[#155DFC] text-[12px] font-medium rounded-[8px] hover:bg-[#EFF6FF]"
          >
            공유 링크 생성
          </button>
          {shareUrl && (
            <div className="px-[10px] py-[7px] bg-white border border-[#E2E8F0] rounded-[8px] text-[12px] text-[#475569] max-w-[300px] truncate">
              {shareUrl}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
