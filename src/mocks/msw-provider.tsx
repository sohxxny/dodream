'use client';

import { useEffect, useState } from 'react';

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [isMswReady, setIsMswReady] = useState(
    process.env.NEXT_PUBLIC_USE_MOCK !== 'true',
  );

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_USE_MOCK !== 'true') {
      setIsMswReady(true);
      return;
    }

    const enableMocking = async () => {
      const { worker } = await import('@/mocks/browser');
      await worker.start({
        onUnhandledRequest: 'bypass',
      });
      setIsMswReady(true);
    };

    enableMocking();
  }, []);

  if (!isMswReady) {
    return null;
  }

  return <>{children}</>;
}
