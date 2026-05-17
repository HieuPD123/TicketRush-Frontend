import { Event } from "@/features/events/types";
import { API_ENDPOINTS } from "@/lib/api-config";

export const changeEventStatus = async (eventId: number, status: "DRAFT" | "ON_SALE" | "ENDED"): Promise<Event> => {
    const url = `${API_ENDPOINTS.admin.events}/${eventId}/status`;

    if (!url) {
        throw new Error('API endpoint for changing event status is not defined');
    }

    try {
        const res = await fetch(url, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: status }),
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to change event status');
        }
        const responseData: Event = await res.json();
        return responseData;
    } catch (error) {
        console.error('Error changing event status:', error);
        throw error;
    }
}
