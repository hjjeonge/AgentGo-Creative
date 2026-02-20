import type React from "react";
import { useState } from "react";
import { HistoryPanel } from "../components/editor/HistoryPanel";
import { Aside } from "../components/editor/Aside";
import { Canvas } from "../components/editor/Canvas";

export const EditorPage: React.FC = () => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);

  const handleWorkHistory = () => {
    setIsHistoryOpen((prev) => !prev);
  };

  return (
    <div className="h-full w-full flex relative">
      <Aside />
      <Canvas />
      <HistoryPanel
        handleWorkHistory={handleWorkHistory}
        historyOpen={isHistoryOpen}
      />
    </div>
  );
};
