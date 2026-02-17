'use client';

import { useState, useRef } from 'react';
import { getEvents } from '@/modules/events/api';
import toast from 'react-hot-toast';
import { FILTER_SORT_BY, FILTER_SORT_ORDER } from '@/modules/events/constants';
import { Event } from '@/types';

const LIMIT = 10;

export function useEventsData(
  page: number,
  search: string,
  sortBy: FILTER_SORT_BY,
  sortOrder: FILTER_SORT_ORDER
) {

  const [events, setEvents] = useState<Event[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const hasLoadedOnce = useRef(false);

  const fetchEvents = async (silent = false) => {

    const shouldShowLoading = !silent && !hasLoadedOnce.current;
    if (shouldShowLoading) setIsLoading(true);
    try {
      const response = await getEvents({
        page,
        limit: LIMIT,
        search: search || undefined,
        sortBy,
        sortOrder,
      });
      setEvents(response.data);
      setTotalPages(response.meta.totalPages);
      hasLoadedOnce.current = true;
    } catch (error: unknown) {
      toast.error('Failed to load events');
    } finally {
      if (shouldShowLoading) setIsLoading(false);
    }
  };

  return { fetchEvents, isLoading, totalPages, events };
}
