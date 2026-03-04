import type React from "react";
import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { HistoryPanel } from "../components/editor/HistoryPanel";
import { Aside } from "../components/editor/Aside";
import { Canvas } from "../components/editor/Canvas";
import type { CanvasHandle, HistoryEntry } from "../types/editor";

const MAX_HISTORY = 20;

export const EditorPage: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const breadcrumbLabel = params.get("templateName");
  const breadcrumbPath = params.get("templatePath");
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [hasCanvasImage, setHasCanvasImage] = useState(false);
  const canvasRef = useRef<CanvasHandle>(null);
  const lastImageRef = useRef<string | null>(null);

  const handleWorkHistory = () => {
    setIsHistoryOpen((prev) => !prev);
  };

  const handleUpload = (url: string) => {
    canvasRef.current?.setBackgroundImage(url);
    setHasCanvasImage(true);
  };

  const handleNewProject = () => {
    const confirmed = window.confirm(
      "현재 작업을 종료하고 새 프로젝트를 시작하시겠습니까?",
    );
    if (!confirmed) return;
    canvasRef.current?.clearCanvas();
    setHasCanvasImage(false);
  };

  const addHistoryEntry = (prompt: string) => {
    if (history.length >= MAX_HISTORY) {
      alert(
        `작업이력이 최대 ${MAX_HISTORY}개에 도달했습니다.\n기존 이력을 삭제 후 다시 시도해 주세요.`,
      );
      return;
    }

    const snapshot = canvasRef.current?.getSnapshot();
    if (!snapshot) return;

    const now = new Date();
    const timestamp = now.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const newEntry: HistoryEntry = {
      id: `history_${Date.now()}`,
      title: prompt.length > 20 ? prompt.slice(0, 20) + "…" : prompt,
      timestamp,
      snapshot,
    };

    setHistory((prev) => [newEntry, ...prev]);
  };

  const handleGenerate = (prompt: string) => {
    addHistoryEntry(prompt);
  };

  useEffect(() => {
    const imageUrl = params.get("image");
    const prompt = params.get("prompt") || "생성 중";
    if (imageUrl && imageUrl !== lastImageRef.current) {
      lastImageRef.current = imageUrl;
      canvasRef.current?.clearCanvas();
      canvasRef.current?.setBackgroundImage(imageUrl);
      setHasCanvasImage(true);
      addHistoryEntry(prompt);
    }
  }, [location.search]);

  const handleRestore = (entry: HistoryEntry) => {
    const confirmed = window.confirm(
      `"${entry.title}" 작업으로 돌아가시겠습니까?\n현재 작업 내용은 사라집니다.`,
    );
    if (!confirmed) return;
    canvasRef.current?.restoreSnapshot(entry.snapshot);
    setHasCanvasImage(entry.snapshot.backgroundImage !== null);
  };

  return (
    <div className="h-full w-full flex relative">
      <Aside
        hasImage={hasCanvasImage}
        onUpload={handleUpload}
        onNewProject={handleNewProject}
      />
      <Canvas
        ref={canvasRef}
        onGenerate={handleGenerate}
        breadcrumbLabel={breadcrumbLabel}
        breadcrumbPath={breadcrumbPath}
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
