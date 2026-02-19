import Konva from "konva";
import React, { useEffect, useRef } from "react";
import {
  Group,
  Layer,
  Line,
  Rect,
  Stage,
  Text,
  Transformer,
} from "react-konva";

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
  width?: number;
  fontSize: number;
  fill: string;
  fontFamily?: string;
  fontStyle?: string;
  textDecoration?: string;
  align?: "left" | "center" | "right" | "justify";
  verticalAlign?: "top" | "middle" | "bottom";
  letterSpacing?: number;
  lineHeight?: number;
  scaleX?: number;
  listFormat?: "none" | "unordered" | "ordered";
  stroke?: string;
  strokeWidth?: number;
  strokeEnabled?: boolean;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOpacity?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  shadowDirection?: number;
  shadowDistance?: number;
  shadowEnabled?: boolean;
  verticalWriting?: boolean;
  backgroundColor?: string;
  backgroundEnabled?: boolean;
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
  handleUpdateTextObject: (id: string, updates: Partial<TextObject>) => void; // Changed prop
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
  handleUpdateTextObject, // Changed prop
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

  const handleTextareaKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.key === "Escape") {
      finishEditing();
    }
  };

  const editingText = texts.find((t) => t.id === editingTextId);
  const stageRef = useRef<any>(null);
  const toVerticalText = (value: string) => {
    return value
      .split("\n")
      .map((line) => line.split("").join("\n"))
      .join("\n\n");
  };

  const getListFormattedText = (text: TextObject) => {
    let baseText = text.text;
    if (text.listFormat && text.listFormat !== "none") {
      const lines = baseText.split("\n");
      if (text.listFormat === "unordered") {
        baseText = lines.map((line) => `• ${line}`).join("\n");
      } else {
        baseText = lines
          .map((line, index) => `${index + 1}. ${line}`)
          .join("\n");
      }
    }
    return baseText;
  };

  const getDisplayText = (text: TextObject) => {
    const baseText = getListFormattedText(text);
    return text.verticalWriting ? toVerticalText(baseText) : baseText;
  };

  const getNodeSize = (id: string) => {
    const node = objectRefs.current[id];
    if (!node) return { width: 0, height: 0 };
    const rect = node.getClientRect({ skipTransform: false });
    return { width: rect.width, height: rect.height };
  };

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
          {texts.map((text) => {
            const commonTextProps = {
              text: getDisplayText(text),
              width: text.width,
              fontSize: text.fontSize,
              fontFamily: text.fontFamily,
              fontStyle: text.fontStyle,
              textDecoration: text.textDecoration,
              align: text.align,
              verticalAlign: text.verticalAlign,
              letterSpacing: text.letterSpacing,
              lineHeight: text.lineHeight,
              scaleX: text.scaleX,
              stroke: text.strokeEnabled ? text.stroke : undefined,
              strokeWidth: text.strokeEnabled ? text.strokeWidth : 0,
              shadowColor: text.shadowEnabled ? text.shadowColor : undefined,
              shadowBlur: text.shadowEnabled ? text.shadowBlur : 0,
              shadowOpacity: text.shadowEnabled ? text.shadowOpacity : 0,
              shadowOffsetX: text.shadowEnabled ? text.shadowOffsetX : 0,
              shadowOffsetY: text.shadowEnabled ? text.shadowOffsetY : 0,
              fill: text.fill,
              fillAfterStrokeEnabled: true,
            };

            if (
              text.backgroundEnabled &&
              text.backgroundColor &&
              text.backgroundColor !== "transparent"
            ) {
              const displayText = getDisplayText(text);
              const lines = displayText.split("\n");

              return (
                <Group
                  key={text.id}
                  id={text.id}
                  x={text.x}
                  y={text.y}
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
                >
                  {lines.map((line, index) => {
                    const tempText = new Konva.Text({
                      text: line,
                      fontSize: text.fontSize,
                      fontFamily: text.fontFamily,
                      fontStyle: text.fontStyle,
                      textDecoration: text.textDecoration,
                      letterSpacing: text.letterSpacing,
                      lineHeight: text.lineHeight,
                    });

                    const textWidth = tempText.getTextWidth();
                    const rawTextHeight = tempText.height();
                    const rectHeight = rawTextHeight * 0.9;
                    const rectOffsetY = (rawTextHeight - rectHeight) / 2;
                    const requestedWidth = text.width;
                    const align = text.align ?? "left";
                    const maxWidth =
                      align === "left" || !requestedWidth
                        ? textWidth
                        : Math.max(requestedWidth, textWidth);
                    let rectOffsetX = 0;
                    if (maxWidth && align !== "left") {
                      if (align === "center") {
                        rectOffsetX = (maxWidth - textWidth) / 2;
                      } else if (align === "right") {
                        rectOffsetX = maxWidth - textWidth;
                      }
                    }

                    return (
                      <Group key={index} y={index * rawTextHeight}>
                        <Rect
                          x={rectOffsetX}
                          width={textWidth}
                          height={rectHeight}
                          y={rectOffsetY}
                          fill={text.backgroundColor}
                        />
                        <Text
                          text={line}
                          fontSize={text.fontSize}
                          fontFamily={text.fontFamily}
                          fontStyle={text.fontStyle}
                          textDecoration={text.textDecoration}
                          letterSpacing={text.letterSpacing}
                          lineHeight={text.lineHeight}
                          fill={text.fill}
                          width={maxWidth}
                          align={align}
                        />
                      </Group>
                    );
                  })}
                </Group>
              );
            }

            return (
              <Text
                key={text.id}
                id={text.id}
                x={text.x}
                y={text.y}
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
                {...commonTextProps}
              />
            );
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
      {editingText && (
        <textarea
          ref={textAreaRef}
          value={editingText.text}
          onChange={(e) =>
            handleUpdateTextObject(editingText.id, { text: e.target.value })
          }
          onKeyDown={handleTextareaKeyDown}
          onBlur={finishEditing}
          style={{
            position: "absolute",
            top: `${editingText.y}px`,
            left: `${editingText.x}px`,
            width: `${editingText.width ?? getNodeSize(editingText.id).width}px`,
            height: `${getNodeSize(editingText.id).height}px`,
            fontSize: `${editingText.fontSize}px`,
            color: editingText.fill,
            border: "1px solid #000",
            resize: "none",
            overflow: "hidden",
            fontFamily: editingText.fontFamily,
            fontStyle: editingText.fontStyle,
            textDecoration: editingText.textDecoration,
            textAlign: editingText.align,
            verticalAlign: editingText.verticalAlign,
            letterSpacing:
              editingText.letterSpacing !== undefined
                ? `${editingText.letterSpacing}px`
                : undefined,
            lineHeight: editingText.lineHeight,
            transform:
              editingText.scaleX && editingText.scaleX !== 1
                ? `scaleX(${editingText.scaleX})`
                : undefined,
            transformOrigin: "left top",
          }}
        />
      )}
    </div>
  );
};
