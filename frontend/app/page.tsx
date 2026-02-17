'use client';
// core
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  // hooks
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, []);

  return null;

}
