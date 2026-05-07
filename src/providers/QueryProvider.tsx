import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '@/lib/queryClient';

import type { PropsWithChildren } from 'react';

export const QueryProvider = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
