'use client';

// core
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// components
import DashboardHeader from '@/components/layouts/DashboardHeader';
import { Icon } from '@/components/Icons';
import { Button } from '@/components/ui';
// api
import { getBookings, cancelBooking } from '@/modules/bookings/api';
// utils
import toast from 'react-hot-toast';
import { formatEventDate, formatEventTime } from '@/lib/utils';
// types
import { Booking } from '@/services/types';

export default function BookingsPage() {

  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState<string | null>(null);


  const fetchBookings = async () => {
    try {
      const data = await getBookings();
      setBookings(data);
    } catch (error: any) {
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    setCancellingId(bookingId);

    try {
      await cancelBooking(bookingId);
      fetchBookings();
      toast.success('Booking cancelled successfully');
      setShowConfirm(null);
    } catch (error: any) {
      toast.error('Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };


  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100">
      <DashboardHeader
        title="My Bookings"
        subtitle="Manage your event bookings"
        showBrowseEvents
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Icon name="Spinner" className="h-12 w-12 text-indigo-600" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎫</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600 mb-6">Start booking amazing events!</p>
            <Button variant="primary" size="lg" onClick={() => router.push('/events')}>
              Browse Events
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Confirmed Bookings */}
            {bookings.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Active Bookings ({bookings.length})</h2>
                <div className="grid grid-cols-1 gap-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {booking.event?.title}
                          </h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Icon name="Calendar" className="w-4 h-4 mr-2 text-indigo-600" />
                              {booking.event && `${formatEventDate(booking.event.date)} at ${formatEventTime(booking.event.date)}`}
                            </div>
                            <div className="flex items-center">
                              <Icon name="MapPin" className="w-4 h-4 mr-2 text-indigo-600" />
                              {booking.event?.venue}
                            </div>
                            <div className="text-xs text-gray-500 mt-2">
                              Booked on {formatEventDate(booking.createdAt)}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="text-2xl font-bold text-indigo-600">
                            ${booking.event?.price.toFixed(2)}
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-green-500">
                            Confirmed
                          </span>
                          {showConfirm === booking.id ? (
                            <div className="flex gap-2">
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleCancelBooking(booking.id)}
                                loading={cancellingId === booking.id}
                              >
                                {cancellingId === booking.id ? 'Cancelling...' : 'Confirm Cancel'}
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => setShowConfirm(null)}>
                                Keep
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="danger-light"
                              size="sm"
                              onClick={() => setShowConfirm(booking.id)}
                            >
                              Cancel Booking
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
