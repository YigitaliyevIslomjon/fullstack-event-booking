// containers
import AuthProvider from '@/modules/auth/containers/AuthProvider';
// components
import { Toaster } from '@/components/toaster';
// styles
import '@/styles/globals.css';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
