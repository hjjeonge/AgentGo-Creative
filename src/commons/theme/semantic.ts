import {
  Common_Palette,
  Danger_Palette,
  Neutral_Palette,
  Primary_Palette,
  Success_Palette,
  Warning_Palette,
} from './palette';

export const Focus = {
  focusVisible: Primary_Palette['primary-500'],
} as const;

export const Background = {
  backdrop: 'rgba(18,20,22,0.25)', // #121416 · 25%
  body: Common_Palette.white,
  level0: Neutral_Palette['neutral-50'],
  level1: Neutral_Palette['neutral-100'],
  level2: Neutral_Palette['neutral-200'],
  level3: Neutral_Palette['neutral-300'],
  popup: Common_Palette.white,
  surface: Neutral_Palette['neutral-20'],
  tooltip: Neutral_Palette['neutral-500'],
} as const;

export type TextKey =
  | 'text-primary'
  | 'text-secondary'
  | 'text-tertiary'
  | 'text-icon';

export const Text_Palette: Record<TextKey, string> = {
  'text-primary': Neutral_Palette['neutral-800'],
  'text-secondary': Neutral_Palette['neutral-600'],
  'text-tertiary': Neutral_Palette['neutral-500'],
  'text-icon': Neutral_Palette['neutral-500'],
} as const;

export const Text = {
  icon: Text_Palette['text-icon'],
  primary: Text_Palette['text-primary'],
  secondary: Text_Palette['text-secondary'],
  tertiary: Text_Palette['text-tertiary'],
} as const;

export const Danger = {
  outlined: {
    activeBg: Danger_Palette['danger-100'],
    border: Danger_Palette['danger-200'],
    color: Danger_Palette['danger-500'],
    disabledBorder: Neutral_Palette['neutral-200'],
    disabledColor: Neutral_Palette['neutral-300'],
    hoverBg: Danger_Palette['danger-50'],
    bg: Danger_Palette['danger-50'],
  },
  plain: {
    activeBg: Danger_Palette['danger-100'],
    color: Danger_Palette['danger-500'],
    disabledColor: Neutral_Palette['neutral-400'],
    hoverBg: Danger_Palette['danger-50'],
  },
  soft: {
    activeBg: Danger_Palette['danger-300'],
    activeColor: Danger_Palette['danger-800'],
    bg: Danger_Palette['danger-50'],
    color: Danger_Palette['danger-700'],
    disabledBg: Neutral_Palette['neutral-50'],
    disabledColor: Neutral_Palette['neutral-400'],
    hoverBg: Danger_Palette['danger-200'],
  },
  solid: {
    activeBg: Danger_Palette['danger-700'],
    bg: Danger_Palette['danger-500'],
    color: Common_Palette.white,
    disabledBg: Neutral_Palette['neutral-100'],
    disabledColor: Neutral_Palette['neutral-400'],
    hoverBg: Danger_Palette['danger-600'],
  },
} as const;

