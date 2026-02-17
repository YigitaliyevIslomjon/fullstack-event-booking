import { PrismaService } from '../prisma/prisma.service';
import { GetEventsDto } from './dto';
export declare class EventsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(dto: GetEventsDto): Promise<{
        data: {
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
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
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
    }>;
}
