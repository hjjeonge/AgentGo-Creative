import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Stage, Layer, Line, Rect } from "react-konva";
import { Toolbar } from "../components/editor/Toolbar";
import { HistoryPanel } from "../components/editor/HistoryPanel";

export const EditorPage: React.FC = () => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [activeTool, setActiveTool] = useState<string>("mouse");
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

  const [lines, setLines] = useState<any[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const handleWorkHistory = () => {
    setIsHistoryOpen((prev) => !prev);
  };

  const handleToolChange = (tool: string) => {
    setActiveTool(tool);
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
    if (activeTool !== "pen") {
      return;
    }
    setIsDrawing(true);
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { points: [pos.x, pos.y], tool: activeTool }]);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing || activeTool !== "pen") return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    setLines((prevLines) => {
      const lastLine = prevLines[prevLines.length - 1];
      const updatedLine = {
        ...lastLine,
        points: [...lastLine.points, point.x, point.y],
      };

      return [...prevLines.slice(0, -1), updatedLine];
    });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  return (
    <div className="h-full w-full flex relative">
      <aside className="w-[85px] bg-amber-100 shrink-0"></aside>

      {/* 캔버스 영역 */}
      <section className="h-full flex-1 min-w-0 bg-[#E2E8F0] relative flex flex-col items-center">
        {/* 툴바 */}
        <Toolbar activeTool={activeTool} onToolChange={handleToolChange} />

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
                  stroke="#df4b26"
                  strokeWidth={5}
                  tension={0.5}
                  lineCap="round"
                  globalCompositeOperation={
                    line.tool === "eraser" ? "destination-out" : "source-over"
                  }
                />
              ))}
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
