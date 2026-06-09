'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Don't track admin routes
    if (pathname?.startsWith('/admin')) return;

    const trackVisit = async () => {
      try {
        await fetch('/api/analytics/visit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page: pathname || '/',
            referrer: document.referrer || null,
            userAgent: navigator.userAgent || null,
          }),
        });
      } catch (error) {
        // Silently ignore tracking errors
        console.debug('Visit tracking error:', error);
      }
    };

    trackVisit();
  }, [pathname]);

  return null;
}
