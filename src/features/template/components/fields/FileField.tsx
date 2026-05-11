import type React from 'react';
import { useRef } from 'react';
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

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf',
  ];

  const onClickImageUpload = () => {
    inputRef.current?.click();
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
          const nextFiles = Array.from(event.target.files ?? []);
          if (!nextFiles.length) return;

          const invalidFile = nextFiles.find(
            (file) => !allowedTypes.includes(file.type),
          );

          if (invalidFile) {
            alert('jpg, jpeg, png, webp, gif, pdf 파일만 업로드 가능합니다.');
            event.target.value = '';
            return;
          }

          if (isMulti) onMultiFilesChange(nextFiles);
          else onSingleFileChange(nextFiles[0] ?? null);

          event.target.value = '';
        }}
      />
      <div className="">
        {!selectedFiles.length ? (
          <div>
            <label
              htmlFor={inputId}
              className="w-full border border-dashed border-[#2B7FFF] bg-[#F8FAFC] px-[14px] py-5.5 rounded-md flex flex-col items-center gap-4 cursor-pointer"
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
