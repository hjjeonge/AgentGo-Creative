import type React from 'react';

interface Props {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

export const FormRow: React.FC<Props> = ({ label, required, children }) => (
  <div className="grid grid-cols-[80px_1fr] gap-10 items-start">
    <div className="whitespace-nowrap flex items-center gap-0.5">
      <span className="text-md font-bold text-text-primary">{label}</span>
      {required && <span className="text-[#E7000B]">*</span>}
    </div>
    <div className="flex-1">{children}</div>
  </div>
);
