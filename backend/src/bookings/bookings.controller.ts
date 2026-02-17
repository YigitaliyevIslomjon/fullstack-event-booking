import {
	Controller,
	Post,
	Get,
	Delete,
	Body,
	Param,
	UseGuards,
	HttpCode,
	HttpStatus,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
	constructor(private bookingsService: BookingsService) { }

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async createBooking(
		@GetUser('userId') userId: string,
		@Body() dto: CreateBookingDto,
	) {
		return this.bookingsService.createBooking(userId, dto.eventId);
	}

	@Get()
	async getUserBookings(@GetUser('userId') userId: string) {
		return this.bookingsService.getUserBookings(userId);
	}

	@Delete(':id')
	async cancelBooking(
		@GetUser('userId') userId: string,
		@Param('id') bookingId: string,
	) {
		return this.bookingsService.cancelBooking(userId, bookingId);
	}
}
