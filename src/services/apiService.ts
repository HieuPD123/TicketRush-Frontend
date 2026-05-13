import { Event, TicketFeedItem, ChartDataPoint, Customer } from '../types';

/**
 * Service to interact with the backend API.
 * In a real application, replace the mock data with fetch/axios calls.
 */

const API_BASE_URL = '/api'; // Placeholder for your actual backend URL

export const apiService = {
  /**
   * Fetch all customers
   */
  async getCustomers(): Promise<Customer[]> {
    return [
      {
        id: 'c1',
        fullName: 'Nguyễn Văn A',
        email: 'nguyenvana@gmail.com',
        phone: '0901234567',
        totalSpent: 4500000,
        ordersCount: 3,
        lastOrderDate: '2024-04-15',
        status: 'Active',
        avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100'
      },
      {
        id: 'c2',
        fullName: 'Trần Thị B',
        email: 'tranthib@hotmail.com',
        phone: '0912345678',
        totalSpent: 1200000,
        ordersCount: 1,
        lastOrderDate: '2023-12-20',
        status: 'Active',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'
      },
      {
        id: 'c3',
        fullName: 'Lê Văn C',
        email: 'levanc@yahoo.com',
        phone: '0987654321',
        totalSpent: 8900000,
        ordersCount: 5,
        lastOrderDate: '2024-05-01',
        status: 'Active',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'
      },
      {
        id: 'c4',
        fullName: 'Phạm Minh D',
        email: 'phamminhd@gmail.com',
        phone: '0977889900',
        totalSpent: 0,
        ordersCount: 0,
        lastOrderDate: '-',
        status: 'Inactive'
      },
      {
        id: 'c5',
        fullName: 'Hoàng Anh E',
        email: 'hoanganhe@gmail.com',
        phone: '0933445566',
        totalSpent: 15000000,
        ordersCount: 12,
        lastOrderDate: '2024-05-08',
        status: 'Active',
        avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100'
      }
    ];
  },
  /**
   * Fetch all events from the backend
   */
  async getEvents(): Promise<Event[]> {
    // try {
    //   const response = await fetch(`${API_BASE_URL}/events`);
    //   return await response.json();
    // } catch (error) {
    //   console.error('Error fetching events:', error);
    //   return [];
    // }

    // Mock implementation
    return [
      {
        id: '1',
        title: 'The Eras Tour - Hồ Chí Minh',
        organizer: 'Taylor Swift',
        category: 'Concert',
        description: 'Taylor Swift: The Eras Tour là chuyến lưu diễn solo thứ sáu của ca sĩ kiêm nhạc sĩ người Mỹ Taylor Swift.',
        startDate: '2024-08-15',
        startTime: '19:00',
        endDate: '2024-08-15',
        endTime: '23:00',
        venueName: 'SVĐ Quân khu 7',
        address: '202 Hoàng Văn Thụ, P.9, Phú Nhuận',
        city: 'Hồ Chí Minh',
        bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHXpvkptofsNJ9j2yplQY7_M3VnBI2dQ6ERdjjI0MtglaG7UIHm5FUr3l0mFCPL1gmwIKWbJt5WUMAXzjugXItizkCEJOpTbe-IU19j2L2VdIhjiED9HLdIsrNcnglJsDZ9Zqx-_y8nSRdqDAwSaDGOIB-JPAvRkH724KvYRykFT65VT-BPlT5bLcT_TPAdFVX-H0IxBGQxC0tUABWetzTaLHJnqj32ZAfO7KHOeWna4C3beO3PLC0t_S7rmfKY-Mefyj0r_kZvOE',
        thumbnailUrl: '',
        status: 'Selling',
        revenue: 150000000,
        ticketsSold: 1250,
        totalCapacity: 2000,
      },
      {
        id: '2',
        title: 'Hội nghị Thượng đỉnh Đổi mới Công nghệ',
        organizer: 'Global Tech Co.',
        category: 'Tech',
        description: 'Tham gia cùng những bộ óc sáng giá nhất thế giới trong lĩnh vực công nghệ.',
        startDate: '2024-09-22',
        startTime: '09:00',
        endDate: '2024-09-24',
        endTime: '17:00',
        venueName: 'Trung tâm Triển lãm SECC',
        address: '799 Nguyễn Văn Linh, P. Tân Phú, Q.7',
        city: 'Hồ Chí Minh',
        bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCADqLTASeHPmU3c6sZMNKGCnfJwxJe3vKdPeHwirXJEvTJGtQSbr_bMbD4XVmm4L4mgHsEEO_14L12bG8QdPqhOBnPvPEOwQRnKc9lvplvLlhrZuV6DQtMCXiA57M9u2NXFqJsrvGLjY2DmlrPfLANPYG1ln_-s5DEFq5TLxGrWjwcXWTMYAo1fb_RhTW4o4zrdBayKXxrwyyTiyYqe3ZNmNgwf-fdlWOz15Jmvl6Sk_B8kZizWAPfxrB66fNf7rfuWvdOcK5CEos',
        thumbnailUrl: '',
        status: 'Draft',
        revenue: 0,
        ticketsSold: 0,
        totalCapacity: 500,
      }
    ];
  },

  /**
   * Save a new event or update an existing one
   */
  async saveEvent(event: Partial<Event>): Promise<Event> {
    const isNew = !event.id;
    const method = isNew ? 'POST' : 'PUT';
    const url = isNew ? `${API_BASE_URL}/events` : `${API_BASE_URL}/events/${event.id}`;

    console.log(`Calling API: ${method} ${url}`, event);
    
    // Simulating response
    return {
      ...(event as Event),
      id: event.id || Math.random().toString(36).substr(2, 9),
    };
  },

  /**
   * Get dashboard analytics data
   */
  async getDashboardStats() {
    return {
      totalRevenue: 150000000,
      ticketsSold: 1250,
      activeEvents: 8,
      liveVisitors: 342,
      revenueTrends: [
        { date: 'T2', revenue: 30000000 },
        { date: 'T3', revenue: 45000000 },
        { date: 'T4', revenue: 40000000 },
        { date: 'T5', revenue: 60000000 },
        { date: 'T6', revenue: 55000000 },
        { date: 'T7', revenue: 80000000 },
        { date: 'CN', revenue: 95000000 },
      ],
      recentTickets: [
        { id: '1', eventName: 'Lễ hội Âm nhạc Mùa hè', orderNumber: '8892', tier: 'Vé VIP', timestamp: 'Just now' },
        { id: '2', eventName: 'Hội thảo Công nghệ 2024', orderNumber: '8891', tier: 'Thường', timestamp: '2 min ago' },
        { id: '3', eventName: 'Đêm Hài kịch', orderNumber: '8890', tier: 'Thường', timestamp: '5 min ago' },
      ] as TicketFeedItem[]
    };
  }
};
