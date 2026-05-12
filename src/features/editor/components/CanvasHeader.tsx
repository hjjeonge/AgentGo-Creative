import type React from 'react';
import dayjs from 'dayjs';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CanvasHeaderProps {
  breadcrumbLabel?: string | null;
  breadcrumbPath?: string | null;
}

export const CanvasHeader: React.FC<CanvasHeaderProps> = ({
  breadcrumbLabel,
  breadcrumbPath,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="border border-border-neutral rounded-xs flex items-center justify-center p-2"
        >
          <ArrowLeft />
        </button>
        <div className="flex items-center gap-1 text-sm text-[#1D293D]">
          <span className="text-[#62748E]">홈</span>
          {breadcrumbLabel && breadcrumbPath ? (
            <>
              <span className="text-[#94A3B8]">&gt;</span>
              <button
                onClick={() => navigate(breadcrumbPath)}
                className="text-[#64748B] hover:text-[#155DFC]"
              >
                {breadcrumbLabel}
              </button>
            </>
          ) : null}
          <span>/</span>
          <span>Ai 이미지 생성</span>
        </div>
      </div>

      <input
        value={dayjs(new Date()).format('YY년 MM월 DD일 hh:mm')}
        className="border border-border-neutral rounded-xs px-3 py-1.5 shadow-[0_1px_2px_0px_rgba(50,56,62,0.08)] text-[#1D293D] w-fit mb-2 m-auto outline-none"
        readOnly
      />
    </>
  );
};
