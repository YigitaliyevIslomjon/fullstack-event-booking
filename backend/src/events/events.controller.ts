import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { GetEventsDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
    constructor(private eventsService: EventsService) { }

    @Get()
    findAll(@Query() dto: GetEventsDto) {
        return this.eventsService.findAll(dto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.eventsService.findOne(id);
    }
}
