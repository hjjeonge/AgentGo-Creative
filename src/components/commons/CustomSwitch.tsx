import type React from "react";
import { Switch } from "../ui/switch";

interface Props {
  checked?: boolean;
  onCheckedChange?: (value: boolean) => void;
}

export const CustomSwitch: React.FC<Props> = ({
  checked,
  onCheckedChange,
}: Props) => {
  return <Switch checked={checked} onCheckedChange={onCheckedChange} />;
};
