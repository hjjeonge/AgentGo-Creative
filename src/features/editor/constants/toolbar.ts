import { ChangeIcon } from '@/commons/components/icons/ChangeIcon';
import { ClickIcon } from '@/commons/components/icons/ClickIcon';
import { CropIcon } from '@/commons/components/icons/CropIcon';
import { EraserIcon } from '@/commons/components/icons/EraserIcon';
import { PencilIcon } from '@/commons/components/icons/PencilIcon';
import { TextIcon } from '@/commons/components/icons/TextIcon';
import { UploadIcon } from '@/commons/components/icons/UploadIcon';

export const TOOLBAR_ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export const TOOLBAR_UPLOAD_ERROR_MESSAGE =
  'jpg, jpeg, png, webp 파일만 업로드 가능합니다.';

export const TOOLBAR_PEN_STROKE_WIDTHS = [2, 3, 5, 6] as const;
export const TOOLBAR_DISPLAY_COLORS = [
  '#E7000B',
  '#155DFC',
  '#FFD230',
  'empty',
] as const;

export const TOOLBAR_ITEMS = [
  { tool: 'mouse', icon: ClickIcon },
  { tool: 'change', icon: ChangeIcon },
  { tool: 'crop', icon: CropIcon },
  { tool: 'text', icon: TextIcon },
  { tool: 'upload', icon: UploadIcon },
  { tool: 'pen', icon: PencilIcon },
  { tool: 'eraser', icon: EraserIcon },
] as const;

export const TOOLBAR_POPUP_TOOLS = ['pen', 'eraser', 'crop', 'text'] as const;
