import type React from "react";

interface Props {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

export const FormRow: React.FC<Props> = ({ label, required, children }) => (
  <div className="flex gap-[24px]">
    <div className="w-[80px] shrink-0">
      <span className="text-[14px] text-[#475569]">
        {required && <span className="text-[#E11D48]">*</span>}
        {label}
      </span>
    </div>
    <div className="flex-1">{children}</div>
  </div>
);
