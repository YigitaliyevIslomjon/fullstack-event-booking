"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let BookingsService = class BookingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createBooking(userId, eventId) {
        try {
            return await this.prisma.$transaction(async (tx) => {
                const events = await tx.$queryRawUnsafe('SELECT * FROM "Event" WHERE id = $1 FOR UPDATE', eventId);
                if (!events || events.length === 0) {
                    throw new common_1.NotFoundException('Event not found');
                }
                const event = events[0];
                if (event.remainingTickets <= 0) {
                    throw new common_1.ConflictException('No tickets available');
                }
                const existingBooking = await tx.booking.findUnique({
                    where: {
                        userId_eventId: {
                            userId,
                            eventId,
                        },
                    },
                });
                if (existingBooking?.status === client_1.BookingStatus.CONFIRMED) {
                    throw new common_1.ConflictException('Already booked');
                }
                await new Promise((resolve) => setTimeout(resolve, 1000));
                const updatedEvent = await tx.event.update({
                    where: { id: eventId },
                    data: {
                        remainingTickets: {
                            decrement: 1,
                        },
                    },
                });
                let booking;
                if (existingBooking?.status === client_1.BookingStatus.CANCELLED) {
                    booking = await tx.booking.update({
                        where: { id: existingBooking.id },
                        data: { status: client_1.BookingStatus.CONFIRMED },
                    });
                }
                else {
                    booking = await tx.booking.create({
                        data: {
                            userId,
                            eventId,
                            status: client_1.BookingStatus.CONFIRMED,
                        },
                    });
                }
                return {
                    booking,
                    event: updatedEvent,
                };
            }, {
                isolationLevel: client_1.Prisma.TransactionIsolationLevel.ReadCommitted,
                timeout: 10000,
            });
        }
        catch (err) {
            if (err instanceof common_1.ConflictException || err instanceof common_1.NotFoundException) {
                throw err;
            }
            console.error('Booking failed:', err?.message || err);
            throw new common_1.ConflictException('No tickets available');
        }
    }
    async getUserBookings(userId) {
        const bookings = await this.prisma.booking.findMany({
            where: {
                userId,
                status: client_1.BookingStatus.CONFIRMED,
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
    async cancelBooking(userId, bookingId) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: { event: true },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.userId !== userId) {
            throw new common_1.ForbiddenException('You can only cancel your own bookings');
        }
        if (booking.status === client_1.BookingStatus.CANCELLED) {
            throw new common_1.ConflictException('Booking already cancelled');
        }
        return await this.prisma.$transaction(async (tx) => {
            const updatedBooking = await tx.booking.update({
                where: { id: bookingId },
                data: { status: client_1.BookingStatus.CANCELLED },
            });
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
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map