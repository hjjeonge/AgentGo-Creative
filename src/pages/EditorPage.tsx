import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Toolbar } from "../components/editor/Toolbar";
import { HistoryPanel } from "../components/editor/HistoryPanel";
import {
  EditorCanvas,
  type DrawLine,
  type Shape,
  type TextObject,
} from "../components/editor/EditorCanvas";
import { loadGoogleFont } from "../utils/fontLoader";

export const EditorPage: React.FC = () => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [activeTool, setActiveTool] = useState<string>("mouse");
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

  const [lines, setLines] = useState<DrawLine[]>([]);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [texts, setTexts] = useState<TextObject[]>([]);
  const [currentLine, setCurrentLine] = useState<DrawLine | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [shapeType, setShapeType] = useState("square");

  const [penStrokeWidth, setPenStrokeWidth] = useState(2);
  const [penStrokeColor, setPenStrokeColor] = useState("#E7000B");

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const objectRefs = useRef<Record<string, any>>({});
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (trRef.current) {
      if (selectedId && !editingTextId) {
        const node = objectRefs.current[selectedId];
        if (node) {
          trRef.current.nodes([node]);
        }
      } else {
        trRef.current.nodes([]);
      }
      trRef.current.getLayer()?.batchDraw();
    }
  }, [selectedId, shapes, texts, editingTextId]);

  const handleWorkHistory = () => {
    setIsHistoryOpen((prev) => !prev);
  };

  const handleAddText = () => {
    const defaultFont = "Noto Sans KR";
    loadGoogleFont(defaultFont); // Ensure the default font is loaded

    const newText: TextObject = {
      id: `text_${texts.length}`,
      text: "텍스트를 입력하세요",
      x: 150,
      y: 150,
      fontSize: 24,
      fill: "#000000",
      fontFamily: defaultFont,
    };
    setTexts((prev) => [...prev, newText]);
    // Immediately select the newly added text
    setSelectedId(newText.id);
    setActiveTool("mouse");
  };

  const handleToolChange = (tool: string) => {
    if (tool === "text") {
      handleAddText();
      return;
    }
    setActiveTool(tool);
    setSelectedId(null);
    setEditingTextId(null);
  };

  const handleUpdateTextObject = (id: string, updates: Partial<TextObject>) => {
    setTexts((prev) =>
      prev.map((text) => (text.id === id ? { ...text, ...updates } : text)),
    );
  };

  const handlePenStrokeWidth = (value: number) => {
    setPenStrokeWidth(value);
  };

  const handlePenStrokeColor = (value: string) => {
    setPenStrokeColor(value);
  };

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [isHistoryOpen]);

  const handleMouseDown = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
      setEditingTextId(null);
    }

    if (activeTool !== "pen" && activeTool !== "eraser") {
      return;
    }

    setIsDrawing(true);
    const pos = e.target.getStage().getPointerPosition();
    setCurrentLine({
      points: [pos.x, pos.y],
      tool: activeTool,
      strokeWidth: penStrokeWidth,
      stroke: penStrokeColor,
    });
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing || (activeTool !== "pen" && activeTool !== "eraser")) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    setCurrentLine((prev) =>
      prev
        ? {
            ...prev,
            points: [...prev.points, point.x, point.y],
          }
        : null,
    );
  };

  const handleMouseUp = () => {
    if (!currentLine) return;

    setLines((prev) => [...prev, currentLine]);
    setCurrentLine(null);
    setIsDrawing(false);
  };

  const handleAddShape = (shapeType: string) => {
    setShapeType(shapeType);
    if (shapeType === "square") {
      const newSquare: Shape = {
        id: `shape_${shapes.length}`,
        type: "square",
        x: 100,
        y: 100,
        width: 50,
        height: 50,
        fill: "red",
      };
      setShapes((prev) => [...prev, newSquare]);
    }
  };

  const handleTransformEnd = (e: any) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const id = node.id();

    node.scaleX(1);
    node.scaleY(1);

    setTexts((prev) =>
      prev.map((text) =>
        text.id === id
          ? {
              ...text,
              x: node.x(),
              y: node.y(),
              fontSize: Math.max(5, text.fontSize * scaleY),
            }
          : text,
      ),
    );

    setShapes((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              x: node.x(),
              y: node.y(),
              width: Math.max(5, s.width * scaleX),
              height: Math.max(5, s.height * scaleY),
            }
          : s,
      ),
    );
  };

  // Determine if a text object is selected to show TextEditor
  const isTextSelected = selectedId?.startsWith('text_') && !editingTextId;
  const selectedTextObject = isTextSelected ? texts.find(t => t.id === selectedId) : undefined;

  return (
    <div className="h-full w-full flex relative">
      <aside className="w-[85px] bg-amber-100 shrink-0"></aside>

      {/* 캔버스 영역 */}
      <section className="h-full flex-1 min-w-0 bg-[#E2E8F0] relative flex flex-col items-center">
        {/* 툴바 */}
        <Toolbar
          activeTool={activeTool}
          onToolChange={handleToolChange}
          penStrokeWidth={penStrokeWidth}
          handlePenStrokeWidth={handlePenStrokeWidth}
          penStrokeColor={penStrokeColor}
          handlePenStrokeColor={handlePenStrokeColor}
          shapeType={shapeType}
          setShapeType={handleAddShape}
          isTextEditorVisible={!!isTextSelected}
          selectedTextObject={selectedTextObject}
          handleUpdateTextObject={handleUpdateTextObject}
        />

        {/* Konva 캔버스 컨테이너 */}
        <div ref={containerRef} className="flex-1 h-full w-full bg-white">
          <EditorCanvas
            stageSize={stageSize}
            handleMouseDown={handleMouseDown}
            handleMouseMove={handleMouseMove}
            handleMouseUp={handleMouseUp}
            lines={lines}
            currentLine={currentLine}
            shapes={shapes}
            texts={texts}
            setSelectedId={setSelectedId}
            objectRefs={objectRefs}
            trRef={trRef}
            handleTransformEnd={handleTransformEnd}
            editingTextId={editingTextId}
            setEditingTextId={setEditingTextId}
            handleUpdateTextObject={handleUpdateTextObject}
          />
        </div>
        {/* 접혔을 때 보이는 버튼 */}
        {!isHistoryOpen && (
          <button
            onClick={handleWorkHistory}
            className="absolute right-0 top-1/2 -translate-y-1/2 
                       w-[32px] h-[80px] bg-white shadow-md 
                       rounded-l-md flex items-center justify-center"
          >
            &lt;
          </button>
        )}
      </section>

      {isHistoryOpen && <HistoryPanel handleWorkHistory={handleWorkHistory} />}
    </div>
  );
};
