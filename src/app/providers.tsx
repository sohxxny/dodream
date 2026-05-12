'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { OverlayProvider } from 'overlay-kit';
import { Tooltip } from 'radix-ui';
import type React from 'react';
import { queryClient } from '@/lib/query-client';
import { MSWProvider } from '@/mocks/msw-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MSWProvider>
      <QueryClientProvider client={queryClient}>
        <OverlayProvider>
          <Tooltip.Provider>
            {/* <NotificationProvider> */}
            {children}
            {/* </NotificationProvider> */}
            {process.env.NODE_ENV === 'development' && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}
          </Tooltip.Provider>
        </OverlayProvider>
      </QueryClientProvider>
    </MSWProvider>
  );
}
