import { API_ENDPOINTS } from '@/lib/api-config';

type EventStats = {
    eventId: number;
    eventTitle: string;
    venue: string;
    startTime: string;
    endTime: string;
    posterUrl: string;
    totalTickets: number;
    soldTickets: number;
    lockedTickets: number;
    remainingTickets: number;
    remainingRates: number;
}

export type OnSaleLowTicketsResponse = {
    code: number;
    message: string;
    results: EventStats[];
}

export async function getOnSaleLowTickets(): Promise<OnSaleLowTicketsResponse> {
    const url = API_ENDPOINTS.admin.onSaleLowTickets;

    if (!url) {
        throw new Error('API endpoint for on-sale low tickets is not defined');
    }

    try {
        const res = await fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to fetch on-sale low tickets');
        }
        const data: OnSaleLowTicketsResponse = await res.json();
        return data;
    } catch (error) {
        console.error('Error fetching on-sale low tickets:', error);
        throw error;
    }
}


