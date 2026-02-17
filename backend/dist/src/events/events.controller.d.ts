import { EventsService } from './events.service';
import { GetEventsDto } from './dto';
export declare class EventsController {
    private eventsService;
    constructor(eventsService: EventsService);
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
