import type React from "react";
import { useEffect, useRef } from "react";

export interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  fileId: string | null;
}

interface Props {
  menu: ContextMenuState;
  onClose: () => void;
  onAction: (action: string, fileId: string) => void;
}

const MENU_ITEMS = [
  { label: "상세정보", action: "detail" },
  { label: "다운로드", action: "download" },
  { label: "이름 바꾸기", action: "rename" },
  { label: "복사하기", action: "copy" },
  { label: "삭제하기", action: "delete" },
];

export const DAMContextMenu: React.FC<Props> = ({ menu, onClose, onAction }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  if (!menu.visible || !menu.fileId) return null;

  return (
    <div
      ref={ref}
      style={{ top: menu.y, left: menu.x }}
      className="fixed z-[100] bg-white border border-[#E2E8F0] rounded-[8px] shadow-lg py-[4px] min-w-[120px]"
    >
      {MENU_ITEMS.map((item) => (
        <button
          key={item.action}
          onClick={() => {
            onAction(item.action, menu.fileId!);
            onClose();
          }}
          className={`w-full text-left px-[16px] py-[8px] text-[14px] hover:bg-[#F1F5F9] ${
            item.action === "delete" ? "text-[#E11D48]" : "text-[#0F172B]"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};