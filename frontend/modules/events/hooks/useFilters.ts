'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FILTER_SORT_BY, FILTER_SORT_ORDER } from '@/modules/events/constants';

const DEBOUNCE_MS = 300;

export function useEventsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get('search') || '';
  const page = Number(searchParams.get('page')) || 1;
  const sortBy = (searchParams.get('sortBy') as FILTER_SORT_BY) || FILTER_SORT_BY.DATE;
  const sortOrder = (searchParams.get('sortOrder') as FILTER_SORT_ORDER) || FILTER_SORT_ORDER.ASC;

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchInput) params.set('search', searchInput);
      else params.delete('search');
      const qs = params.toString();
      router.replace(qs ? `/events?${qs}` : '/events', { scroll: false });
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput, router]);

  // Helper to update URL params
  const updateParams = useCallback(
    (updates: { search?: string; sortBy?: string; sortOrder?: string; page?: number }) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null) {
          params.delete(key);
        } else if (key === 'page' && value === 1) {
          params.delete('page'); // Don't show page=1 in URL
        } else if (key === 'sortBy' && value === FILTER_SORT_BY.DATE) {
          params.delete('sortBy'); // Don't show default sortBy
        } else if (key === 'sortOrder' && value === FILTER_SORT_ORDER.ASC) {
          params.delete('sortOrder'); // Don't show default sortOrder
        } else {
          params.set(key, String(value));
        }
      });

      const qs = params.toString();
      router.replace(qs ? `/events?${qs}` : '/events', { scroll: false });
    },
    [router, searchParams]
  );

  return {
    search,
    page,
    sortBy,
    sortOrder,
    searchInput,
    setSearchInput,
    updateParams,
  };
}