export const Neutral = {
  outlined: {
    activeBg: Neutral_Palette['neutral-200'],
    border: Neutral_Palette['neutral-200'],
    color: Neutral_Palette['neutral-700'],
    disabledBorder: Neutral_Palette['neutral-200'],
    disabledColor: Neutral_Palette['neutral-300'],
    hoverBg: Neutral_Palette['neutral-100'],
    disabledBg: Neutral_Palette['neutral-50'],
    bg: Neutral_Palette['neutral-50'],
  },
  plain: {
    activeBg: Neutral_Palette['neutral-100'],
    color: Neutral_Palette['neutral-700'],
    disabledColor: Neutral_Palette['neutral-400'],
    hoverBg: Neutral_Palette['neutral-50'],
    hoverColor: Neutral_Palette['neutral-900'],
  },
  soft: {
    activeBg: Neutral_Palette['neutral-300'],
    activeColor: Neutral_Palette['neutral-800'],
    bg: Neutral_Palette['neutral-100'],
    color: Neutral_Palette['neutral-700'],
    disabledBg: Neutral_Palette['neutral-50'],
    disabledColor: Neutral_Palette['neutral-300'],
    hoverBg: Neutral_Palette['neutral-200'],
  },
  solid: {
    activeBg: Neutral_Palette['neutral-700'],
    bg: Neutral_Palette['neutral-500'],
    color: Common_Palette.white,
    disabledBg: Neutral_Palette['neutral-100'],
    disabledColor: Neutral_Palette['neutral-400'],
    hoverBg: Neutral_Palette['neutral-600'],
  },
} as const;
export const Primary = {
  outlined: {
    activeBg: Primary_Palette['primary-200'],
    border: Primary_Palette['primary-300'],
    color: Primary_Palette['primary-600'],
    disabledBorder: Neutral_Palette['neutral-200'],
    disabledColor: Neutral_Palette['neutral-300'],
    hoverBg: Primary_Palette['primary-50'],
    bg: Primary_Palette['primary-50'],
  },
  plain: {
    activeBg: Primary_Palette['primary-50'],
    color: Primary_Palette['primary-600'],
    disabledColor: Neutral_Palette['neutral-400'],
    hoverBg: Primary_Palette['primary-20'],
  },
  soft: {
    activeBg: Primary_Palette['primary-300'],
    activeColor: Primary_Palette['primary-800'],
    bg: Primary_Palette['primary-50'],
    color: Primary_Palette['primary-700'],
    disabledBg: Neutral_Palette['neutral-50'],
    disabledColor: Neutral_Palette['neutral-400'],
    hoverBg: Primary_Palette['primary-100'],
  },
  solid: {
    activeBg: Primary_Palette['primary-800'],
    bg: Primary_Palette['primary-600'],
    color: Common_Palette.white,
    disabledBg: Neutral_Palette['neutral-100'],
    disabledColor: Neutral_Palette['neutral-400'],
    hoverBg: Primary_Palette['primary-700'],
  },
} as const;

export const Success = {
  outlined: {
    activeBg: Success_Palette['success-100'],
    border: Success_Palette['success-200'],
    color: Success_Palette['success-500'],
    disabledBorder: Neutral_Palette['neutral-200'],
    disabledColor: Neutral_Palette['neutral-300'],
    hoverBg: Success_Palette['success-50'],
    bg: Success_Palette['success-50'],
  },
  plain: {
    activeBg: Success_Palette['success-50'],
    color: Success_Palette['success-500'],
    disabledColor: Neutral_Palette['neutral-400'],
    hoverBg: Success_Palette['success-20'],
  },
  soft: {
    activeBg: Success_Palette['success-200'],
    activeColor: Success_Palette['success-800'],
    bg: Success_Palette['success-50'],
    color: Success_Palette['success-700'],
    disabledBg: Neutral_Palette['neutral-50'],
    disabledColor: Neutral_Palette['neutral-400'],
    hoverBg: Success_Palette['success-100'],
  },
  solid: {
    activeBg: Success_Palette['success-700'],
    bg: Success_Palette['success-500'],
    color: Common_Palette.white,
    disabledBg: Neutral_Palette['neutral-100'],
    disabledColor: Neutral_Palette['neutral-400'],
    hoverBg: Success_Palette['success-600'],
  },
} as const;

export const Warning = {
  outlined: {
    activeBg: Warning_Palette['warning-100'],
    border: Warning_Palette['warning-200'],
    color: Warning_Palette['warning-500'],
    disabledBorder: Neutral_Palette['neutral-200'],
    disabledColor: Neutral_Palette['neutral-300'],
    hoverBg: Warning_Palette['warning-50'],
    bg: Warning_Palette['warning-50'],
  },
  plain: {
    activeBg: Warning_Palette['warning-50'],
    color: Warning_Palette['warning-500'],
    disabledColor: Neutral_Palette['neutral-400'],
    hoverBg: Warning_Palette['warning-20'],
  },
  soft: {
    activeBg: Warning_Palette['warning-200'],
    activeColor: Warning_Palette['warning-800'],
    bg: Warning_Palette['warning-50'],
    color: Warning_Palette['warning-700'],
    disabledBg: Neutral_Palette['neutral-50'],
    disabledColor: Neutral_Palette['neutral-400'],
    hoverBg: Warning_Palette['warning-100'],
  },
  solid: {
    activeBg: Warning_Palette['warning-700'],
    bg: Warning_Palette['warning-500'],
    color: Common_Palette.white,
    disabledBg: Neutral_Palette['neutral-100'],
    disabledColor: Neutral_Palette['neutral-400'],
    hoverBg: Warning_Palette['warning-600'],
  },
} as const;

export const Semantic = {
  Background,
  Text,
  Focus,
  Danger,
  Neutral,
  Primary,
  Success,
  Warning,
} as const;
