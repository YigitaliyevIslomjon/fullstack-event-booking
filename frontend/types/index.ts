export interface User {
    id: string;
    email: string;
    name: string;
}

export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    venue: string;
    totalTickets: number;
    remainingTickets: number;
    price: number;
    createdAt: string;
    updatedAt: string;
}


export interface Booking {
    id: string;
    userId: string;
    eventId: string;
    status: 'CONFIRMED' | 'CANCELLED';
    createdAt: string;
    event?: Event;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface EventsResponse {
    data: Event[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
