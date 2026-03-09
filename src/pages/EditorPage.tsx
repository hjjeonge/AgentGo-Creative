import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Aside } from '../components/editor/Aside';
import { Canvas } from '../components/editor/Canvas';
import type { TextObject } from '../components/editor/EditorCanvas';
import { HistoryPanel } from '../components/editor/HistoryPanel';
import { getProjectDetail, getProjectHistory } from '../services/project/api';
import type { HistoryItemRes } from '../services/project/type';
import type { CanvasHandle } from '../types/editor';

const MAX_HISTORY = 20;

export const EditorPage: React.FC = () => {
  const location = useLocation();
  const { projectId = '' } = useParams();
  const searchParams = new URLSearchParams(location.search);
  const breadcrumbLabel = searchParams.get('templateName');
  const breadcrumbPath = searchParams.get('templatePath');
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [history, setHistory] = useState<HistoryItemRes[]>([]);
  const [hasCanvasImage, setHasCanvasImage] = useState(false);
  const [selectedTextObject, setSelectedTextObject] = useState<
    TextObject | undefined
  >(undefined);
  const canvasRef = useRef<CanvasHandle>(null);
  const lastImageRef = useRef<string | null>(null);

  useEffect(() => {
    // 프로젝트 상세 조회
    getProjectDetail(projectId)
      .then((res) => {
        console.log('project id is ', projectId, ', detail res is ', res);
        const snapshot = res.data.snapshot;
        if (snapshot) {
          canvasRef.current?.restoreSnapshot(snapshot);
          setHasCanvasImage(snapshot.backgroundImage !== null);
        }
      })
      .catch((err) => console.error('get project detail error ', err));

    // 작업이력 조회
    getProjectHistory(projectId)
      .then((res) => {
        setHistory(res.data);
        console.log('history res :', res.data);
      })
      .catch((err) => console.error('get history list error ', err));
  }, []);

  const handleWorkHistory = () => {
    setIsHistoryOpen((prev) => !prev);
  };

  const handleUpload = (url: string) => {
    canvasRef.current?.setBackgroundImage(url);
    setHasCanvasImage(true);
  };

  const handleNewProject = () => {
    const confirmed = window.confirm(
      '현재 작업을 종료하고 새 프로젝트를 시작하시겠습니까?',
    );
    if (!confirmed) return;
    canvasRef.current?.clearCanvas();
    setHasCanvasImage(false);
    setHistory([]);
  };

  const handleAddText = () => {
    canvasRef.current?.addText();
  };

  const handleUpdateTextObject = (id: string, updates: Partial<TextObject>) => {
    canvasRef.current?.updateTextObject(id, updates);
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
    const timestamp = now.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const newEntry: HistoryItemRes = {
      id: `history_${Date.now()}`,
      title: prompt.length > 20 ? prompt.slice(0, 20) + '…' : prompt,
      timestamp,
      snapshot,
    };

    setHistory((prev) => [newEntry, ...prev]);
  };

  const handleGenerate = (prompt: string) => {
    addHistoryEntry(prompt);
  };

  useEffect(() => {
    const imageUrl = searchParams.get('image');
    const prompt = searchParams.get('prompt') || '생성 중';
    if (imageUrl && imageUrl !== lastImageRef.current) {
      lastImageRef.current = imageUrl;
      canvasRef.current?.clearCanvas();
      canvasRef.current?.setBackgroundImage(imageUrl);
      setHasCanvasImage(true);
      addHistoryEntry(prompt);
    }
  }, [location.search]);

  const handleRestore = (entry: HistoryItemRes) => {
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
        onAddText={handleAddText}
        selectedTextObject={selectedTextObject}
        handleUpdateTextObject={handleUpdateTextObject}
      />
      <Canvas
        ref={canvasRef}
        onGenerate={handleGenerate}
        breadcrumbLabel={breadcrumbLabel}
        breadcrumbPath={breadcrumbPath}
        onSelectedTextObjectChange={setSelectedTextObject}
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
