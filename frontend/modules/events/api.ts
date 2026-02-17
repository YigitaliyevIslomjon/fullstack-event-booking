import apiClient from '@/services/api-client';
import { Event, EventsResponse } from '@/types';

export const getEvents = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}): Promise<EventsResponse> => {
  const response = await apiClient.get<EventsResponse>('/events', { params });
  return response.data;
};

export const getEvent = async (id: string): Promise<Event> => {
  const response = await apiClient.get<Event>(`/events/${id}`);
  return response.data;
};