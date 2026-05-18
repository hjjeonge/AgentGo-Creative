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
    <section className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-white px-8 pt-3">
      {header}
      {stage}
      <div className="flex shrink-0 items-center justify-center py-4">
        {prompt}
      </div>
    </section>
  );
};
