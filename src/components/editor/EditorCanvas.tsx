import type React from "react";
import { Stage, Layer, Line, Rect, Transformer } from "react-konva";

// EditorPage.tsx에서 이동된 타입 정의
export interface DrawLine {
  points: number[];
  tool: string;
  strokeWidth: number;
  stroke: string;
}

export interface Shape {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
}

// 캔버스 컴포넌트가 받을 props 정의
interface EditorCanvasProps {
  stageSize: { width: number; height: number };
  handleMouseDown: (e: any) => void;
  handleMouseMove: (e: any) => void;
  handleMouseUp: (e: any) => void;
  lines: DrawLine[];
  currentLine: DrawLine | null;
  shapes: Shape[];
  setSelectedShapeId: (id: string | null) => void;
  shapeRefs: React.MutableRefObject<Record<string, any>>;
  trRef: React.MutableRefObject<any>;
  handleTransformEnd: (e: any) => void;
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  stageSize,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  lines,
  currentLine,
  shapes,
  setSelectedShapeId,
  shapeRefs,
  trRef,
  handleTransformEnd,
}) => {
  return (
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
        {shapes.map((shape) => {
          if (shape.type === "square") {
            return (
              <Rect
                key={shape.id}
                x={shape.x}
                y={shape.y}
                width={shape.width}
                height={shape.height}
                fill={shape.fill}
                draggable
                onClick={() => setSelectedShapeId(shape.id)}
                onTap={() => setSelectedShapeId(shape.id)}
                ref={(node) => {
                  if (node) {
                    shapeRefs.current[shape.id] = node;
                  }
                }}
                onTransformEnd={handleTransformEnd}
              />
            );
          }
          return null;
        })}
        <Transformer
          ref={trRef}
          rotateEnabled={true}
          keepRatio={true}
          enabledAnchors={[
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
          ]}
        />
      </Layer>
    </Stage>
  );
};
