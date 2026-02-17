'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui';
import toast from 'react-hot-toast';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  showBackLink?: boolean;
  backLinkText?: string;
  backLinkHref?: string;
  showMyBookings?: boolean;
  showBrowseEvents?: boolean;
  maxWidth?: 'max-w-7xl' | 'max-w-4xl';
}

export default function DashboardHeader({
  title,
  subtitle,
  showBackLink = false,
  backLinkText = '← Back to events',
  backLinkHref = '/events',
  showMyBookings = false,
  showBrowseEvents = false,
  maxWidth = 'max-w-7xl',
}: DashboardHeaderProps) {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
    toast.success('Logged out successfully');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className={`${maxWidth} mx-auto px-4 sm:px-6 lg:px-8 py-4`}>
        <div className="flex items-center justify-between">
          {/* Left side */}
          <div>
            {showBackLink ? (
              <Link
                href={backLinkHref}
                className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2"
              >
                {backLinkText}
              </Link>
            ) : (
              <>
                <h1 className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {title}
                </h1>
                {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
              </>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {user && !showBackLink && (
              <span className="text-sm text-gray-600 hidden sm:block">Welcome, {user.name}!</span>
            )}

            {showBrowseEvents && (
              <Button variant="secondary" onClick={() => router.push('/events')}>
                Browse Events
              </Button>
            )}
            
            {showMyBookings && (
              <Button variant="secondary" onClick={() => router.push('/bookings')}>
                My Bookings
              </Button>
            )}
            
            <Button variant="primary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
