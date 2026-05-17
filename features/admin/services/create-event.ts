import { EventDetailRequest } from "./modify-event-detail";
import { API_ENDPOINTS } from "@/lib/api-config";
import { Event } from "@/features/events/types";

export const createEvent = async (data: EventDetailRequest): Promise<Event> => {
    const url = API_ENDPOINTS.admin.events;

    if (!url) {
        throw new Error('API endpoint for creating event is not defined');
    }

    try {
        const res = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to create event');
        }
        const responseData: Event = await res.json();
        return responseData;
    } catch (error) {
        console.error('Error creating event:', error);
        throw error;
    }
}
