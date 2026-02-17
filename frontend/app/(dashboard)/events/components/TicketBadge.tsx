interface TicketBadgeProps {
	remainingTickets: number;
	totalTickets: number;
	/** e.g. "tickets" → "5 tickets left"; omit → "5 left" */
	unit?: string;
	className?: string;
}

function getBadgeColor(remainingTickets: number, totalTickets: number): string {
	if (remainingTickets === 0) return 'bg-gray-500';
	const percentage = totalTickets > 0 ? (remainingTickets / totalTickets) * 100 : 0;
	if (percentage > 50) return 'bg-green-500';
	if (percentage > 10) return 'bg-yellow-500';
	return 'bg-red-500';
}

function getBadgeLabel(remainingTickets: number, unit?: string): string {
	if (remainingTickets === 0) return 'Sold Out';
	return unit ? `${remainingTickets} ${unit} left` : `${remainingTickets} left`;
}

export default function TicketBadge({
	remainingTickets,
	totalTickets,
	unit,
	className = '',
}: TicketBadgeProps) {
	const bgClass = getBadgeColor(remainingTickets, totalTickets);
	const label = getBadgeLabel(remainingTickets, unit);

	return (
		<span
			className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white ${bgClass} ${className}`}
			role="status"
			aria-label={label}
		>
			{label}
		</span>
	);
}
