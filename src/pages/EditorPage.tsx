import type React from 'react';

import { Canvas } from '@/features/editor/components/Canvas';
import { HistoryPanel } from '@/features/editor/components/HistoryPanel';
import { useEditorPage } from '@/features/editor/hooks/useEditorPage';

export const EditorPage: React.FC = () => {
  const {
    breadcrumbLabel,
    breadcrumbPath,
    backPath,
    canvasRef,
    handleChangeImage,
    handleGenerate,
    handleRestore,
    handleUpload,
    handleWorkHistory,
    history,
    isGenerating,
    isHistoryOpen,
  } = useEditorPage();

  return (
    <div className="relative flex h-full w-full min-h-0 overflow-hidden">
      <Canvas
        ref={canvasRef}
        onGenerate={handleGenerate}
        onChangeImage={handleChangeImage}
        onUploadImage={handleUpload}
        breadcrumbLabel={breadcrumbLabel}
        breadcrumbPath={breadcrumbPath}
        backPath={backPath}
        isGenerating={isGenerating}
      />
      <HistoryPanel
        handleWorkHistory={handleWorkHistory}
        historyOpen={isHistoryOpen}
        history={history}
        onRestore={handleRestore}
      />
      {isGenerating ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[60] cursor-wait bg-transparent"
        />
      ) : null}
    </div>
  );
};
