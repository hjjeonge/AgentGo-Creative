import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Stage, Layer, Line, Rect } from "react-konva";
import { Toolbar } from "../components/editor/Toolbar";
import { HistoryPanel } from "../components/editor/HistoryPanel";

interface DrawLine {
  points: number[];
  tool: string;
  strokeWidth: number;
  stroke: string;
}

export const EditorPage: React.FC = () => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [activeTool, setActiveTool] = useState<string>("mouse");
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

  const [lines, setLines] = useState<DrawLine[]>([]);
  const [currentLine, setCurrentLine] = useState<DrawLine | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const [penStrokeWidth, setPenStrokeWidth] = useState(2);
  const [penStrokeColor, setPenStrokeColor] = useState("#E7000B");

  const handleWorkHistory = () => {
    setIsHistoryOpen((prev) => !prev);
  };

  const handleToolChange = (tool: string) => {
    setActiveTool(tool);
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
        />

        {/* Konva 캔버스 컨테이너 */}
        <div ref={containerRef} className="flex-1 h-full w-full bg-white">
          <Stage
            width={stageSize.width}
            height={stageSize.height}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <Layer>
              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke={line.stroke}
                  strokeWidth={line.strokeWidth}
                  tension={0.5}
                  lineCap="round"
                  globalCompositeOperation={
                    line.tool === "eraser" ? "destination-out" : "source-over"
                  }
                />
              ))}
              {currentLine && (
                <Line
                  points={currentLine.points}
                  stroke={currentLine.stroke}
                  strokeWidth={currentLine.strokeWidth}
                  tension={0.5}
                  lineCap="round"
                  globalCompositeOperation={
                    currentLine.tool === "eraser"
                      ? "destination-out"
                      : "source-over"
                  }
                />
              )}
            </Layer>
          </Stage>
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
