export const authQueryKeys = {
  all: ['auth'] as const,
  userProfile: () => [...authQueryKeys.all, 'userProfile'] as const,
};
