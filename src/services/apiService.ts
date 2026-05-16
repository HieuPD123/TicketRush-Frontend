import type { Event, LoginResponse, Customer, Zone, Seat, EventStats } from '@/types';
import { get } from 'http';
import { CreateEventRequest } from '../types';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

function getToken(): string {
  return localStorage.getItem('token') || '';
}

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse['result']> => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data: LoginResponse = await res.json();

  if (data.code !== 1000) {
    throw new Error(data.message || 'Login failed');
  }

  if (data.result.role) {
    localStorage.setItem('role', data.result.role);
  }

  return data.result;
};

export const logout = (): void => {
  localStorage.removeItem('role');
};

const apiCall = async <T = any>(
  endpoint: string,
  options: RequestInit = {},
  successCodes: number[] = [1000]
): Promise<T> => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const errorText = await res.text();

    console.error('API ERROR:', {
      url: `${BASE_URL}${endpoint}`,
      status: res.status,
      body: errorText,
    });

    throw new Error(`Network response was not ok (${res.status})`);
  }

  const data = await res.json();

  if (!successCodes.includes(data.code)) {
    throw new Error(data.message || 'API Error');
  }

  return data.result;
};

export const apiService = {
  async getEvents(): Promise<Event[]> {
    const response = await apiCall<any>('/admin/events');

    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.content)) {
      return response.content;
    }

    return [];
  },

  async getEventById(id: number): Promise<Event> {
    return await apiCall<Event>(`/events/${id}`);
  },

  async getCustomers(): Promise<Customer[]> {
    return await apiCall<Customer[]>('/customers');
  },

  async createEvent(eventData: {
    title: string;
    description: string;
    venue: string;
    startTime: string;
    endTime: string;
    longitude: number;
    latitude: number;
    type: string;
    posterUrl: string;
    endTimeAfterStartTime: boolean;
  }): Promise<Event> {
    return await apiCall<Event>(
      '/admin/events',
      {
        method: 'POST',
        body: JSON.stringify(eventData),
      },
      [1000, 1073741824]
    );
  },

  async createZone(
    eventId: number,
    zoneData: {
      name: string;
      price: number;
      totalRows: number;
      totalCols: number;
      colorHex: string;
    }
  ) {
    console.log('Sending zone data:', zoneData);

    try {
      const res = await fetch(`${BASE_URL}/admin/events/${eventId}/zones`, {
        method: 'POST',
        body: JSON.stringify(zoneData),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        credentials: 'include',
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Backend response:', errorText);
        throw new Error(`Network response was not ok (${res.status})`);
      }

      const data = await res.json();
      return data.result;
    } catch (error) {
      console.error('Error in createZone:', error);
      throw error;
    }
  },

  async saveEvent(eventData: Event): Promise<Event> {
    return await apiCall<Event>(
      `/admin/events/${eventData.id}`,
      {
        method: 'PUT',
        body: JSON.stringify(eventData),
      },
      [1000, 1073741824]
    );
  },

  async getSeatsByEventId(eventId: number): Promise<Seat[]> {
    return await apiCall<Seat[]>(`/events/${eventId}/seats`);
  },

  async getDashboardStats() {
    const response = await apiCall<any>('/events');

    let events: Event[] = [];

    if (Array.isArray(response)) {
      events = response;
    } else if (Array.isArray(response?.content)) {
      events = response.content;
    }

    let totalRevenue = 0;
    let ticketsSold = 0;
    let totalCapacity = 0;
    const recentTickets: any[] = [];

    for (const event of events) {
      if (event.zones) {
        for (const zone of event.zones) {
          totalCapacity += zone.totalSeats || 0;

          const sold =
            (zone.totalSeats || 0) -
            (zone.availableSeats || 0);

          ticketsSold += sold;

          totalRevenue += sold * (zone.price || 0);

          // Add ticket activity entries for each zone
          recentTickets.push({
            id: `${event.id}-${zone.id}`,
            eventName: event.title,
            orderNumber: Math.floor(Math.random() * 100000).toString(),
            tier: zone.name,
            timestamp: 'Just now',
          });
        }
      }
    }

    return {
      totalRevenue,
      ticketsSold,
      totalCapacity,
      activeEvents: events.length,
      revenueTrends: [],
      recentTickets,
    };
  },

  async getEventStatsById(eventId: number): Promise<EventStats> {
    return await apiCall<EventStats>(`/admin/events/${eventId}/audience`);
  }
};

export async function createEvent(eventData: CreateEventRequest): Promise<void> {
  const response = await fetch(`${BASE_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    credentials: 'include',
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create event: ${response.statusText}`);
  }
}