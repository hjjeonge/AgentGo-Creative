export const projectQueryKeys = {
  all: ['project'] as const,
  recent: () => [...projectQueryKeys.all, 'recent'] as const,
};
