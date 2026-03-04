import type React from "react";
import { useEffect, useRef, useState } from "react";
import Close from "./../../assets/close-line.svg";

interface Props {
  onGenerate?: (prompt: string) => void;
}

export const Prompt: React.FC<Props> = ({ onGenerate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<{ file: File; url: string }[]>([]);

  const canSend = prompt.trim().length > 0;
  const isMaxImages = images.length >= 10;

  const handleOpenFile = () => {
    fileInputRef.current?.click();
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const nextFiles = Array.from(fileList).filter((file) =>
      file.type.startsWith("image/"),
    );
    if (nextFiles.length === 0) return;

    setImages((prev) => {
      if (prev.length >= 10) return prev;
      const available = 10 - prev.length;
      const sliced = nextFiles.slice(0, available);
      const mapped = sliced.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));
      return [...prev, ...mapped];
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const next = [...prev];
      const target = next[index];
      if (target) URL.revokeObjectURL(target.url);
      next.splice(index, 1);
      return next;
    });
  };

  const handleSend = () => {
    if (!canSend) return;
    onGenerate?.(prompt);
    setPrompt("");
    setImages([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, [images]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    const nextHeight = Math.min(textarea.scrollHeight, 320);
    textarea.style.height = `${nextHeight}px`;
  }, [prompt]);

  const previewSize = images.length <= 1 ? 100 : 55;

  return (
    <div className="absolute bottom-[50px] left-1/2 -translate-x-1/2 z-[40] w-[768px] bg-white border border-[#155DFC] rounded-[8px] p-[10px_8px] flex flex-col gap-[12px]">
      {images.length > 0 && (
        <div className="flex items-center gap-[8px] flex-wrap">
          {images.map((img, index) => (
            <div
              key={`${img.url}-${index}`}
              className="relative rounded-[8px] overflow-hidden"
              style={{ width: previewSize, height: previewSize }}
            >
              <img src={img.url} className="w-full h-full object-cover" />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-[4px] right-[4px] w-[16px] h-[16px] bg-black/60 rounded-full flex items-center justify-center"
              >
                <img src={Close} className="w-[10px] h-[10px]" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-col gap-[16px]">
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="AgentGo에게 물어보세요."
          className="w-full rounded-[8px] p-[10px] text-[14px] leading-[20px] max-h-[150px] overflow-y-auto resize-none outline-none"
          rows={1}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[6px]">
            <button
              onClick={handleOpenFile}
              disabled={isMaxImages}
              className={`text-[12px] leading-[19.88px] rounded-[4px] border px-[10px] py-[4px] transition-colors ${
                isMaxImages
                  ? "text-[#90A1B9] border-[#CAD5E2] cursor-not-allowed"
                  : "text-[#0F172B] border-[#CAD5E2] hover:bg-[#F8FAFF]"
              }`}
            >
              레퍼런스 첨부
            </button>
            {images.length > 0 && (
              <span
                className={`text-[12px] ${
                  isMaxImages ? "text-[#E7000B] font-medium" : "text-[#64748B]"
                }`}
              >
                {images.length}/10
              </span>
            )}
          </div>
          <button
            onClick={handleSend}
            disabled={!canSend}
            className={`w-[32px] h-[32px] rounded-[4px] flex items-center justify-center transition-colors ${
              canSend
                ? "bg-[#155DFC] hover:bg-[#0044CC]"
                : "bg-[#90A1B9] cursor-not-allowed"
            }`}
          >
            <span className="text-white text-[16px] leading-none">↑</span>
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.currentTarget.value = "";
          }}
        />
      </div>
    </div>
  );
};
