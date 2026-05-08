export type PaletteScale =
  | 20
  | 50
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900;

type PaletteRecord<T extends string> = Record<`${T}-${PaletteScale}`, string>;

/** Neutral */
export type NeutralKey = `neutral-${PaletteScale}`;
export const Neutral_Palette: PaletteRecord<'neutral'> = {
  'neutral-20': '#F8FAFC',
  'neutral-50': '#F1F5F9',
  'neutral-100': '#e2e8f0',
  'neutral-200': '#cad5e2',
  'neutral-300': '#90a1b9',
  'neutral-400': '#62748e',
  'neutral-500': '#45556c',
  'neutral-600': '#314158',
  'neutral-700': '#1d293d',
  'neutral-800': '#0f172b',
  'neutral-900': '#020618',
} as const;

/** Primary */
export type PrimaryKey = `primary-${PaletteScale}`;
export const Primary_Palette: PaletteRecord<'primary'> = {
  'primary-20': '#eff6ff',
  'primary-50': '#dbeafe',
  'primary-100': '#bedbff',
  'primary-200': '#8ec5ff',
  'primary-300': '#51a2ff',
  'primary-400': '#2b7fff',
  'primary-500': '#155dfc',
  'primary-600': '#1447e6',
  'primary-700': '#193cb8',
  'primary-800': '#1c398e',
  'primary-900': '#162456',
} as const;

/** Secondary 01 */
export type Secondary01Key = `secondary01-${PaletteScale}`;
export const Secondary01_Palette: PaletteRecord<'secondary01'> = {
  'secondary01-20': '#F7FEFD',
  'secondary01-50': '#cbfbf1',
  'secondary01-100': '#96f7e4',
  'secondary01-200': '#46ecd5',
  'secondary01-300': '#00d5be',
  'secondary01-400': '#00bba7',
  'secondary01-500': '#009689',
  'secondary01-600': '#00786f',
  'secondary01-700': '#005f5a',
  'secondary01-800': '#0b4f4a',
  'secondary01-900': '#022f2e',
} as const;

/** Secondary 02 */
export type Secondary02Key = `secondary02-${PaletteScale}`;
export const Secondary02_Palette: PaletteRecord<'secondary02'> = {
  'secondary02-20': '#f0f9ff',
  'secondary02-50': '#dff2fe',
  'secondary02-100': '#b8e6fe',
  'secondary02-200': '#74d4ff',
  'secondary02-300': '#00bcff',
  'secondary02-400': '#00a6f4',
  'secondary02-500': '#0084d1',
  'secondary02-600': '#0069a8',
  'secondary02-700': '#00598a',
  'secondary02-800': '#024a70',
  'secondary02-900': '#052f4a',
} as const;

/** Secondary 03 */
export type Secondary03Key = `secondary03-${PaletteScale}`;
export const Secondary03_Palette: PaletteRecord<'secondary03'> = {
  'secondary03-20': '#eef2ff',
  'secondary03-50': '#e0e7ff',
  'secondary03-100': '#c6d2ff',
  'secondary03-200': '#a3b3ff',
  'secondary03-300': '#7c86ff',
  'secondary03-400': '#615fff',
  'secondary03-500': '#4f39f6',
  'secondary03-600': '#432dd7',
  'secondary03-700': '#372aac',
  'secondary03-800': '#312c85',
  'secondary03-900': '#1e1a4d',
} as const;

/** Success */
export type SuccessKey = `success-${PaletteScale}`;
export const Success_Palette: PaletteRecord<'success'> = {
  'success-20': '#ecfdf5',
  'success-50': '#d0fae5',
  'success-100': '#a4f4cf',
  'success-200': '#00d492',
  'success-300': '#00d492',
  'success-400': '#00BC7D',
  'success-500': '#009966',
  'success-600': '#007a55',
  'success-700': '#006045',
  'success-800': '#004f3b',
  'success-900': '#002c22',
} as const;

/** Danger */
export type DangerKey = `danger-${PaletteScale}`;
export const Danger_Palette: PaletteRecord<'danger'> = {
  'danger-20': '#fef2f2',
  'danger-50': '#ffe2e2',
  'danger-100': '#ffc9c9',
  'danger-200': '#ffa2a2',
  'danger-300': '#ff6467',
  'danger-400': '#fb2c36',
  'danger-500': '#e7000b',
  'danger-600': '#c10007',
  'danger-700': '#9f0712',
  'danger-800': '#82181a',
  'danger-900': '#460809',
} as const;

/** Warning */
export type WarningKey = `warning-${PaletteScale}`;
export const Warning_Palette: PaletteRecord<'warning'> = {
  'warning-20': '#fffbeb',
  'warning-50': '#fef3c6',
  'warning-100': '#fee685',
  'warning-200': '#ffd230',
  'warning-300': '#ffba00',
  'warning-400': '#fd9a00',
  'warning-500': '#e17100',
  'warning-600': '#bb4d00',
  'warning-700': '#973c00',
  'warning-800': '#7b3306',
  'warning-900': '#461901',
} as const;

/** Common */
export type CommonKey = 'transparent' | 'white' | 'black';

export const Common_Palette: Record<CommonKey, string> = {
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export const Palette = {
  Neutral_Palette,
  Primary_Palette,
  Secondary01_Palette,
  Secondary02_Palette,
  Secondary03_Palette,
  Success_Palette,
  Danger_Palette,
  Warning_Palette,
  Common_Palette,
} as const;

export type PaletteType = typeof Palette;
