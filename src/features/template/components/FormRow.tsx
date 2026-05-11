import type React from 'react';

interface Props {
  label?: string;
  required?: boolean;
  children: React.ReactNode;
}

export const FormRow: React.FC<Props> = ({ label, required, children }) => (
  <div
    className={`grid ${label ? 'grid-cols-[80px_minmax(0,1fr)]' : 'grid-cols-1'} gap-10 items-start`}
  >
    {label && (
      <div className="whitespace-nowrap flex items-center gap-0.5">
        <span className="text-md font-bold text-text-primary">{label}</span>
        {required && <span className="text-[#E7000B]">*</span>}
      </div>
    )}
    <div className="min-w-0 flex-1">{children}</div>
  </div>
);
