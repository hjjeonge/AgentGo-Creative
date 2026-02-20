import type React from "react";
import { useEffect, useRef, useState } from "react";
import Close from "./../../assets/close-line.svg";

export const Prompt: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<{ file: File; url: string }[]>([]);

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
              className="absolute top-[5px] right-[3px] w-[12px] h-[12x] bg-black rounded-full text-white text-[12px] leading-[18px] text-center"
            >
              <img src={Close} />
            </button>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-[26px]">
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="AgentGo에게 물어보세요."
          className="w-full rounded-[8px] p-[10px] text-[14px] leading-[20px] max-h-[320px] overflow-y-auto resize-none"
          rows={1}
        />
        <div className="flex items-center justify-between">
          <button
            onClick={handleOpenFile}
            className="text-[14px] text-[#0F172B] leading-[19.88px] rounded-[4px] border border-[#CAD5E2]"
          >
            레퍼런스 첨부
          </button>
          <button className="w-[32px] h-[32px] rounded-[4px] bg-[#90A1B9]">
            -
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
