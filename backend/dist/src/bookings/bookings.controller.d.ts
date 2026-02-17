import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto';
export declare class BookingsController {
    private bookingsService;
    constructor(bookingsService: BookingsService);
    createBooking(userId: string, dto: CreateBookingDto): Promise<{
        booking: {
            id: string;
            createdAt: Date;
            eventId: string;
            status: import("@prisma/client").$Enums.BookingStatus;
            userId: string;
        };
        event: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string;
            date: Date;
            venue: string;
            totalTickets: number;
            remainingTickets: number;
            price: number;
        };
    }>;
    getUserBookings(userId: string): Promise<({
        event: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string;
            date: Date;
            venue: string;
            totalTickets: number;
            remainingTickets: number;
            price: number;
        };
    } & {
        id: string;
        createdAt: Date;
        eventId: string;
        status: import("@prisma/client").$Enums.BookingStatus;
        userId: string;
    })[]>;
    cancelBooking(userId: string, bookingId: string): Promise<{
        id: string;
        createdAt: Date;
        eventId: string;
        status: import("@prisma/client").$Enums.BookingStatus;
        userId: string;
    }>;
}
