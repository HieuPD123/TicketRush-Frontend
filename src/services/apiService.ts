import type { Event } from '@/types';

const API_BASE_URL = 'http://localhost:8080/api';

const apiCall = async <T = any>(
  endpoint: string,
  options?: RequestInit,
  successCodes: number[] = [1000]
): Promise<T> => {
  const token = await getAdminToken();

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`Network response was not ok (${res.status})`);
  }

  const data = await res.json();

  if (data.code !== 1000) {
    throw new Error(data.message || 'API Error');
  }

  return data.result;
};

export const apiService = {
  async getEvents(): Promise<Event[]> {
    const response = await apiCall<any>('/events');

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
  }) {
    return await apiCall<Event>('/admin/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    }, [1000, 1073741824]);
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
    return await apiCall(
      `/admin/events/${eventId}/zones`,
      {
        method: 'POST',
        body: JSON.stringify(zoneData),
      }
    );
  },

  async getDashboardStats() {
    const response = await apiCall<any>('/events');

    const events: Event[] = Array.isArray(response)
      ? response
      : Array.isArray(response?.content)
        ? response.content
        : [];

    const totalRevenue = events.reduce((sum, event) => {
      if (!event.zones || !Array.isArray(event.zones)) {
        return sum;
      }

      const eventRevenue = event.zones.reduce((zoneSum, zone) => {
        const soldSeats =
          (zone.totalSeats || 0) -
          (zone.availableSeats || 0);

        return zoneSum + soldSeats * (zone.price || 0);
      }, 0);

      return sum + eventRevenue;
    }, 0);

    const ticketsSold = events.reduce((sum, event) => {
      if (!event.zones || !Array.isArray(event.zones)) {
        return sum;
      }

      return (
        sum +
        event.zones.reduce((zoneSum, zone) => {
          return (
            zoneSum +
            ((zone.totalSeats || 0) -
              (zone.availableSeats || 0))
          );
        }, 0)
      );
    }, 0);

    const totalCapacity = events.reduce((sum, event) => {
      if (!event.zones || !Array.isArray(event.zones)) {
        return sum;
      }

      return (
        sum +
        event.zones.reduce(
          (zoneSum, zone) =>
            zoneSum + (zone.totalSeats || 0),
          0
        )
      );
    }, 0);

    const activeEvents = events.filter(event =>
      ['ON_SALE', 'ON SALE'].includes(event.status)
    ).length;

    const revenueTrends = events.map(event => {
      const revenue =
        event.zones?.reduce((sum, zone) => {
          const soldSeats =
            (zone.totalSeats || 0) -
            (zone.availableSeats || 0);

          return sum + soldSeats * (zone.price || 0);
        }, 0) || 0;

      return {
        date: event.title,
        revenue,
      };
    });

    return {
      totalRevenue,
      ticketsSold,
      totalCapacity,
      activeEvents,
      // liveVisitors: 0,
      revenueTrends,
      recentTickets: [],
    };
  }
};

const getAdminToken = async () => {
  // if (cachedToken) {
  //   return cachedToken;
  // }

  const loginRes = await fetch(
    'http://localhost:8080/api/auth/login',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@ticketrush.com',
        password: 'admin123',
      }),
    }
  );

  const loginData = await loginRes.json();

  console.log('LOGIN RESPONSE:', loginData);

  const token = loginData?.result?.token;

  if (!token) {
    throw new Error('Không tìm thấy token');
  }

  // cachedToken = token;

  return token;
};