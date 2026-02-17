'use client';

import { Toaster as HotToaster } from 'react-hot-toast';

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'var(--toast-bg)',
          color: 'var(--toast-text)',
        },
        success: {
          iconTheme: {
            primary: 'var(--toast-success)',
            secondary: 'var(--toast-icon-bg)',
          },
        },
        error: {
          iconTheme: {
            primary: 'var(--toast-error)',
            secondary: 'var(--toast-icon-bg)',
          },
        },
      }}
    />
  );
}
