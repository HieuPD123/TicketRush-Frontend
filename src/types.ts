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

export interface Event {
  id: string;
  title: string;
  description?: string;
  venue?: string;
  longitude?: number;
  latitude?: number;
  startTime?: string;
  endTime?: string;
  type?: string;
  posterUrl?: string;
  status?: string;
  zones?: Zone[];
  createdAt?: string;
  spotlight?: boolean;
  queueRequired?: boolean;
  activeUsers?: number;
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
