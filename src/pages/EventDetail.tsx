import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Wallet, Ticket, Users, TrendingUp, Info, MapPin, Calendar, Clock, Lock } from 'lucide-react';
import { apiService } from '../services/apiService';
import { Event } from '../types';

interface EventDetailProps {
  eventId: string;
  onBack: () => void;
}

export const EventDetail = ({ eventId, onBack }: EventDetailProps) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập load dữ liệu sự kiện từ ID
    apiService.getEvents().then(events => {
      const found = events.find(e => e.id === eventId);
      setEvent(found || events[0]);
      setLoading(false);
    });
  }, [eventId]);

  if (loading || !event) return <div className="p-10 text-center text-neutral-400 font-bold animate-pulse">Đang tải thông tin sự kiện...</div>;

  // Mock data cho sơ đồ ghế thời gian thực
  const rows = 12;
  const cols = 15;
  const seatStates = Array.from({ length: rows * cols }).map((_, i) => {
    // Giả lập trạng thái ghế ngẫu nhiên
    const rand = Math.random();
    if (rand > 0.7) return 'sold';
    if (rand > 0.6) return 'held';
    return 'available';
  });

  const stats = {
    revenue: 450000000,
    sold: 124,
    total: 180,
    held: 15
  };

  return (
    <div className="space-y-8 font-sans px-4 lg:px-[10%] py-12">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-white/50"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-black text-white tracking-tight">{event.title}</h2>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
              event.status === 'Selling' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-white/10 text-white/50 border-white/10'
            }`}>
              {event.status === 'Selling' ? 'Đang bán' : 'Bản nháp'}
            </span>
          </div>
          <p className="text-white/40 font-medium">Chi tiết hiệu suất và quản lý chỗ ngồi</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Doanh thu thu về', value: '450M', sub: 'VND', trend: '+8.2%', color: 'primary', icon: Wallet },
          { label: 'Vé đã bán', value: stats.sold, sub: `/ ${stats.total}`, trend: `${((stats.sold/stats.total)*100).toFixed(1)}%`, progress: true, color: 'secondary', icon: Ticket },
          { label: 'Ghế đang được giữ', value: stats.held, sub: 'Đang thanh toán', color: 'emerald', icon: Lock },
          { label: 'Giá vé trung bình', value: '1.2M', sub: 'VND', trend: 'Ổn định', color: 'black', icon: TrendingUp },
        ].map((card, i) => (
          <div key={i} className="bg-pure-black rounded-2xl p-8 shadow-sm border border-white/5 group hover:shadow-md hover:border-white/10 transition-all">
            <div className="flex justify-between items-start mb-6">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{card.label}</p>
              <div className={`p-2 rounded-lg ${
                card.color === 'primary' ? 'bg-primary/10 text-primary' : 
                card.color === 'secondary' ? 'bg-white text-black' : 
                card.color === 'emerald' ? 'bg-emerald-50 text-emerald-500' : 'bg-white/5 text-white/30'
              }`}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-white">{card.value}</h3>
              <span className="text-xs font-bold text-white/30">{card.sub}</span>
            </div>
            {card.progress ? (
              <div className="mt-4 w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                <div className="bg-white h-full rounded-full transition-all duration-1000" style={{ width: `${(stats.sold/stats.total)*100}%` }}></div>
              </div>
            ) : (
              <div className="mt-3 flex items-center gap-1">
                <span className="text-[10px] font-black text-primary">{card.trend}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-pure-black rounded-3xl shadow-sm border border-white/5 p-12 flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-8 left-8 flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Trạng thái thời gian thực</span>
          </div>
          
          <div className="w-full max-w-xl h-10 bg-white rounded-t-[40px] flex items-center justify-center text-black/20 text-[10px] font-black tracking-[0.8em] mb-12 shadow-2xl">SÂN KHẤU</div>
          
          <div className="grid grid-cols-15 gap-2.5">
            {seatStates.map((state, i) => (
              <div 
                key={i} 
                className={`w-7 h-7 rounded-md transition-all shadow-sm ${
                  state === 'sold' ? 'bg-white' : 
                  state === 'held' ? 'bg-primary' : 
                  'bg-pure-black border border-white/10'
                }`}
                title={`Ghế ${Math.floor(i/cols)+1}-${(i%cols)+1} (${state})`}
              />
            ))}
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8 p-6 bg-white/5 rounded-3xl border border-white/5">
             <div className="flex items-center gap-3">
               <div className="w-5 h-5 bg-white rounded shadow-sm"></div>
               <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Đã mua</span>
             </div>
             <div className="flex items-center gap-3">
               <div className="w-5 h-5 bg-primary rounded shadow-sm"></div>
               <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Đang giữ</span>
             </div>
             <div className="flex items-center gap-3">
               <div className="w-5 h-5 bg-pure-black border border-white/20 rounded shadow-sm"></div>
               <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Trống</span>
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="bg-pure-black rounded-3xl shadow-sm border border-white/5 p-8 space-y-8">
              <h3 className="font-black text-lg text-white uppercase tracking-widest">Thông tin địa điểm</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-primary shadow-sm"><MapPin className="w-6 h-6" /></div>
                  <div>
                    <p className="text-sm font-black text-white">{event.venueName}</p>
                    <p className="text-xs font-bold text-white/30 mt-0.5">{event.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-primary shadow-sm"><Calendar className="w-6 h-6" /></div>
                  <div>
                    <p className="text-sm font-black text-white">{new Date(event.startDate).toLocaleDateString('vi-VN')}</p>
                    <p className="text-xs font-bold text-white/30 mt-0.5">Bắt đầu lúc {event.startTime}</p>
                  </div>
                </div>
              </div>
              <div className="pt-8 border-t border-white/5">
                <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-6">Chi tiết hạng vé</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                    <span className="text-xs font-black text-white/40 uppercase tracking-widest">Vé VIP</span>
                    <span className="font-black text-white">2.000.000₫</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                    <span className="text-xs font-black text-white/40 uppercase tracking-widest">Vé Thường</span>
                    <span className="font-black text-white">1.000.000₫</span>
                  </div>
                </div>
              </div>
           </div>

           <div className="bg-ticketbox-green rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl group transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-40 h-40" />
              </div>
              <h3 className="text-xl font-black mb-2 relative z-10 uppercase tracking-widest">Tỉ lệ lấp đầy</h3>
              <p className="text-white/60 text-xs mb-8 relative z-10 uppercase font-bold tracking-widest">Hiệu suất bán vé hiện tại</p>
              
              <div className="flex items-baseline gap-2 mb-4 relative z-10">
                <span className="text-6xl font-black leading-none text-white">62</span>
                <span className="text-2xl font-black text-white">%</span>
              </div>
              
              <div className="w-full bg-black/20 rounded-full h-3 mb-8 relative z-10 border border-black/10">
                <div className="bg-white h-full rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all duration-1000" style={{ width: '62%' }}></div>
              </div>
              
              <button className="w-full bg-white text-ticketbox-green font-black py-4 rounded-2xl hover:bg-gray-100 active:scale-95 transition-all shadow-lg relative z-10 uppercase tracking-widest text-sm">
                Gửi báo cáo doanh thu
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
