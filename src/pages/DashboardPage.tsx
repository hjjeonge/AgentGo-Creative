import type React from 'react';


import ai from '@/assets/ai.svg';
import logo from '@/assets/logo.svg';
import { Button } from '@/commons/components/Button';
import { TemplateList } from '@/features/dashboard/components/TemplateList';

export const DashboardPage: React.FC = () => {
  return (
    <div
      className="h-full flex flex-col gap-22.5 px-30 py-22.5"
      style={{
        background: `
      radial-gradient(100% 120% at 50% -20%, rgba(86,157,255,0.15) 0%, rgba(0,85,233,0.08) 30%, rgba(0,85,233,0) 60%),
      radial-gradient(80% 80% at 80% 80%, rgba(106,20,217,0.12) 0%, rgba(0,203,200,0.08) 40%, rgba(0,203,200,0) 70%),
      linear-gradient(180deg, #FFF 0%, rgba(240,245,255,0.6) 25%, rgba(227,238,255,0.7) 50%, rgba(217,230,255,0.5) 75%, #FFF 100%)
    `,
      }}
    >
      <div className="flex flex-col gap-8 items-center justify-center">
        <div className="text-3xl font-bold text-text-primary">
          <div className="flex items-center gap-2">
            <img src={logo} className="h-8" />로
          </div>
          AI Designer가 되어보세요.
        </div>
        <Button
          variant="primary-solid"
          size="md"
          startDecorator={<img src={ai} className="w-5.5 h-5.5" />}
        >
          이미지 생성
        </Button>
      </div>
      <TemplateList />
    </div>
  );
};
