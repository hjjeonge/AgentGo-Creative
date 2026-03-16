export interface DrawLine {
  points: number[];
  tool: string;
  strokeWidth: number;
  stroke: string;
}

export type CanvasElementKind = 'line' | 'shape' | 'text' | 'image';

export interface BaseCanvasElement {
  id: string;
  kind: CanvasElementKind;
}

export interface LineElement extends BaseCanvasElement {
  kind: 'line';
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
  rotation?: number;
  fill: string;
  imageUrl?: string;
  points?: number[];
  pointsWidth?: number;
  pointsHeight?: number;
  sourceWidth?: number;
  sourceHeight?: number;
  cropX?: number;
  cropY?: number;
  cropWidth?: number;
  cropHeight?: number;
  maskPath?: number[];
}

export interface ShapeElement extends BaseCanvasElement {
  kind: 'shape';
  shapeType: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  fill: string;
  points?: number[];
  pointsWidth?: number;
  pointsHeight?: number;
}

export interface ImageElement extends BaseCanvasElement {
  kind: 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  imageUrl: string;
  sourceWidth?: number;
  sourceHeight?: number;
  cropX?: number;
  cropY?: number;
  cropWidth?: number;
  cropHeight?: number;
  maskPath?: number[];
}

export interface TextObject {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  text: string;
  width?: number;
  fontSize: number;
  fill: string;
  fontFamily?: string;
  fontStyle?: string;
  textDecoration?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  letterSpacing?: number;
  lineHeight?: number;
  scaleX?: number;
  listFormat?: 'none' | 'unordered' | 'ordered';
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

export interface TextElement extends BaseCanvasElement {
  kind: 'text';
  x: number;
  y: number;
  rotation?: number;
  text: string;
  width?: number;
  fontSize: number;
  fill: string;
  fontFamily?: string;
  fontStyle?: string;
  textDecoration?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  letterSpacing?: number;
  lineHeight?: number;
  scaleX?: number;
  listFormat?: 'none' | 'unordered' | 'ordered';
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

export type CanvasElement =
  | LineElement
  | ShapeElement
  | ImageElement
  | TextElement;

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CanvasSnapshot {
  backgroundImage: string | null;
  elements: CanvasElement[];
}

export interface HistoryEntry {
  id: string;
  title: string;
  timestamp: string;
  snapshot: CanvasSnapshot;
}

export interface CanvasHandle {
  setBackgroundImage: (url: string | null) => void;
  addText: () => void;
  updateTextObject: (id: string, updates: Partial<TextObject>) => void;
  getSnapshot: () => CanvasSnapshot;
  exportAsBlob: () => Promise<Blob | null>;
  restoreSnapshot: (snapshot: CanvasSnapshot) => void;
  hasImage: () => boolean;
  clearCanvas: () => void;
}

export interface ShapeIntersection {
  shape: Shape;
  ix: number;
  iy: number;
  iWidth: number;
  iHeight: number;
  area: number;
}

export interface HistoryState {
  backgroundImage: string | null;
  elements: CanvasElement[];
}
