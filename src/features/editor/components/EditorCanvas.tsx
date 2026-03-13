import Konva from 'konva';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Arrow,
  Ellipse,
  Group,
  Image as KonvaImage,
  Layer,
  Line,
  Path,
  Rect,
  Stage,
  Text,
  Transformer,
} from 'react-konva';
import type { DrawLine, Shape, TextObject } from '@/features/editor/types';

interface EditorCanvasProps {
  stageSize: { width: number; height: number };
  activeTool: string;
  handleMouseDown: (e: any) => void;
  handleMouseMove: (e: any) => void;
  handleMouseUp: (e: any) => void;
  lines: DrawLine[];
  currentLine: DrawLine | null;
  shapes: Shape[];
  texts: TextObject[];
  setSelectedId: (id: string | null) => void;
  objectRefs: React.RefObject<Record<string, any>>;
  trRef: React.RefObject<any>;
  handleTransformEnd: (e: any) => void;
  handleDragEnd: (e: any) => void;
  editingTextId: string | null;
  setEditingTextId: (id: string | null) => void;
  handleUpdateTextObject: (id: string, updates: Partial<TextObject>) => void;
  backgroundImageUrl?: string | null;
  selectionRect?: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  lassoPath?: number[];
  selectedIds?: string[];
  onStageReady?: (stage: Konva.Stage | null) => void;
}

