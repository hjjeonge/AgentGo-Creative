import type React from 'react';

export const HistoryPage: React.FC = () => {
  return (
    <div className="h-full bg-white px-8 py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-3">
        <h1 className="text-2xl font-bold text-[#0F172A]">기록</h1>
        <p className="text-sm text-[#64748B]">
          작업 기록 페이지입니다. 상세 목록은 이후 연결 예정입니다.
        </p>
      </div>
    </div>
  );
};
