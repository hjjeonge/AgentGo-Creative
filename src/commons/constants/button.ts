import type { CSSProperties } from 'react';

import { Neutral, Primary } from '@/commons/theme/semantic';
import type {
  ButtonSize,
  ButtonState,
  ButtonVariant,
} from '@/commons/types/button';

export const buttonSizeStyles: Record<ButtonSize, CSSProperties> = {
  sm: {
    height: '32px',
    padding: '2px 12px',
    gap: '6px',
  },
  md: {
    height: '40px',
    padding: '4px 16px',
    gap: '8px',
  },
  lg: {
    height: '44px',
    padding: '4px 20px',
    gap: '10px',
  },
};

export const buttonVariantStyles: Record<
  ButtonVariant,
  Record<ButtonState, CSSProperties>
> = {
  'primary-solid': {
    enabled: {
      backgroundColor: Primary.solid.bg,
      color: Primary.solid.color,
      borderColor: 'transparent',
    },
    hover: {
      backgroundColor: Primary.solid.hoverBg,
      color: Primary.solid.color,
      borderColor: 'transparent',
    },
    active: {
      backgroundColor: Primary.solid.activeBg,
      color: Primary.solid.color,
      borderColor: 'transparent',
    },
    disabled: {
      backgroundColor: Primary.solid.disabledBg,
      color: Primary.solid.disabledColor,
      borderColor: 'transparent',
    },
  },
  'neutral-solid': {
    enabled: {
      backgroundColor: Neutral.solid.bg,
      color: Neutral.solid.color,
      borderColor: 'transparent',
    },
    hover: {
      backgroundColor: Neutral.solid.hoverBg,
      color: Neutral.solid.color,
      borderColor: 'transparent',
    },
    active: {
      backgroundColor: Neutral.solid.activeBg,
      color: Neutral.solid.color,
      borderColor: 'transparent',
    },
    disabled: {
      backgroundColor: Neutral.solid.disabledBg,
      color: Neutral.solid.disabledColor,
      borderColor: 'transparent',
    },
  },
  'primary-outlined': {
    enabled: {
      backgroundColor: Primary.solid.color,
      color: Primary.outlined.color,
      borderColor: Primary.outlined.border,
    },
    hover: {
      backgroundColor: Primary.outlined.hoverBg,
      color: Primary.outlined.color,
      borderColor: Primary.outlined.border,
    },
    active: {
      backgroundColor: Primary.outlined.activeBg,
      color: Primary.outlined.color,
      borderColor: Primary.outlined.border,
    },
    disabled: {
      backgroundColor: Primary.outlined.bg,
      color: Primary.outlined.disabledColor,
      borderColor: Primary.outlined.disabledBorder,
    },
  },
  'neutral-outlined': {
    enabled: {
      backgroundColor: Neutral.solid.color,
      color: Neutral.outlined.color,
      borderColor: Neutral.outlined.border,
    },
    hover: {
      backgroundColor: Neutral.outlined.hoverBg,
      color: Neutral.outlined.color,
      borderColor: Neutral.outlined.border,
    },
    active: {
      backgroundColor: Neutral.outlined.activeBg,
      color: Neutral.outlined.color,
      borderColor: Neutral.outlined.border,
    },
    disabled: {
      backgroundColor: Neutral.outlined.disabledBg,
      color: Neutral.outlined.disabledColor,
      borderColor: Neutral.outlined.disabledBorder,
    },
  },
  'primary-plain': {
    enabled: {
      backgroundColor: 'transparent',
      color: Primary.plain.color,
      borderColor: 'transparent',
    },
    hover: {
      backgroundColor: Primary.plain.hoverBg,
      color: Primary.plain.color,
      borderColor: 'transparent',
    },
    active: {
      backgroundColor: Primary.plain.activeBg,
      color: Primary.plain.color,
      borderColor: 'transparent',
    },
    disabled: {
      backgroundColor: 'transparent',
      color: Primary.plain.disabledColor,
      borderColor: 'transparent',
    },
  },
  'neutral-plain': {
    enabled: {
      backgroundColor: 'transparent',
      color: Neutral.plain.color,
      borderColor: 'transparent',
    },
    hover: {
      backgroundColor: Neutral.plain.hoverBg,
      color: Neutral.plain.color,
      borderColor: 'transparent',
    },
    active: {
      backgroundColor: Neutral.plain.activeBg,
      color: Neutral.plain.color,
      borderColor: 'transparent',
    },
    disabled: {
      backgroundColor: 'transparent',
      color: Neutral.plain.disabledColor,
      borderColor: 'transparent',
    },
  },
} as const;
