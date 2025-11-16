'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const checkUser = useAuthStore((state) => state.checkUser);

  useEffect(() => {
    setMounted(true);
    checkUser();
  }, [checkUser]);

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}

