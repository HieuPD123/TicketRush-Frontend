'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Grid3X3, Eye, Ticket } from 'lucide-react';
import { apiService } from '@/services/apiService';
import { Event } from '@/types';
import Link from 'next/link';

export default function EventListPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getEvents().then((data) => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-10 text-center text-white/50 animate-pulse font-bold">Đang tải danh sách sự kiện...</div>;

  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">Quản lý sự kiện</h2>
          <p className="text-white/40 mt-1 font-bold uppercase tracking-widest text-[10px]">Quản lý danh sách các sự kiện của tổ chức</p>
        </div>
        <Link 
          href="/events/create"
          className="bg-ticketbox-green hover:brightness-110 text-black font-black px-8 py-3.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-ticketbox-green/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Tạo Sự Kiện Mới
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Sự kiện đang chạy', value: events.length, icon: Ticket, color: 'primary' },
          { label: 'Vé đã bán (30 ngày)', value: '12,450', icon: Plus, color: 'black' },
          { label: 'Sắp hết vé', value: '3', icon: Plus, color: 'error' },
        ].map((stat, i) => (
          <div key={i} className="bg-pure-black p-8 rounded-3xl border border-white/5 flex items-center gap-6 shadow-xl hover:border-white/10 transition-all">
             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
               stat.color === 'primary' ? 'bg-ticketbox-green text-black' : 
               stat.color === 'black' ? 'bg-white/5 text-white' : 
               'bg-error/10 text-error'
             }`}>
                <stat.icon className="w-6 h-6" />
             </div>
             <div>
               <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] leading-none mb-2">{stat.label}</p>
               <h4 className="text-3xl font-black text-white leading-none">{stat.value}</h4>
             </div>
          </div>
        ))}
      </div>

      <div className="bg-pure-black rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-xl font-black text-white uppercase tracking-tighter">Tất cả sự kiện</h3>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
            <input 
              type="text" 
              placeholder="Tìm kiếm sự kiện..." 
              className="bg-white/5 border border-white/5 rounded-xl pl-11 pr-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-ticketbox-green/20 w-80 text-white placeholder:text-white/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/[0.02]">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-white/30 uppercase tracking-widest">Tên sự kiện</th>
                <th className="px-8 py-5 text-[10px] font-black text-white/30 uppercase tracking-widest">Ngày & Giờ</th>
                <th className="px-8 py-5 text-[10px] font-black text-white/30 uppercase tracking-widest">Địa điểm</th>
                <th className="px-8 py-5 text-[10px] font-black text-white/30 uppercase tracking-widest">Trạng thái</th>
                <th className="px-8 py-5 text-[10px] font-black text-white/30 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-white/[0.03] group transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-white/10 overflow-hidden border border-white/10 shadow-sm relative group-hover:border-ticketbox-green/30">
                        <img src={event.bannerUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                      </div>
                      <div>
                        <p className="font-black text-white text-lg leading-tight mb-1 group-hover:text-ticketbox-green transition-colors">{event.title}</p>
                        <p className="text-[10px] text-white/30 font-black uppercase tracking-wider">{event.organizer}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-white">{new Date(event.startDate).toLocaleDateString('vi-VN')}</p>
                    <p className="text-[10px] text-white/30 font-black uppercase">{event.startTime}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-white/70">{event.venueName}</p>
                    <p className="text-[10px] text-white/30 font-medium uppercase">{event.city}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      event.status === 'Selling' ? 'bg-ticketbox-green/10 text-ticketbox-green border-ticketbox-green/20' :
                      event.status === 'Draft' ? 'bg-white/5 text-white/40 border-white/10' :
                      'bg-error/10 text-error border-error/20'
                    }`}>
                      {event.status === 'Selling' ? 'Đang bán' : event.status === 'Draft' ? 'Nháp' : 'Đã đóng'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-end gap-3 text-white">
                      <Link 
                        href={`/events/${event.id}`}
                        className="p-3 text-white/30 hover:bg-white/5 hover:text-ticketbox-green transition-all"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                      <button className="p-3 text-white/30 hover:bg-white/5 hover:text-white transition-all">
                        <Grid3X3 className="w-5 h-5" />
                      </button>
                      <Link 
                        href={`/events/edit/${event.id}`}
                        className="p-3 text-white/30 hover:bg-white/5 hover:text-white transition-all"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
