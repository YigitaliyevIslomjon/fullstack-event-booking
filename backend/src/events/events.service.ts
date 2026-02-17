import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetEventsDto } from './dto';

@Injectable()
export class EventsService {
    constructor(private prisma: PrismaService) { }

    async findAll(dto: GetEventsDto) {
        const { page = 1, limit = 10, search, sortBy = 'date', sortOrder = 'asc' } = dto;

        const skip = (page - 1) * limit;

        // Build where clause for search
        const where = search
            ? {
                title: {
                    contains: search,
                    mode: 'insensitive' as const,
                },
            }
            : {};

        // Build orderBy clause
        const orderBy = {
            [sortBy]: sortOrder,
        };

        // Execute queries in parallel
        const [events, total] = await Promise.all([
            this.prisma.event.findMany({
                where,
                orderBy,
                skip,
                take: limit,
            }),
            this.prisma.event.count({ where }),
        ]);

        return {
            data: events,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        const event = await this.prisma.event.findUnique({
            where: { id },
        });

        if (!event) {
            throw new NotFoundException('Event not found');
        }

        return event;
    }
}
