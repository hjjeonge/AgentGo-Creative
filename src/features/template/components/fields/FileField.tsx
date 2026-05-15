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
  const isMulti = !field.isTargetImage;
  const isExcelField = field.key === 'products_excel';

  const [isDragOver, setIsDragOver] = useState(false);

  const allowedTypes = isExcelField
    ? [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ]
    : ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];

  const acceptAttr = isExcelField
    ? '.xls,.xlsx'
    : 'image/jpeg,image/png,image/webp,image/gif,application/pdf';

  const handleFiles = (files: File[]) => {
    if (!files.length) return;

    const invalidFile = files.find((file) => !allowedTypes.includes(file.type));
    if (invalidFile) {
      alert(
        isExcelField
          ? 'xls, xlsx 파일만 업로드 가능합니다.'
          : 'jpg, jpeg, png, webp, gif, pdf 파일만 업로드 가능합니다.',
      );
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
    if (field.isTargetImage && files.length > 1) {
      alert('타겟 이미지는 하나만 업로드할 수 있습니다.');
      return;
    }

    handleFiles(files);
  };

  return (
    <FormRow
      label={
        !selectedFiles.length && field.isTargetImage ? undefined : field.label
      }
      required={field.required}
    >
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept={acceptAttr}
        multiple={isMulti}
        className="hidden"
        onChange={(event) => {
          handleFiles(Array.from(event.target.files ?? []));
          event.target.value = '';
        }}
      />
      <div className="min-w-0">
        {field.isTargetImage ? (
          <>
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
                      <span>
                        {isExcelField
                          ? '엑셀 파일을 업로드하세요.'
                          : '타겟 이미지나 파일을 업로드하세요.'}
                      </span>
                      <span className="text-[#E7000B]">*</span>
                    </div>
                    <span className="text-sm text-text-tertiary font-normal">
                      {isExcelField
                        ? '.xls, .xlsx 파일 지원'
                        : '드래그 앤 드롭 하거나 클릭하여 파일 업로드'}
                    </span>
                  </div>

                  <Button
                    onClick={onClickImageUpload}
                    startDecorator={<Paperclip />}
                    variant="primary-outlined"
                  >
                    {isExcelField ? '엑셀 파일 추가' : '사진 및 파일 추가'}
                  </Button>
                </label>
              </div>
            ) : (
              <UploadedImageCard
                file={selectedFiles[0]}
                onRemove={() => onRemoveFile(0)}
              />
            )}
          </>
        ) : (
          <div className="flex min-w-0 flex-col gap-3 overflow-hidden">
            <Button
              onClick={onClickImageUpload}
              startDecorator={<Paperclip />}
              variant="primary-outlined"
            >
              사진 및 파일 추가
            </Button>
            {!!selectedFiles.length && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center text-text-secondary font-bold text-xs gap-2">
                  <span>첨부파일</span>
                  <span className="bg-[#DBEAFE] text-[#193CB8] px-[7px] font-bold text-sm rounded-lg">
                    {selectedFiles.length}
                  </span>
                </div>
                <div className="min-w-0 overflow-x-auto pr-6">
                  <div className="flex w-max gap-3">
                    {selectedFiles.map((file, index) => (
                      <UploadedImageCard
                        key={`${file.name}-${index}`}
                        file={file}
                        onRemove={() => onRemoveFile(index)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </FormRow>
  );
};
