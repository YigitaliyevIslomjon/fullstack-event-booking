import apiClient from '@/services/api-client';
import { Booking, Event } from '@/services/types';

export const createBooking = async (eventId: string): Promise<{ booking: Booking; event: Event }> => {
  const response = await apiClient.post<{ booking: Booking; event: Event }>('/bookings', {
    eventId,
  });
  return response.data;
};

export const getBookings = async (): Promise<Booking[]> => {
  const response = await apiClient.get<Booking[]>('/bookings');
  return response.data;
};

export const cancelBooking = async (bookingId: string): Promise<Booking> => {
  const response = await apiClient.delete<Booking>(`/bookings/${bookingId}`);
  return response.data;
};