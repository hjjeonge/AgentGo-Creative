import type React from 'react';
import { CustomSwitch } from '../commons/CustomSwitch';
import Arrow from './../../assets/arrow_down.svg';

interface SettingsSwitchRowProps {
  label: string;
  // onToggle, initialState 등 추후 확장 가능
}

export const SettingsSwitchRow: React.FC<SettingsSwitchRowProps> = ({ label }) => {
  return (
    <div className="flex items-center justify-between p-[7px]">
      <div className="flex items-center justify-center gap-[4px]">
        <button className="flex items-center justify-center">
          <img src={Arrow} className="-rotate-90" />
        </button>
        <span>{label}</span>
      </div>
      <CustomSwitch />
    </div>
  );
};
