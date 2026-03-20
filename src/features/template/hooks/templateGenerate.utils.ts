export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const toDataUrl = (mimeType: string, imageBase64: string) =>
  `data:${mimeType};base64,${imageBase64}`;

export const compactLines = (lines: Array<string | undefined>) =>
  lines.map((line) => line?.trim()).filter(Boolean).join('\n');
