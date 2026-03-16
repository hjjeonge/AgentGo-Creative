import type React from 'react';
import { useNavigate } from 'react-router-dom';
import type { FavoriteTemplateRes } from '@/features/template/types';

interface Props {
  template: FavoriteTemplateRes;
}

export const Template: React.FC<Props> = ({ template }: Props) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/template?template=${template.id}`)}
      className="flex flex-col justify-between p-[20px] w-[190px] h-[190px] rounded-[14px] border border-[#1447E6] bg-[#EFF6FF] shadow-sm text-[#0F172B] text-left"
    >
      <div className="w-[50px] h-[50px] flex items-center justify-center text-[40px]">
        {template.imgUrl}
      </div>
      <div className="text-[14px] leading-[19.88px] font-bold">
        {template.title}
      </div>
      <div className="text-[12px] leading-[18px]">{template.summary}</div>
    </button>
  );
};
