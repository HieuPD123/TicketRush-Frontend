import { API_ENDPOINTS } from "@/lib/api-config";
import { Event } from "@/features/events/types";

export const getEvents = async (): Promise<Event[]> => {
    const url = API_ENDPOINTS.admin.events;

    if (!url) {
        throw new Error('API endpoint for fetching events is not defined');
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
            throw new Error(errorData.message || 'Failed to fetch events');
        }
        const responseData: Event[] = await res.json();
        return responseData;
    } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
}

