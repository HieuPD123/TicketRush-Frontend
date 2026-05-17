import { Category } from "@/features/events/types";
import { API_ENDPOINTS } from "@/lib/api-config";
import { Event } from "@/features/events/types";

export type EventDetailRequest = {
    title: string,
    description: string,
    venue: string,
    startTime: string,
    endTime: string,
    type: Category,
    posterUrl: string,
    endTimeAfterStartTime: boolean,
}


export const modifyEventDetail = async (eventId: number, data: EventDetailRequest): Promise<Event> => {
    const url = `${API_ENDPOINTS.admin.events}/${eventId}`;

    if (!url) {
        throw new Error('API endpoint for modifying event detail is not defined');
    }

    try {
        const res = await fetch(url, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to modify event detail');
        }
        const responseData: Event = await res.json();
        return responseData;
    } catch (error) {
        console.error('Error modifying event detail:', error);
        throw error;
    }
}