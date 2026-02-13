import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Toolbar } from "../components/editor/Toolbar";
import { HistoryPanel } from "../components/editor/HistoryPanel";
import {
  EditorCanvas,
  type DrawLine,
  type Shape,
} from "../components/editor/EditorCanvas";

export const EditorPage: React.FC = () => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [activeTool, setActiveTool] = useState<string>("mouse");
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

  const [lines, setLines] = useState<DrawLine[]>([]);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [currentLine, setCurrentLine] = useState<DrawLine | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [shapeType, setShapeType] = useState("square");

  const [penStrokeWidth, setPenStrokeWidth] = useState(2);
  const [penStrokeColor, setPenStrokeColor] = useState("#E7000B");

  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const shapeRefs = useRef<Record<string, any>>({});
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (trRef.current) {
      if (selectedShapeId) {
        const node = shapeRefs.current[selectedShapeId];
        if (node) {
          trRef.current.nodes([node]);
        }
      } else {
        trRef.current.nodes([]);
      }
      trRef.current.getLayer()?.batchDraw();
    }
  }, [selectedShapeId, shapes]);

  const handleWorkHistory = () => {
    setIsHistoryOpen((prev) => !prev);
  };

  const handleToolChange = (tool: string) => {
    setActiveTool(tool);
    setSelectedShapeId(null);
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
      setSelectedShapeId(null);
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

    node.scaleX(1);
    node.scaleY(1);

    setShapes((prev) =>
      prev.map((s) =>
        s.id === selectedShapeId
          ? {
              ...s,
              x: node.x(),
              y: node.y(),
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(5, node.height() * scaleY),
            }
          : s,
      ),
    );
  };

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
            setSelectedShapeId={setSelectedShapeId}
            shapeRefs={shapeRefs}
            trRef={trRef}
            handleTransformEnd={handleTransformEnd}
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
