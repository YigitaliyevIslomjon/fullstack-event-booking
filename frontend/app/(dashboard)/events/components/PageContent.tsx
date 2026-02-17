
// core
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
// components
import DashboardHeader from '@/components/layouts/DashboardHeader';
import EventCard from '@/app/(dashboard)/events/components/Card';
import EventCardSkeleton from '@/app/(dashboard)/events/components/CardSkeleton';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui';
// store
import { useAuthStore } from '@/store/auth-store';
// modules/events
import { useEventsFilters, useEventsData, useEventBooking } from '@/modules/events/hooks';
// constants
import { FILTER_SORT_BY, FILTER_SORT_ORDER } from '@/modules/events/constants';

export default function EventsPageContent() {
	const router = useRouter();
	const { user } = useAuthStore();
	// state
	const searchParams = useSearchParams();
	const searchQuery = searchParams.get('search') || '';

	const { searchInput, setSearchInput, search, page, sortBy, sortOrder, updateParams } = useEventsFilters();
	const { fetchEvents, isLoading, totalPages, events } = useEventsData(page, search, sortBy, sortOrder);
	const { bookingStates, handleBooking } = useEventBooking(fetchEvents);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchInput(e.target.value);
	};

	const handlePageChange = (newPage: number) => {
		updateParams({ page: newPage });
	};

	const onRefresh = () => {
		setSearchInput('');
		router.replace('/events', { scroll: false });
	};

	useEffect(() => {
		fetchEvents();
	}, [searchQuery, page, sortBy, sortOrder]);

	useEffect(() => {
		const interval = setInterval(() => fetchEvents(true), 5000);
		return () => clearInterval(interval);
	}, [fetchEvents]);

	return (
		<div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
			<DashboardHeader
				title="Event Booking"
				subtitle={`Welcome, ${user?.name}!`}
				showMyBookings
			/>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Search and Filters */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
					<div className="flex flex-col md:flex-row gap-4">
						<div className="flex-1">
							<Input
								type="text"
								value={searchInput}
								onChange={handleSearchChange}
								placeholder="Search events"
								className="w-full"
								size="sm"
							/>
						</div>
						<div className="flex gap-2">
							<Select
								value={sortBy}
								onValueChange={(v) => updateParams({ sortBy: v, page: 1 })}
								options={[
									{ value: FILTER_SORT_BY.DATE, label: 'Sort by Date' },
									{ value: FILTER_SORT_BY.PRICE, label: 'Sort by Price' },
									{ value: FILTER_SORT_BY.TITLE, label: 'Sort by Title' },
								]}
								placeholder="Sort by"
								className="w-[180px]"
							/>
							<Select
								value={sortOrder}
								onValueChange={(v) => updateParams({ sortOrder: v, page: 1 })}
								options={[
									{ value: FILTER_SORT_ORDER.ASC, label: 'Ascending' },
									{ value: FILTER_SORT_ORDER.DESC, label: 'Descending' },
								]}
								placeholder="Order"
								className="w-[140px]"
							/>
							<Button variant="primary" onClick={onRefresh}>
								Refresh
							</Button>
						</div>
					</div>
				</div>

				{/* Events Grid */}
				{isLoading ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{[...Array(6)].map((_, i) => (
							<EventCardSkeleton key={i} />
						))}
					</div>
				) : events && events.length === 0 ? (
					<div className="text-center py-16">
						<div className="text-6xl mb-4">🎭</div>
						<h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
						<p className="text-gray-600">Try adjusting your search or filters</p>
					</div>
				) : (
					<>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{events.map((event) => (
								<EventCard
									key={event.id}
									event={event}
									bookingState={bookingStates[event.id] || 'idle'}
									onBook={() => handleBooking(event.id)}
								/>
							))}
						</div>

						{/* Pagination */}
						{totalPages > 1 && (
							<div className="flex justify-center items-center gap-2 mt-8">
								<Button
									variant="outline"
									onClick={() => handlePageChange(Math.max(1, page - 1))}
									disabled={page === 1}
								>
									Previous
								</Button>
								<span className="px-4 py-2 text-sm text-gray-700">
									Page {page} of {totalPages}
								</span>
								<Button
									variant="outline"
									onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
									disabled={page === totalPages}
								>
									Next
								</Button>
							</div>
						)}
					</>
				)}
			</main>
		</div>
	);
}
