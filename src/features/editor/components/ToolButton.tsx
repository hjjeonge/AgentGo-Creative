import type React from 'react';

import { IconButton } from '@/commons/components/IconButton';

interface Props {
  toolName: string;
  onToolChange: (tool: string) => void;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  activeTool: string;
}

export const ToolButton: React.FC<Props> = ({
  toolName,
  onToolChange,
  icon,
  label,
  onClick,
  activeTool,
}: Props) => {
  return (
    <>
      <IconButton
        onClick={onClick || (() => onToolChange(toolName))}
        variant="neutral-outlined"
        className={`${activeTool === toolName ? '!bg-[#cad5e2]' : ''}`}
      >
        {icon}
      </IconButton>
      {(label === 'mouse' || label === 'crop' || label === 'eraser') && (
        <div className="w-[1px] h-6 bg-[#CAD5E2]" />
      )}
    </>
  );
};
