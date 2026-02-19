import type React from "react";

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
    <button
      title={label}
      onClick={onClick || (() => onToolChange(toolName))}
      className={`w-[54px] h-[54px] p-[10px] flex items-center justify-center ${
        activeTool === toolName
          ? "border border-[#1447E6] bg-[#EFF6FF] text-[#155DFC] rounded-[6px]"
          : "hover:bg-gray-100 rounded-[6px]"
      }`}
    >
      {icon}
    </button>
  );
};
