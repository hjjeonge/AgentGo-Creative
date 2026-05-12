import type React from 'react';

interface CanvasLayoutProps {
  header: React.ReactNode;
  prompt: React.ReactNode;
  stage: React.ReactNode;
}

export const CanvasLayout: React.FC<CanvasLayoutProps> = ({
  header,
  prompt,
  stage,
}) => {
  return (
    <section className="h-full flex-1 min-w-0 bg-white relative flex flex-col px-8 pt-3">
      {header}
      {stage}
      <div className="flex items-center justify-center h-30">{prompt}</div>
    </section>
  );
};
