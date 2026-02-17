'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';

import DashboardHeader from '@/components/layouts/DashboardHeader';
import { Icon } from '@/components/Icons';
import { Button } from '@/components/ui';
import TicketBadge from '@/app/(dashboard)/events/components/TicketBadge';
import { formatEventDateTime } from '@/lib/utils';

import { Event } from '@/services/types';
import { getEvent } from '@/modules/events/api';
import { createBooking } from '@/modules/bookings/api';

type BookingState = 'idle' | 'loading';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [bookingState, setBookingState] = useState<BookingState>('idle');

  const handleBook = async () => {
    if (!event) return;

    try {
      setBookingState('loading');
      const response = await createBooking(event.id);
      setEvent(response.event);
      toast.success(`Booked: ${response.event.title}`);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Booking failed';
      toast.error(message);
    } finally {
      setBookingState('idle');
    }
  };

  const isSoldOut = event?.remainingTickets === 0;

  useEffect(() => {
    if (!id) return;

    const loadEvent = async () => {
      setLoading(true);
      try {
        const data = await getEvent(id);
        setEvent(data);
      } catch {
        toast.error('Event not found');
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-100">
      <DashboardHeader title="Event Details" showBackLink showMyBookings />
      <main className="max-w-4xl mx-auto py-10 px-6 mt-10">
        {loading && (
          <div className="flex justify-center py-20">Loading...</div>
        )}
        {!loading && !event && (
          <div className="text-center py-20">Event not found</div>
        )}
        {!loading && event && (
          <div className="bg-white rounded-2xl shadow p-8 space-y-6">
            <h1 className="text-3xl font-bold">{event.title}</h1>

            <p className="text-gray-600 whitespace-pre-wrap">
              {event.description}
            </p>

            <div className="space-y-2 text-gray-700">
              <div className="flex items-center gap-2">
                <Icon name="Calendar" />
                <span>{formatEventDateTime(event.date)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Icon name="MapPin" />
                <span>{event.venue}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-indigo-600">
                ${event.price.toFixed(2)}
              </span>

              <TicketBadge
                remainingTickets={event.remainingTickets}
                totalTickets={event.totalTickets}
                unit="tickets"
                className="text-sm"
              />
            </div>

            <Button
              size="lg"
              disabled={isSoldOut || bookingState === 'loading'}
              onClick={handleBook}
              loading={bookingState === 'loading'}
            >
              {isSoldOut ? 'Sold Out' : 'Book Now'}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}