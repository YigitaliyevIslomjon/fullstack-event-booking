export declare class GetEventsDto {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: 'date' | 'price' | 'title';
    sortOrder?: 'asc' | 'desc';
}
