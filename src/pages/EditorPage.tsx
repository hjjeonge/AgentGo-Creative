import type React from "react";
import { useState } from "react";

export const EditorPage: React.FC = () => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);

  const handleWorkHistory = () => {
    setIsHistoryOpen((prev) => !prev);
  };

  return (
    <div className="h-full flex relative">
      {/* 좌측 사이드바 */}
      <aside className="w-[85px] bg-amber-100 shrink-0"></aside>

      {/* 캔버스 영역 */}
      <section className="flex-1 bg-gray-300 relative">
        {/* 접혔을 때 보이는 버튼 */}
        {!isHistoryOpen && (
          <button
            onClick={handleWorkHistory}
            className="absolute right-0 top-1/2 -translate-y-1/2 
                       w-[32px] h-[80px] bg-white shadow-md 
                       rounded-l-md flex items-center justify-center"
          >
            &lt;
          </button>
        )}
      </section>

      {/* 작업이력 패널 */}
      {isHistoryOpen && (
        <aside className="w-[280px] bg-amber-100 relative shrink-0">
          <button
            onClick={handleWorkHistory}
            className="absolute top-4 right-4"
          >
            닫기
          </button>

          <div className="p-4 pt-12"></div>
        </aside>
      )}
    </div>
  );
};
