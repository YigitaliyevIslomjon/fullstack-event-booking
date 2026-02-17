import Link from 'next/link';
// services
import { Event } from '@/types';
// components
import { Icon } from '@/components/Icons';
import { Button } from '@/components/ui';
import TicketBadge from '@/app/(dashboard)/events/components/TicketBadge';
// utils
import { formatEventDate, formatEventTime } from '@/lib/utils';

// types
interface EventCardProps {
	event: Event;
	bookingState: 'idle' | 'loading' | 'success' | 'error';
	onBook: () => void;
}

export default function EventCard({ event, bookingState, onBook }: EventCardProps) {
	const getButtonState = () => {
		if (bookingState === 'loading') return { text: 'Booking...', disabled: true, variant: 'primary' as const };
		if (bookingState === 'success') return { text: 'Booked ✓', disabled: true, variant: 'primary' as const, className: 'bg-green-500 hover:bg-green-500' };
		if (event.remainingTickets === 0) return { text: 'Sold Out', disabled: true, variant: 'primary' as const };
		return { text: 'Book Now', disabled: false, variant: 'primary' as const };
	};

	const buttonState = getButtonState();

	return (
		<div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
			<Link href={`/events/${event.id}`} className="block p-6 pb-0">
				{/* Title */}
				<h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-indigo-600 transition-colors">
					{event.title}
				</h3>

				{/* Description */}
				<p className="text-gray-600 text-sm mb-4 line-clamp-3">
					{event.description}
				</p>

				{/* Event Details */}
				<div className="space-y-2 mb-4">
					<div className="flex items-center text-sm text-gray-700">
						<Icon name="Calendar" className="w-4 h-4 mr-2 text-indigo-600" />
						{formatEventDate(event.date)} at {formatEventTime(event.date)}
					</div>
					<div className="flex items-center text-sm text-gray-700">
						<Icon name="MapPin" className="w-4 h-4 mr-2 text-indigo-600" />
						{event.venue}
					</div>
				</div>

				{/* Price and Tickets */}
				<div className="flex items-center justify-between mb-4">
					<div className="text-2xl font-bold text-indigo-600">
						${event.price.toFixed(2)}
					</div>
					<div className="flex items-center gap-2">
						<TicketBadge remainingTickets={event.remainingTickets} totalTickets={event.totalTickets} />
					</div>
				</div>
			</Link>

			{/* Book Button - separate block so click doesn't navigate */}
			<div className="p-6 pt-4">
				<Button
					variant={buttonState.variant}
					fullWidth
					onClick={(e) => {
						e.preventDefault();
						onBook();
					}}
					disabled={buttonState.disabled}
					loading={bookingState === 'loading'}
					className={buttonState.className || ''}
				>
					{buttonState.text}
				</Button>
			</div>
		</div>
	);
}