const buildPolygonPoints = (sides: number, width: number, height: number) => {
  const cx = width / 2;
  const cy = height / 2;
  const rx = width / 2;
  const ry = height / 2;
  const startAngle = -Math.PI / 2;
  const points: number[] = [];

  for (let i = 0; i < sides; i++) {
    const angle = startAngle + (Math.PI * 2 * i) / sides;
    points.push(cx + rx * Math.cos(angle), cy + ry * Math.sin(angle));
  }
  return points;
};

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  stageSize,
  activeTool,
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
  handleDragEnd,
  editingTextId,
  setEditingTextId,
  handleUpdateTextObject,
  backgroundImageUrl,
  selectionRect,
  lassoPath = [],
  selectedIds = [],
  onStageReady,
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const [bgImageNaturalSize, setBgImageNaturalSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [shapeImages, setShapeImages] = useState<
    Record<string, HTMLImageElement>
  >({});

  useEffect(() => {
    if (backgroundImageUrl) {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.src = backgroundImageUrl;
      img.onload = () => {
        setBgImage(img);
        setBgImageNaturalSize({
          width: Math.max(1, img.naturalWidth || img.width),
          height: Math.max(1, img.naturalHeight || img.height),
        });
      };
    } else {
      setBgImage(null);
      setBgImageNaturalSize(null);
    }
  }, [backgroundImageUrl]);

  const bgImageRect = useMemo(() => {
    if (!bgImageNaturalSize) return null;
    const { width: imageWidth, height: imageHeight } = bgImageNaturalSize;
    const ratio = Math.min(
      stageSize.width / imageWidth,
      stageSize.height / imageHeight,
    );
    const width = Math.max(1, Math.round(imageWidth * ratio));
    const height = Math.max(1, Math.round(imageHeight * ratio));
    return {
      x: Math.round((stageSize.width - width) / 2),
      y: Math.round((stageSize.height - height) / 2),
      width,
      height,
    };
  }, [bgImageNaturalSize, stageSize.height, stageSize.width]);

  useEffect(() => {
    if (editingTextId && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [editingTextId]);

  useEffect(() => {
    const imageShapes = shapes.filter(
      (shape) => shape.type === 'uploaded_image' && shape.imageUrl,
    );
    if (imageShapes.length === 0) {
      setShapeImages((prev) => {
        if (Object.keys(prev).length === 0) return prev;
        return {};
      });
      return;
    }

    let disposed = false;
    imageShapes.forEach((shape) => {
      const key = shape.id;
      const imageUrl = shape.imageUrl;
      if (!imageUrl || shapeImages[key]) return;
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;
      img.onload = () => {
        if (disposed) return;
        setShapeImages((prev) => ({ ...prev, [key]: img }));
      };
    });

    return () => {
      disposed = true;
    };
  }, [shapes, shapeImages]);

  const handleTextDblClick = (_e: any, text: TextObject) => {
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
    if (e.key === 'Escape') {
      finishEditing();
    }
  };

  const editingText = texts.find((t) => t.id === editingTextId);
  const stageRef = useRef<any>(null);

  useEffect(() => {
    onStageReady?.(stageRef.current);
  }, [onStageReady, stageSize.width, stageSize.height]);

  const toVerticalText = (value: string) => {
    return value
      .split('\n')
      .map((line) => line.split('').join('\n'))
      .join('\n\n');
  };

  const getListFormattedText = (text: TextObject) => {
    let baseText = text.text;
    if (text.listFormat && text.listFormat !== 'none') {
      const lines = baseText.split('\n');
      if (text.listFormat === 'unordered') {
        baseText = lines.map((line) => `• ${line}`).join('\n');
      } else {
        baseText = lines
          .map((line, index) => `${index + 1}. ${line}`)
          .join('\n');
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

  const renderDiagramShape = (shape: Shape) => {
    const width = Math.max(10, shape.width);
    const height = Math.max(10, shape.height);
    const stroke = 'rgba(15, 23, 43, 0.18)';
    const common = {
      fill: shape.fill,
      stroke,
      strokeWidth: 1,
    };

    switch (shape.type) {
      case 'object_rect':
        return (
          <Rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill="rgba(20, 71, 230, 0.18)"
            stroke="#1447E6"
            strokeWidth={1.5}
            dash={[6, 4]}
          />
        );
      case 'object_free': {
        const baseW = Math.max(1, shape.pointsWidth ?? width);
        const baseH = Math.max(1, shape.pointsHeight ?? height);
        const source = shape.points ?? [];
        const scaled: number[] = [];
        for (let i = 0; i < source.length; i += 2) {
          const sx = source[i];
          const sy = source[i + 1];
          scaled.push((sx / baseW) * width, (sy / baseH) * height);
        }
        return (
          <Line
            points={scaled}
            closed
            fill="rgba(20, 71, 230, 0.18)"
            stroke="#1447E6"
            strokeWidth={1.5}
            dash={[6, 4]}
          />
        );
      }
      case 'round_square':
        return (
          <Rect
            x={0}
            y={0}
            width={width}
            height={height}
            cornerRadius={Math.min(width, height) * 0.2}
            {...common}
          />
        );
      case 'oblong':
        return <Rect x={0} y={0} width={width} height={height} {...common} />;
      case 'round_oblong':
        return (
          <Rect
            x={0}
            y={0}
            width={width}
            height={height}
            cornerRadius={Math.min(height / 2, width / 4)}
            {...common}
          />
        );
      case 'triangle':
        return (
          <Line
            points={[width / 2, 0, width, height, 0, height]}
            closed
            {...common}
          />
        );
      case 'rhombus':
        return (
          <Line
            points={[
              width / 2,
              0,
              width,
              height / 2,
              width / 2,
              height,
              0,
              height / 2,
            ]}
            closed
            {...common}
          />
        );
      case 'pentagon':
        return (
          <Line
            points={buildPolygonPoints(5, width, height)}
            closed
            {...common}
          />
        );
      case 'hexagon':
        return (
          <Line
            points={buildPolygonPoints(6, width, height)}
            closed
            {...common}
          />
        );
      case 'circle':
      case 'oval':
        return (
          <Ellipse
            x={width / 2}
            y={height / 2}
            radiusX={width / 2}
            radiusY={height / 2}
            {...common}
          />
        );
      case 'semicircle':
        return (
          <Path
            data="M 0 100 A 50 50 0 0 1 100 100 L 0 100 Z"
            x={0}
            y={0}
            scaleX={width / 100}
            scaleY={height / 100}
            {...common}
          />
        );
      case 'circle_cut':
        return (
          <Path
            data="M 50 0 A 50 50 0 1 1 50 100 L 100 50 Z"
            x={0}
            y={0}
            scaleX={width / 100}
            scaleY={height / 100}
            {...common}
          />
        );
      case 'arrow':
        return (
          <Line
            points={[
              0,
              height * 0.35,
              width * 0.72,
              height * 0.35,
              width * 0.72,
              0,
              width,
              height * 0.5,
              width * 0.72,
              height,
              width * 0.72,
              height * 0.65,
              0,
              height * 0.65,
            ]}
            closed
            {...common}
          />
        );
      case 'arrow_fill':
        return (
          <Arrow
            points={[0, height / 2, width, height / 2]}
            pointerLength={10}
            pointerWidth={10}
            fillAfterPointer={false}
            {...common}
          />
        );
      case 'label':
        return (
          <Line
            points={[
              0,
              0,
              width * 0.82,
              0,
              width,
              height / 2,
              width * 0.82,
              height,
              0,
              height,
            ]}
            closed
            {...common}
          />
        );
      case 'label_cut':
        return (
          <Line
            points={[
              0,
              0,
              width * 0.82,
              0,
              width,
              height / 2,
              width * 0.82,
              height,
              0,
              height,
              width * 0.18,
              height / 2,
            ]}
            closed
            {...common}
          />
        );
      case 'square':
      default:
        return <Rect x={0} y={0} width={width} height={height} {...common} />;
    }
  };

  const backgroundShapes = shapes.filter(
    (shape) => shape.type === 'uploaded_image',
  );
  const overlayShapes = shapes.filter(
    (shape) => shape.type !== 'uploaded_image',
  );

  return (
    <div style={{ position: 'relative', cursor: 'default' }}>
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        draggable={false}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {bgImage && bgImageRect && (
            <KonvaImage
              image={bgImage}
              x={bgImageRect.x}
              y={bgImageRect.y}
              width={bgImageRect.width}
              height={bgImageRect.height}
              listening={false}
            />
          )}
        </Layer>
        <Layer>
          {backgroundShapes.map((shape) => (
            <Group
              key={shape.id}
              id={shape.id}
              x={shape.x}
              y={shape.y}
              draggable={activeTool === 'mouse'}
              onClick={() => setSelectedId(shape.id)}
              onTap={() => setSelectedId(shape.id)}
              ref={(node) => {
                if (node) objectRefs.current[shape.id] = node;
              }}
              onTransformEnd={handleTransformEnd}
              onDragEnd={handleDragEnd}
            >
              {(shape.maskPath?.length ?? 0) >= 6 ? (
                <Group
                  clipFunc={(ctx) => {
                    const points = shape.maskPath ?? [];
                    if (points.length < 6) return;
                    const width = Math.max(1, shape.width);
                    const height = Math.max(1, shape.height);
                    ctx.beginPath();
                    ctx.moveTo(points[0] * width, points[1] * height);
                    for (let i = 2; i < points.length; i += 2) {
                      ctx.lineTo(points[i] * width, points[i + 1] * height);
                    }
                    ctx.closePath();
                  }}
                >
                  <KonvaImage
                    image={shapeImages[shape.id] ?? null}
                    x={0}
                    y={0}
                    width={Math.max(1, shape.width)}
                    height={Math.max(1, shape.height)}
                    crop={
                      (shape.cropWidth ?? 0) > 0 && (shape.cropHeight ?? 0) > 0
                        ? {
                            x: shape.cropX ?? 0,
                            y: shape.cropY ?? 0,
                            width: shape.cropWidth ?? 0,
                            height: shape.cropHeight ?? 0,
                          }
                        : undefined
                    }
                  />
                </Group>
              ) : (
                <KonvaImage
                  image={shapeImages[shape.id] ?? null}
                  x={0}
                  y={0}
                  width={Math.max(1, shape.width)}
                  height={Math.max(1, shape.height)}
                  crop={
                    (shape.cropWidth ?? 0) > 0 && (shape.cropHeight ?? 0) > 0
                      ? {
                          x: shape.cropX ?? 0,
                          y: shape.cropY ?? 0,
                          width: shape.cropWidth ?? 0,
                          height: shape.cropHeight ?? 0,
                        }
                      : undefined
                  }
                />
              )}
            </Group>
          ))}
          {overlayShapes.map((shape) => (
            <Group
              key={shape.id}
              id={shape.id}
              x={shape.x}
              y={shape.y}
              draggable={activeTool === 'mouse'}
              onClick={() => setSelectedId(shape.id)}
              onTap={() => setSelectedId(shape.id)}
              ref={(node) => {
                if (node) objectRefs.current[shape.id] = node;
              }}
              onTransformEnd={handleTransformEnd}
              onDragEnd={handleDragEnd}
            >
              {renderDiagramShape(shape)}
            </Group>
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
              text.backgroundColor !== 'transparent'
            ) {
              const displayText = getDisplayText(text);
              const lines = displayText.split('\n');

              return (
                <Group
                  key={text.id}
                  id={text.id}
                  x={text.x}
                  y={text.y}
                  draggable={activeTool === 'mouse'}
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
                    const align = text.align ?? 'left';
                    const maxWidth =
                      align === 'left' || !requestedWidth
                        ? textWidth
                        : Math.max(requestedWidth, textWidth);
                    let rectOffsetX = 0;
                    if (maxWidth && align !== 'left') {
                      if (align === 'center') {
                        rectOffsetX = (maxWidth - textWidth) / 2;
                      } else if (align === 'right') {
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
                draggable={activeTool === 'mouse'}
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
          {/* 라소 선택 경로 */}
          {lassoPath.length >= 4 && (
            <Line
              points={lassoPath}
              stroke="#1447E6"
              strokeWidth={1.5}
              dash={[4, 4]}
              closed={false}
              fill="rgba(20, 71, 230, 0.08)"
              listening={false}
            />
          )}
          {/* 사각형 선택 범위 */}
          {selectionRect && (
            <Rect
              x={selectionRect.x}
              y={selectionRect.y}
              width={selectionRect.width}
              height={selectionRect.height}
              fill="rgba(20, 71, 230, 0.08)"
              stroke="#1447E6"
              strokeWidth={1}
              dash={[4, 4]}
              listening={false}
            />
          )}
          {/* 다중 선택 시 각 객체 테두리 점선 표시 */}
          {selectedIds.length > 1 &&
            selectedIds.map((id) => {
              const node = objectRefs.current[id];
              if (!node) return null;
              const rect = node.getClientRect({
                skipTransform: false,
                skipShadow: true,
                skipStroke: false,
              });
              const stage = node.getStage();
              const stageX = stage ? stage.x() : 0;
              const stageY = stage ? stage.y() : 0;
              return (
                <Rect
                  key={`sel-${id}`}
                  x={rect.x - stageX}
                  y={rect.y - stageY}
                  width={rect.width}
                  height={rect.height}
                  fill="transparent"
                  stroke="#1447E6"
                  strokeWidth={1.5}
                  dash={[4, 4]}
                  listening={false}
                />
              );
            })}
          <Transformer
            ref={trRef}
            rotateEnabled={true}
            keepRatio={true}
            enabledAnchors={[
              'top-left',
              'top-right',
              'bottom-left',
              'bottom-right',
            ]}
          />
        </Layer>
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.stroke}
              strokeWidth={line.strokeWidth}
              tension={0.5}
              lineCap="round"
              listening={false}
              globalCompositeOperation={
                line.tool === 'eraser' ? 'destination-out' : 'source-over'
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
              listening={false}
              globalCompositeOperation={
                currentLine.tool === 'eraser'
                  ? 'destination-out'
                  : 'source-over'
              }
            />
          )}
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
            position: 'absolute',
            top: `${editingText.y}px`,
            left: `${editingText.x}px`,
            width: `${editingText.width ?? getNodeSize(editingText.id).width}px`,
            height: `${getNodeSize(editingText.id).height}px`,
            fontSize: `${editingText.fontSize}px`,
            color: editingText.fill,
            border: '1px solid #000',
            resize: 'none',
            overflow: 'hidden',
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
            transformOrigin: 'left top',
          }}
        />
      )}
    </div>
  );
};
