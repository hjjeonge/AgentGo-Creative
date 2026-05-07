import { Switch } from '@/components/ui/switch';

import type React from 'react';

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
