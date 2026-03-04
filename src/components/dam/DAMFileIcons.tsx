import type React from "react";

export type FileType = "folder" | "video" | "pdf" | "zip" | "image" | "other";

export const FolderIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <path
      d="M2 5C2 4.45 2.45 4 3 4H7.5L9 5.5H17C17.55 5.5 18 5.95 18 6.5V15C18 15.55 17.55 16 17 16H3C2.45 16 2 15.55 2 15V5Z"
      fill="#3B82F6"
    />
  </svg>
);

export const VideoIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <rect x="2" y="4" width="16" height="12" rx="2" fill="#64748B" />
    <path d="M8 7.5L14 10L8 12.5V7.5Z" fill="white" />
  </svg>
);

export const PdfIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <rect x="3" y="2" width="14" height="16" rx="2" fill="#64748B" />
    <rect x="5" y="2" width="10" height="5" rx="1" fill="#94A3B8" />
    <text x="5" y="14" fontSize="5" fill="white" fontWeight="bold">PDF</text>
  </svg>
);

export const ZipIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <rect x="3" y="2" width="14" height="16" rx="2" fill="#475569" />
    <rect x="8" y="2" width="4" height="2" fill="#94A3B8" />
    <rect x="8" y="6" width="4" height="2" fill="#94A3B8" />
    <rect x="8" y="10" width="4" height="2" fill="#94A3B8" />
    <circle cx="10" cy="15" r="2" fill="#CBD5E1" />
  </svg>
);

export const ImageIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <rect x="2" y="4" width="16" height="12" rx="2" fill="#64748B" />
    <circle cx="7" cy="8" r="1.5" fill="#CBD5E1" />
    <path d="M2 13L6 9L9 12L13 8L18 13" stroke="#CBD5E1" strokeWidth="1.2" fill="none" />
  </svg>
);

export const OtherIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8" fill="#64748B" />
    <circle cx="6" cy="10" r="1.2" fill="white" />
    <circle cx="10" cy="10" r="1.2" fill="white" />
    <circle cx="14" cy="10" r="1.2" fill="white" />
  </svg>
);

export const FileIcon: React.FC<{ type: FileType; size?: number }> = ({ type, size = 20 }) => {
  switch (type) {
    case "folder": return <FolderIcon size={size} />;
    case "video":  return <VideoIcon size={size} />;
    case "pdf":    return <PdfIcon size={size} />;
    case "zip":    return <ZipIcon size={size} />;
    case "image":  return <ImageIcon size={size} />;
    default:       return <OtherIcon size={size} />;
  }
};