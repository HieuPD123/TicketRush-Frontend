export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  code: number;
  message?: string;
  result: {
    token: string;
    email: string;
    fullName: string;
    role: string;
  };
}

export interface Zone {
  id: number;
  name: string;
  price: number;
  totalRows: number;
  totalCols: number;
  colorHex: string;
  totalSeats: number;
  availableSeats: number;
}

export interface EventResponse {
  code: number;
  message: string;
  result: Event[];
}

export interface Event {
  id: number;
  title: string;
  description: string;
  venue: string;
  longitude: number;
  latitude: number;
  startTime: string;
  endTime: string;
  posterUrl: string;
  status: string;
  type: string;
  zones: Zone[];
  createdAt: string;
  spotlight: boolean;
  queueRequired: boolean;
  activeUsers: number;
  organizer?: string;
  revenue?: number;
  ticketsSold?: number;
  totalCapacity?: number;
}

export interface TicketFeedItem {
  id: string;
  eventName: string;
  orderNumber: string;
  tier: string;
  timestamp: string;
}

export interface ChartDataPoint {
  date: string;
  revenue: number;
}

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  totalSpent: number;
  ordersCount: number;
  lastOrderDate: string;
  status: 'Active' | 'Inactive';
  avatarUrl?: string;
}
