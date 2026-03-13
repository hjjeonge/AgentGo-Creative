export const templateQueryKeys = {
  all: ['template'] as const,
  favorite: () => [...templateQueryKeys.all, 'favorite'] as const,
};
