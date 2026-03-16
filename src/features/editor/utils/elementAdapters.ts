import type {
  CanvasElement,
  DrawLine,
  ImageElement,
  LineElement,
  Shape,
  ShapeElement,
  TextElement,
  TextObject,
} from '@/features/editor/types';

export interface LegacyCanvasCollections {
  lines: DrawLine[];
  shapes: Shape[];
  texts: TextObject[];
}

export const toLineElement = (line: DrawLine, index: number): LineElement => {
  return {
    id: `line_${index}`,
    kind: 'line',
    points: [...line.points],
    tool: line.tool,
    strokeWidth: line.strokeWidth,
    stroke: line.stroke,
  };
};

export const toShapeElement = (shape: Shape): ShapeElement | ImageElement => {
  if (shape.type === 'uploaded_image' && shape.imageUrl) {
    return {
      id: shape.id,
      kind: 'image',
      x: shape.x,
      y: shape.y,
      width: shape.width,
      height: shape.height,
      rotation: shape.rotation,
      imageUrl: shape.imageUrl,
      sourceWidth: shape.sourceWidth,
      sourceHeight: shape.sourceHeight,
      cropX: shape.cropX,
      cropY: shape.cropY,
      cropWidth: shape.cropWidth,
      cropHeight: shape.cropHeight,
      maskPath: shape.maskPath ? [...shape.maskPath] : undefined,
    };
  }

  return {
    id: shape.id,
    kind: 'shape',
    shapeType: shape.type,
    x: shape.x,
    y: shape.y,
    width: shape.width,
    height: shape.height,
    rotation: shape.rotation,
    fill: shape.fill,
    points: shape.points ? [...shape.points] : undefined,
    pointsWidth: shape.pointsWidth,
    pointsHeight: shape.pointsHeight,
  };
};

export const toTextElement = (text: TextObject): TextElement => {
  return {
    id: text.id,
    kind: 'text',
    x: text.x,
    y: text.y,
    rotation: text.rotation,
    text: text.text,
    width: text.width,
    fontSize: text.fontSize,
    fill: text.fill,
    fontFamily: text.fontFamily,
    fontStyle: text.fontStyle,
    textDecoration: text.textDecoration,
    align: text.align,
    verticalAlign: text.verticalAlign,
    letterSpacing: text.letterSpacing,
    lineHeight: text.lineHeight,
    scaleX: text.scaleX,
    listFormat: text.listFormat,
    stroke: text.stroke,
    strokeWidth: text.strokeWidth,
    strokeEnabled: text.strokeEnabled,
    shadowColor: text.shadowColor,
    shadowBlur: text.shadowBlur,
    shadowOpacity: text.shadowOpacity,
    shadowOffsetX: text.shadowOffsetX,
    shadowOffsetY: text.shadowOffsetY,
    shadowDirection: text.shadowDirection,
    shadowDistance: text.shadowDistance,
    shadowEnabled: text.shadowEnabled,
    verticalWriting: text.verticalWriting,
    backgroundColor: text.backgroundColor,
    backgroundEnabled: text.backgroundEnabled,
  };
};

export const toCanvasElements = ({
  lines,
  shapes,
  texts,
}: LegacyCanvasCollections): CanvasElement[] => {
  return [
    ...shapes.map(toShapeElement),
    ...texts.map(toTextElement),
    ...lines.map(toLineElement),
  ];
};

export const partitionCanvasElements = (
  elements: CanvasElement[],
): LegacyCanvasCollections => {
  const lines: DrawLine[] = [];
  const shapes: Shape[] = [];
  const texts: TextObject[] = [];

  elements.forEach((element) => {
    if (element.kind === 'line') {
      lines.push({
        points: [...element.points],
        tool: element.tool,
        strokeWidth: element.strokeWidth,
        stroke: element.stroke,
      });
      return;
    }

    if (element.kind === 'image') {
      shapes.push({
        id: element.id,
        type: 'uploaded_image',
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
        rotation: element.rotation,
        fill: 'transparent',
        imageUrl: element.imageUrl,
        sourceWidth: element.sourceWidth,
        sourceHeight: element.sourceHeight,
        cropX: element.cropX,
        cropY: element.cropY,
        cropWidth: element.cropWidth,
        cropHeight: element.cropHeight,
        maskPath: element.maskPath ? [...element.maskPath] : undefined,
      });
      return;
    }

    if (element.kind === 'shape') {
      shapes.push({
        id: element.id,
        type: element.shapeType,
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
        rotation: element.rotation,
        fill: element.fill,
        points: element.points ? [...element.points] : undefined,
        pointsWidth: element.pointsWidth,
        pointsHeight: element.pointsHeight,
      });
      return;
    }

    texts.push({
      id: element.id,
      x: element.x,
      y: element.y,
      rotation: element.rotation,
      text: element.text,
      width: element.width,
      fontSize: element.fontSize,
      fill: element.fill,
      fontFamily: element.fontFamily,
      fontStyle: element.fontStyle,
      textDecoration: element.textDecoration,
      align: element.align,
      verticalAlign: element.verticalAlign,
      letterSpacing: element.letterSpacing,
      lineHeight: element.lineHeight,
      scaleX: element.scaleX,
      listFormat: element.listFormat,
      stroke: element.stroke,
      strokeWidth: element.strokeWidth,
      strokeEnabled: element.strokeEnabled,
      shadowColor: element.shadowColor,
      shadowBlur: element.shadowBlur,
      shadowOpacity: element.shadowOpacity,
      shadowOffsetX: element.shadowOffsetX,
      shadowOffsetY: element.shadowOffsetY,
      shadowDirection: element.shadowDirection,
      shadowDistance: element.shadowDistance,
      shadowEnabled: element.shadowEnabled,
      verticalWriting: element.verticalWriting,
      backgroundColor: element.backgroundColor,
      backgroundEnabled: element.backgroundEnabled,
    });
  });

  return { lines, shapes, texts };
};
