import type { FileType } from "./DAMFileIcons";

export interface DAMFile {
  id: string;
  type: FileType;
  name: string;
  person: string;
  size: string;
  modifiedAt: string;
  thumbnail?: string;
  url?: string;
  folder?: string;
  referenceImages?: string[];
}

export const MOCK_FILES: DAMFile[] = [
  {
    id: "1",
    type: "folder",
    name: "2026",
    person: "James Rodriguez",
    size: "-",
    modifiedAt: "2026.01.02 오전 11:30",
  },
  {
    id: "2",
    type: "folder",
    name: "Natalie Clark Sarah Williams...",
    person: "Isabella Anderson",
    size: "-",
    modifiedAt: "2026.01.02 오전 11:30",
  },
  {
    id: "3",
    type: "image",
    name: "Natalie Clark.jpg",
    person: "Natalie Clark",
    size: "328.5MB",
    modifiedAt: "2026.01.02 오전 11:30",
    folder: "2026",
    thumbnail:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop&q=60",
    referenceImages: [
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=200&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&auto=format&fit=crop&q=60",
    ],
  },
  {
    id: "4",
    type: "image",
    name: "Natalie Clark Sarah Williams...",
    person: "Isabella Anderson",
    size: "196KB",
    modifiedAt: "2026.01.02 오전 11:30",
    folder: "2026",
    thumbnail:
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&auto=format&fit=crop&q=60",
  },
  {
    id: "5",
    type: "image",
    name: "Natalie Clark Sarah Williams...",
    person: "Sophia Hernandez",
    size: "2.5MB",
    modifiedAt: "2026.01.02 오전 11:30",
    thumbnail:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&auto=format&fit=crop&q=60",
  },
  {
    id: "6",
    type: "video",
    name: "David Garcia.mp4",
    person: "Isabella Anderson",
    size: "7.2GB",
    modifiedAt: "2026.01.02 오전 11:30",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "7",
    type: "pdf",
    name: "Isabella Anderson.pdf",
    person: "Isabella Anderson I...",
    size: "196KB",
    modifiedAt: "2026.01.02 오전 11:30",
    url: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/sample.pdf",
  },
  {
    id: "8",
    type: "video",
    name: "Sarah.mp4",
    person: "Sophia Hernandez",
    size: "2.5MB",
    modifiedAt: "2026.01.02 오전 11:30",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "9",
    type: "pdf",
    name: "Williams.pdf",
    person: "Richard Thompson",
    size: "10KB",
    modifiedAt: "2026.01.02 오전 11:30",
  },
  {
    id: "10",
    type: "zip",
    name: "Clark.zip",
    person: "Natalie Clark",
    size: "45MB",
    modifiedAt: "2026.01.02 오전 11:30",
  },
  {
    id: "11",
    type: "other",
    name: "Sarah Williams Natalie",
    person: "Sarah Williams",
    size: "8KB",
    modifiedAt: "2026.01.02 오전 11:30",
  },
];