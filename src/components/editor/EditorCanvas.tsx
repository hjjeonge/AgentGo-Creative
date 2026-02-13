import React, { useRef, useEffect } from "react";
import { Stage, Layer, Line, Rect, Transformer, Text } from "react-konva";

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

export interface TextObject {
  id: string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fill: string;
}

interface EditorCanvasProps {
  stageSize: { width: number; height: number };
  handleMouseDown: (e: any) => void;
  handleMouseMove: (e: any) => void;
  handleMouseUp: (e: any) => void;
  lines: DrawLine[];
  currentLine: DrawLine | null;
  shapes: Shape[];
  texts: TextObject[];
  setSelectedId: (id: string | null) => void;
  objectRefs: React.MutableRefObject<Record<string, any>>;
  trRef: React.MutableRefObject<any>;
  handleTransformEnd: (e: any) => void;
  editingTextId: string | null;
  setEditingTextId: (id: string | null) => void;
  handleTextChange: (id: string, newText: string) => void;
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  stageSize,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  lines,
  currentLine,
  shapes,
  texts,
  setSelectedId,
  objectRefs,
  trRef,
  handleTransformEnd,
  editingTextId,
  setEditingTextId,
  handleTextChange,
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editingTextId && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [editingTextId]);

  const handleTextDblClick = (e: any, text: TextObject) => {
    setSelectedId(null);
    setEditingTextId(text.id);
  };

  const finishEditing = () => {
    const textId = editingTextId;
    setEditingTextId(null);
    if (textId) {
      setSelectedId(textId);
    }
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" || e.key === "Escape") {
      finishEditing();
    }
  };

  const editingText = texts.find((t) => t.id === editingTextId);
  const stageRef = useRef<any>(null);

  return (
    <div style={{ position: "relative" }}>
      <Stage
        ref={stageRef}
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
          {shapes.map((shape) => (
            <Rect
              key={shape.id}
              id={shape.id}
              x={shape.x}
              y={shape.y}
              width={shape.width}
              height={shape.height}
              fill={shape.fill}
              draggable
              onClick={() => setSelectedId(shape.id)}
              onTap={() => setSelectedId(shape.id)}
              ref={(node) => {
                if (node) objectRefs.current[shape.id] = node;
              }}
              onTransformEnd={handleTransformEnd}
            />
          ))}
          {texts.map((text) => (
            <Text
              key={text.id}
              id={text.id}
              x={text.x}
              y={text.y}
              text={text.text}
              fontSize={text.fontSize}
              fill={text.fill}
              draggable
              visible={text.id !== editingTextId}
              onClick={() => setSelectedId(text.id)}
              onTap={() => setSelectedId(text.id)}
              onDblClick={(e) => handleTextDblClick(e, text)}
              onDblTap={(e) => handleTextDblClick(e, text)}
              ref={(node) => {
                if (node) objectRefs.current[text.id] = node;
              }}
              onTransformEnd={handleTransformEnd}
            />
          ))}
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
      {editingText && (
        <textarea
          ref={textAreaRef}
          value={editingText.text}
          onChange={(e) => handleTextChange(editingText.id, e.target.value)}
          onKeyDown={handleTextareaKeyDown}
          onBlur={finishEditing}
          style={{
            position: "absolute",
            top: `${editingText.y}px`,
            left: `${editingText.x}px`,
            width: `${objectRefs.current[editingText.id]?.width()}px`,
            height: `${objectRefs.current[editingText.id]?.height()}px`,
            fontSize: `${editingText.fontSize}px`,
            color: editingText.fill,
            border: "1px solid #000",
            background: "none",
            resize: "none",
            overflow: "hidden",
            lineHeight: 1.2,
            fontFamily: "sans-serif",
          }}
        />
      )}
    </div>
  );
};
