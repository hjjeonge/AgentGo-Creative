export const projectQueryKeys = {
  all: ['project'] as const,
  recent: () => [...projectQueryKeys.all, 'recent'] as const,
  detail: (projectId: string) =>
    [...projectQueryKeys.all, 'detail', projectId] as const,
  history: (projectId: string) =>
    [...projectQueryKeys.all, 'history', projectId] as const,
};
