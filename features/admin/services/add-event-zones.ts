import { API_ENDPOINTS } from "@/lib/api-config";
import { Zone } from "@/features/events/types";

type AddEventZonesRequest = {
    name: string;
    price: number;
    totalRows: number;
    totalCols: number;
    colorHex: string;
};

export async function addEventZones(eventId: string, zone: AddEventZonesRequest): Promise<Zone> {
    const url = `${API_ENDPOINTS.admin.events}/${eventId}/zones`;

    if (!url) {
        throw new Error("API endpoint for adding event zones is not defined.");
    }

    const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(zone),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add event zone: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const createdZone: Zone = await response.json();
    return createdZone;
}

