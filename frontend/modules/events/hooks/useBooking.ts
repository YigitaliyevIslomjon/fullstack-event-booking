'use client';

import { useState, useCallback } from 'react';
import { createBooking } from '@/modules/bookings/api';
import toast from 'react-hot-toast';

const BOOKING_STATE_RESET_MS = 2000;

export type BookingState = 'idle' | 'loading' | 'success' | 'error';

export function useEventBooking(onRefresh: () => Promise<void>) {

  const [bookingStates, setBookingStates] = useState<Record<string, BookingState>>({});

  const setState = useCallback((eventId: string, state: BookingState) => {
    setBookingStates((prev) => ({ ...prev, [eventId]: state }));
  }, []);

  const handleBooking = useCallback(
    async (eventId: string) => {
      setState(eventId, 'loading');

      try {
        const response = await createBooking(eventId);
        setState(eventId, 'success');
        toast.success(`Successfully booked ${response.event.title}!`);
        setTimeout(() => setState(eventId, 'idle'), BOOKING_STATE_RESET_MS);
      } catch (error: unknown) {
        setState(eventId, 'error');
        const message =
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Booking failed';

        if (message.includes('No tickets available') || message.includes('sold out')) {
          toast.error('Sorry, tickets for this event are no longer available.');
          await onRefresh();
        } else if (message.includes('Already booked')) {
          toast.error('You have already booked this event.');
        } else {
          toast.error('Failed to complete booking. Please try again.');
        }
        setTimeout(() => setState(eventId, 'idle'), BOOKING_STATE_RESET_MS);
      }
    },
    [onRefresh, setState]
  );

  return { bookingStates, handleBooking };
}
