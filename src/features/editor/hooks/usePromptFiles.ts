import { useEffect, useMemo, useRef, useState } from 'react';

import {
  getPromptImageLimitMessage,
  PROMPT_ALLOWED_IMAGE_TYPES,
  PROMPT_MAX_REFERENCE_IMAGES,
  PROMPT_UPLOAD_ERROR_MESSAGE,
} from '@/features/editor/constants/prompt';

type PreviewImage = {
  file: File;
  url: string;
};

const revokePreviewUrl = (previewImage?: PreviewImage) => {
  if (!previewImage) return;
  URL.revokeObjectURL(previewImage.url);
};

export const usePromptFiles = () => {
  const [images, setImages] = useState<PreviewImage[]>([]);
  const imagesRef = useRef(images);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((image) => revokePreviewUrl(image));
    };
  }, []);

  const isMaxImages = images.length >= PROMPT_MAX_REFERENCE_IMAGES;
  const previewSize = useMemo(
    () => (images.length <= 1 ? 100 : 55),
    [images.length],
  );

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || isMaxImages) return;

    const files = Array.from(fileList);
    if (
      files.some(
        (file) =>
          !PROMPT_ALLOWED_IMAGE_TYPES.includes(
            file.type as (typeof PROMPT_ALLOWED_IMAGE_TYPES)[number],
          ),
      )
    ) {
      window.alert(PROMPT_UPLOAD_ERROR_MESSAGE);
      return;
    }

    const availableCount = PROMPT_MAX_REFERENCE_IMAGES - images.length;
    if (files.length > availableCount) {
      window.alert(getPromptImageLimitMessage(PROMPT_MAX_REFERENCE_IMAGES));
    }

    const newImages = files.slice(0, availableCount).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleRemoveImage = (index: number) => {
    revokePreviewUrl(images[index]);
    setImages((prev) =>
      prev.filter((_, currentIndex) => currentIndex !== index),
    );
  };

  const clearImages = () => {
    images.forEach((image) => revokePreviewUrl(image));
    setImages([]);
  };

  return {
    clearImages,
    handleFiles,
    handleRemoveImage,
    images,
    isMaxImages,
    previewSize,
  };
};
