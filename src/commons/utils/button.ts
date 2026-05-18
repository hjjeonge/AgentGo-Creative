import type { ButtonState } from '@/commons/types/button';

export const getInteractionState = (
  disabled: boolean,
  hovered: boolean,
  pressed: boolean,
  selected: boolean,
): ButtonState => {
  if (disabled) return 'disabled';
  if (pressed || selected) return 'active';
  if (hovered) return 'hover';
  return 'enabled';
};
