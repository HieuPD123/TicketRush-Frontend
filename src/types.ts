export interface Event {
  id: string;
  title: string;
  organizer: string;
  category: 'Concert' | 'Tech' | 'Festival' | 'Comedy';
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  venueName: string;
  address: string;
  city: string;
  bannerUrl: string;
  thumbnailUrl: string;
  status: 'Draft' | 'Selling' | 'Closed';
  revenue: number;
  ticketsSold: number;
  totalCapacity: number;
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
