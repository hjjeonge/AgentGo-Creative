import { resolveImageUrl } from '@/features/template/utils/resolveImageUrl';

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const toDataUrl = (mimeType: string, imageBase64: string) =>
  `data:${mimeType};base64,${imageBase64}`;

type GeneratedImageSource =
  | {
      image_url?: string;
      image_base64?: string;
      mime_type?: string;
    }
  | null
  | undefined;

export const resolveGeneratedImageSource = (source: GeneratedImageSource) => {
  if (!source) return null;
  if (source.image_url) {
    return resolveImageUrl(source.image_url) || source.image_url;
  }
  if (source.image_base64) {
    return toDataUrl(source.mime_type || 'image/png', source.image_base64);
  }
  return null;
};

export const compactLines = (lines: Array<string | undefined>) =>
  lines
    .map((line) => line?.trim())
    .filter(Boolean)
    .join('\n');
