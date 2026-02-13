import React, { forwardRef } from "react";
import { CustomTooltip } from "../commons/CustomTooltip";

interface ToolbarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: string;
  tooltip: string;
  isActive?: boolean;
}

export const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ icon, tooltip, isActive, className, ...props }, ref) => {
    const activeClass = isActive ? "bg-[#CAD5E2]" : "";

    return (
      <CustomTooltip content={tooltip}>
        <button
          ref={ref}
          className={`flex items-center justify-center cursor-pointer w-[40px] h-[40px] ${className} ${activeClass}`}
          {...props}
        >
          <img src={icon} alt={tooltip} />
        </button>
      </CustomTooltip>
    );
  },
);

ToolbarButton.displayName = "ToolbarButton";
