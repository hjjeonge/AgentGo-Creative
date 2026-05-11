import type React from 'react';
import { useRef, useState } from 'react';
import { Paperclip } from 'lucide-react';

import { Button } from '@/commons/components/Button';
import type { TemplateField } from '@/features/template/types';

import { FormRow } from '../FormRow';
import { UploadedImageCard } from './UploadedImageCard';

interface FileFieldProps {
  field: TemplateField;
  selectedFiles: File[];
  onSingleFileChange: (selected: File | null) => void;
  onMultiFilesChange: (selected: File[]) => void;
  onRemoveFile: (index: number) => void;
}

export const FileField: React.FC<FileFieldProps> = ({
  field,
  selectedFiles,
  onSingleFileChange,
  onMultiFilesChange,
  onRemoveFile,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = `file-input-${field.key}`;
  const isMulti = field.type === 'files';

  const [isDragOver, setIsDragOver] = useState(false);

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf',
  ];

  const handleFiles = (files: File[]) => {
    if (!files.length) return;

    const invalidFile = files.find((file) => !allowedTypes.includes(file.type));
    if (invalidFile) {
      alert('jpg, jpeg, png, webp, gif, pdf 파일만 업로드 가능합니다.');
      return;
    }

    if (isMulti) onMultiFilesChange(files);
    else onSingleFileChange(files[0] ?? null);
  };

  const onClickImageUpload = () => {
    inputRef.current?.click();
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);

    const files = Array.from(event.dataTransfer.files);
    if (files.length > 1) {
      alert('파일은 하나만 업로드할 수 있습니다.');
      return;
    }

    handleFiles(files);
  };

  return (
    <FormRow
      label={selectedFiles.length ? '타겟 이미지' : undefined}
      required={field.required}
    >
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
        multiple={isMulti}
        className="hidden"
        onChange={(event) => {
          handleFiles(Array.from(event.target.files ?? []));
          event.target.value = '';
        }}
      />
      <div className="">
        {!selectedFiles.length ? (
          <div>
            <label
              htmlFor={inputId}
              className={`w-full border border-dashed rounded-md flex flex-col items-center gap-4 cursor-pointer px-[14px] py-5.5 transition-colors ${isDragOver ? 'border-[#2B7FFF] bg-[#EFF6FF]' : 'border-[#2B7FFF] bg-[#F8FAFC]'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center gap-2 text-md text-text-primary font-bold">
                <div className="flex gap-1">
                  <span>타겟 이미지나 파일을 업로드하세요.</span>
                  <span className="text-[#E7000B]">*</span>
                </div>
                <span className="text-sm text-text-tertiary font-normal">
                  드래그 앤 드롭 하거나 클릭하여 파일 업로드
                </span>
              </div>

              <Button
                onClick={onClickImageUpload}
                startDecorator={<Paperclip />}
                variant="primary-outlined"
              >
                사진 및 파일 추가
              </Button>
            </label>
          </div>
        ) : (
          <>
            {selectedFiles.map((file, index) => (
              <UploadedImageCard
                key={`${file.name}-${index}`}
                file={file}
                onRemove={() => onRemoveFile(index)}
              />
            ))}
          </>
        )}
      </div>
    </FormRow>
  );
};
