import type React from 'react';

import { Aside } from '@/features/editor/components/Aside';
import { Canvas } from '@/features/editor/components/Canvas';
import { HistoryPanel } from '@/features/editor/components/HistoryPanel';
import { useEditorPage } from '@/features/editor/hooks/useEditorPage';

export const EditorPage: React.FC = () => {
  const {
    breadcrumbLabel,
    breadcrumbPath,
    canvasRef,
    handleAddText,
    handleGenerate,
    handleRestore,
    handleUpdateTextObject,
    handleUpload,
    handleWorkHistory,
    history,
    isGenerating,
    isHistoryOpen,
    selectedTextObject,
    setSelectedTextObject,
  } = useEditorPage();

  return (
    <div className="h-full w-full flex relative">
      <Aside
        onAddText={handleAddText}
        selectedTextObject={selectedTextObject}
        handleUpdateTextObject={handleUpdateTextObject}
      />
      <Canvas
        ref={canvasRef}
        onGenerate={handleGenerate}
        onUploadImage={handleUpload}
        breadcrumbLabel={breadcrumbLabel}
        breadcrumbPath={breadcrumbPath}
        onSelectedTextObjectChange={setSelectedTextObject}
        isGenerating={isGenerating}
      />
      <HistoryPanel
        handleWorkHistory={handleWorkHistory}
        historyOpen={isHistoryOpen}
        history={history}
        onRestore={handleRestore}
      />
    </div>
  );
};
