import { PrismaService } from '../prisma/prisma.service';
export declare class BookingsService {
    private prisma;
    constructor(prisma: PrismaService);
    createBooking(userId: string, eventId: string): Promise<{
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
