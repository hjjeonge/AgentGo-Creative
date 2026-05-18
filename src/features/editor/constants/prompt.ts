export const PROMPT_MAX_REFERENCE_IMAGES = 10;
export const PROMPT_ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export const PROMPT_UPLOAD_ERROR_MESSAGE =
  'jpg, jpeg, png, webp, gif 이미지 파일만 업로드 가능합니다.';

export const getPromptImageLimitMessage = (maxImages: number) =>
  `레퍼런스 이미지는 최대 ${maxImages}장까지 업로드할 수 있습니다.`;
