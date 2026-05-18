import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';

import { IconButton } from '@/commons/components/IconButton';
import { FileIcon } from '@/features/dam/components/DAMFileIcons';

interface Props {
  file: File;
  onRemove: () => void;
}

export const UploadedImageCard: React.FC<Props> = ({ file, onRemove }) => {
  const [previewUrl, setPreviewUrl] = useState('');
  const isImageFile = file.type.startsWith('image/');
  const isPdfFile = file.type === 'application/pdf';

  useEffect(() => {
    if (!isImageFile) {
      setPreviewUrl('');
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file, isImageFile]);

  const lastDot = file.name.lastIndexOf('.');
  const baseName = lastDot >= 0 ? file.name.slice(0, lastDot) : file.name;
  const extension = lastDot >= 0 ? file.name.slice(lastDot + 1) : '';

  return (
    <div className="flex flex-col gap-2 p-3 rounded-md border border-border-neutral w-42.5 shrink-0">
      <div className="relative group rounded-md overflow-hidden">
        {isImageFile ? (
          <img
            src={previewUrl}
            alt={file.name}
            className="w-[146px] h-[75px] object-cover bg-center"
          />
        ) : (
          <div className="flex h-[75px] w-[146px] flex-col items-center justify-center gap-2 bg-[#F8FAFC] text-[#62748E]">
            <FileIcon type={isPdfFile ? 'pdf' : 'other'} size={36} />
            <span className="text-xs font-bold uppercase">
              {extension || 'file'}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-1">
          <IconButton onClick={onRemove} variant="neutral-outlined">
            <Trash2 size={18} />
          </IconButton>
        </div>
      </div>
      <span className="flex min-w-0 text-sm font-bold text-[#155DFC]">
        <span className="truncate min-w-0">{baseName}</span>
        {extension ? <span className="shrink-0">.{extension}</span> : null}
      </span>
    </div>
  );
};
