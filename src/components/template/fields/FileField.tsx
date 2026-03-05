import type React from 'react';
import UploadIcon from '../../../assets/upload-cloud-2-line.svg';
import CloseIcon from '../../../assets/close-line.svg';
import type { TemplateField } from '../../../types/template';
import { FormRow } from '../FormRow';

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
  const inputId = `file-input-${field.key}`;
  const isMulti = field.type === 'files';

  return (
    <FormRow label={field.label} required={field.required}>
      <input
        id={inputId}
        type="file"
        accept="image/*"
        multiple={isMulti}
        className="hidden"
        onChange={(event) => {
          const nextFiles = Array.from(event.target.files ?? []);
          if (!nextFiles.length) return;

          if (isMulti) onMultiFilesChange(nextFiles);
          else onSingleFileChange(nextFiles[0] ?? null);

          event.target.value = '';
        }}
      />
      <div className="flex items-center gap-[8px] flex-wrap">
        {selectedFiles.map((file, index) => (
          <span
            key={`${file.name}-${index}`}
            className="flex items-center gap-[6px] text-[14px] text-[#0F172B]"
          >
            {file.name}
            <button onClick={() => onRemoveFile(index)}>
              <img src={CloseIcon} className="w-[14px] h-[14px]" />
            </button>
          </span>
        ))}
        <label
          htmlFor={inputId}
          className="border border-dashed border-[#155DFC] px-[14px] py-[7px] rounded-[8px] flex items-center gap-[6px] text-[13px] text-[#475569] cursor-pointer"
        >
          <img src={UploadIcon} className="w-[14px] h-[14px]" />
          {isMulti ? '파일 선택' : '업로드'}
        </label>
      </div>
    </FormRow>
  );
};
