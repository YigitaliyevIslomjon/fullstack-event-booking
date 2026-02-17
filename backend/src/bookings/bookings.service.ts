import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, BookingStatus } from '@prisma/client';

@Injectable()
export class BookingsService {
	constructor(private prisma: PrismaService) { }

	// This method prevents overselling by using SELECT FOR UPDATE to lock the event row
	async createBooking(userId: string, eventId: string) {
		try {
			return await this.prisma.$transaction(
				async (tx) => {
					// 1. Lock and read the event row using SELECT FOR UPDATE
					const events = await tx.$queryRawUnsafe<Array<{
						id: string;
						title: string;
						description: string;
						date: Date;
						venue: string;
						totalTickets: number;
						remainingTickets: number;
						price: number;
						createdAt: Date;
						updatedAt: Date;
					}>>('SELECT * FROM "Event" WHERE id = $1 FOR UPDATE', eventId);

					if (!events || events.length === 0) {
						throw new NotFoundException('Event not found');
					}

					const event = events[0];

					// 2. Check ticket availability
					if (event.remainingTickets <= 0) {
						throw new ConflictException('No tickets available');
					}

					// 3. Check existing booking (CONFIRMED = block, CANCELLED = allow re-book)
					const existingBooking = await tx.booking.findUnique({
						where: {
							userId_eventId: {
								userId,
								eventId,
							},
						},
					});

					if (existingBooking?.status === BookingStatus.CONFIRMED) {
						throw new ConflictException('Already booked');
					}

					// 4. Artificial delay to simulate payment processing
					await new Promise((resolve) => setTimeout(resolve, 1000));

					// 5. Decrement remaining tickets
					const updatedEvent = await tx.event.update({
						where: { id: eventId },
						data: {
							remainingTickets: {
								decrement: 1,
							},
						},
					});

					// 6. Create new booking OR update CANCELLED → CONFIRMED
					let booking;
					if (existingBooking?.status === BookingStatus.CANCELLED) {
						booking = await tx.booking.update({
							where: { id: existingBooking.id },
							data: { status: BookingStatus.CONFIRMED },
						});
					} else {
						booking = await tx.booking.create({
							data: {
								userId,
								eventId,
								status: BookingStatus.CONFIRMED,
							},
						});
					}

					return {
						booking,
						event: updatedEvent,
					};
				},
				{
					isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
					timeout: 10000,
				},
			);
		} catch (err: any) {
			if (err instanceof ConflictException || err instanceof NotFoundException) {
				throw err;
			}
			console.error('Booking failed:', err?.message || err);
			throw new ConflictException('No tickets available');
		}
	}

	async getUserBookings(userId: string) {
		const bookings = await this.prisma.booking.findMany({
			where: {
				userId,
				status: BookingStatus.CONFIRMED,
			},
			include: {
				event: true
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		return bookings;
	}

	async cancelBooking(userId: string, bookingId: string) {
		// Find the booking
		const booking = await this.prisma.booking.findUnique({
			where: { id: bookingId },
			include: { event: true },
		});

		if (!booking) {
			throw new NotFoundException('Booking not found');
		}

		// Check ownership
		if (booking.userId !== userId) {
			throw new ForbiddenException('You can only cancel your own bookings');
		}

		// Check if already cancelled
		if (booking.status === BookingStatus.CANCELLED) {
			throw new ConflictException('Booking already cancelled');
		}

		// Cancel booking and restore ticket in a transaction
		return await this.prisma.$transaction(async (tx) => {
			// Update booking status
			const updatedBooking = await tx.booking.update({
				where: { id: bookingId },
				data: { status: BookingStatus.CANCELLED },
			});

			// Restore ticket
			await tx.event.update({
				where: { id: booking.eventId },
				data: {
					remainingTickets: {
						increment: 1,
					},
				},
			});

			return updatedBooking;
		});
	}
}
