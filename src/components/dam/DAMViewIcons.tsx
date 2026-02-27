import type React from "react";

export const GridViewIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="1" y="1" width="6" height="6" rx="1" stroke={active ? "#155DFC" : "#64748B"} strokeWidth="1.5" />
    <rect x="11" y="1" width="6" height="6" rx="1" stroke={active ? "#155DFC" : "#64748B"} strokeWidth="1.5" />
    <rect x="1" y="11" width="6" height="6" rx="1" stroke={active ? "#155DFC" : "#64748B"} strokeWidth="1.5" />
    <rect x="11" y="11" width="6" height="6" rx="1" stroke={active ? "#155DFC" : "#64748B"} strokeWidth="1.5" />
  </svg>
);

export const ListViewIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <line x1="1" y1="4" x2="17" y2="4" stroke={active ? "#155DFC" : "#64748B"} strokeWidth="1.5" strokeLinecap="round" />
    <line x1="1" y1="9" x2="17" y2="9" stroke={active ? "#155DFC" : "#64748B"} strokeWidth="1.5" strokeLinecap="round" />
    <line x1="1" y1="14" x2="17" y2="14" stroke={active ? "#155DFC" : "#64748B"} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const SearchIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="7" cy="7" r="5" stroke="#94A3B8" strokeWidth="1.5" />
    <path d="M11 11L14 14" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const DownloadIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 2V11M8 11L5 8M8 11L11 8" stroke="#475569" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 13H14" stroke="#475569" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const RenameIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M11 2L14 5L5 14H2V11L11 2Z" stroke="#475569" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);
