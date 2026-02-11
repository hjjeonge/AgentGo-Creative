import type React from "react";

interface Props {
  handleWorkHistory: () => void;
}

export const HistoryPanel: React.FC<Props> = ({ handleWorkHistory }: Props) => {
  return (
    <aside className="w-[280px] bg-amber-100 relative shrink-0">
      <button onClick={handleWorkHistory} className="absolute top-4 right-4">
        닫기
      </button>
    </aside>
  );
};
