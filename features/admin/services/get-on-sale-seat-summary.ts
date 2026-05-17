import { API_ENDPOINTS } from "@/lib/api-config";

export type OnSaleSeatSummaryResponse = {
    code: number;
    message: string;
    results: {
        soldSeats: number;
        totalSeats: number;
        soldRate: number;
    };
}

export async function getOnSaleSeatSummary(): Promise<OnSaleSeatSummaryResponse> {
    const url = API_ENDPOINTS.admin.onSaleSeatSummary;

    if (!url) {
        throw new Error('API endpoint for on-sale seat summary is not defined');
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
            throw new Error(errorData.message || 'Failed to fetch on-sale seat summary');
        }
        const data: OnSaleSeatSummaryResponse = await res.json();
        return data;
    } catch (error) {
        console.error('Error fetching on-sale seat summary:', error);
        throw error;
    }
}