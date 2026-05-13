import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Ticket, Wallet } from 'lucide-react';
import { apiService } from '../services/apiService';
import { TicketFeedItem } from '../types';

export const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    apiService.getDashboardStats().then(setStats);
  }, []);

  if (!stats) return <div className="p-10 text-center font-bold text-white/40 animate-pulse">Đang tải dữ liệu tổng quan...</div>;

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">Tổng quan</h2>
        <p className="text-white/40 mt-1 font-bold uppercase tracking-widest text-[10px]">Chỉ số thời gian thực và hiệu suất sự kiện</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Tổng doanh thu', value: '150M', sub: 'VND', trend: '+12.5%', color: 'primary', icon: Wallet },
          { label: 'Vé đã bán', value: '1,250', sub: '/ 2,000', trend: '62.5%', progress: true, color: 'secondary', icon: Ticket },
          { label: 'Sự kiện đang chạy', value: '8', sub: '3 địa điểm', color: 'neutral', icon: Users },
          { label: 'Khách đang xem', value: '342', sub: '+45 ngay lúc này', trend: 'Live', color: 'error', icon: TrendingUp },
        ].map((card, i) => (
          <div key={i} className="bg-pure-black rounded-2xl p-8 shadow-2xl border border-white/5 group hover:border-white/10 transition-all relative overflow-hidden">
            <div className="flex justify-between items-start mb-6 relative z-10">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{card.label}</p>
              <div className={`p-2 rounded-lg ${
                card.color === 'primary' ? 'bg-ticketbox-green/10 text-ticketbox-green' : 
                card.color === 'secondary' ? 'bg-white text-black' : 
                card.color === 'error' ? 'bg-error/10 text-error' : 'bg-white/5 text-white/30'
              }`}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 relative z-10">
              <h3 className="text-3xl font-black text-white">{card.value}</h3>
              <span className="text-xs font-bold text-white/30">{card.sub}</span>
            </div>
            {card.progress ? (
              <div className="mt-5 w-full bg-white/5 rounded-full h-1.5 relative z-10 overflow-hidden">
                <div className="bg-white h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.3)]" style={{ width: '62.5%' }}></div>
              </div>
            ) : (
              <div className="mt-4 flex items-center gap-2 relative z-10">
                <span className={`text-[10px] font-black uppercase tracking-widest ${card.color === 'primary' ? 'text-ticketbox-green' : 'text-white/30'}`}>{card.trend}</span>
                {card.trend === 'Live' ? <div className="w-2 h-2 bg-error rounded-full animate-pulse shadow-[0_0_8px_rgba(255,59,48,0.5)]"></div> : null}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-pure-black rounded-3xl shadow-2xl border border-white/5 flex flex-col min-h-[450px] overflow-hidden">
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Xu hướng doanh thu</h3>
            <select className="bg-white/5 border border-white/10 text-[10px] font-bold rounded-lg px-4 py-2 text-white/60 focus:ring-ticketbox-green uppercase tracking-widest outline-none">
              <option>7 ngày qua</option>
            </select>
          </div>
          <div className="p-8 flex-1">
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={stats.revenueTrends}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#24C373" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#24C373" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#ffffff40', fontWeight: 700 }} dy={10} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000000', borderRadius: '12px', border: '1px solid #ffffff10', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)', color: '#ffffff' }}
                  itemStyle={{ color: '#24C373', fontSize: '12px', fontWeight: 900 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#24C373" fillOpacity={1} fill="url(#colorRev)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-pure-black rounded-3xl shadow-2xl border border-white/5 flex flex-col overflow-hidden">
          <div className="p-8 border-b border-white/5 bg-white/[0.02]">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Khán giả</h3>
          </div>
          <div className="p-8 flex-1 space-y-10">
             <div className="flex items-center gap-8 justify-center">
               <div className="w-36 h-36">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie data={[{n: 'F', v: 55}, {n: 'M', v: 45}]} innerRadius={50} outerRadius={70} stroke="none" paddingAngle={8} dataKey="v">
                       <Cell fill="#24C373" />
                       <Cell fill="#f6faf7" />
                     </Pie>
                   </PieChart>
                 </ResponsiveContainer>
               </div>
               <div className="flex flex-col gap-4">
                 <div className="flex items-center gap-3">
                   <div className="w-3 h-3 bg-ticketbox-green rounded-full shadow-[0_0_10px_rgba(36,195,115,0.4)]"></div>
                   <span className="text-xs font-black text-white/60 tracking-widest uppercase">Nữ (55%)</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="w-3 h-3 bg-white rounded-full"></div>
                   <span className="text-xs font-black text-white/60 tracking-widest uppercase">Nam (45%)</span>
                 </div>
               </div>
             </div>

             <div className="space-y-6">
                <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Phân bố độ tuổi</h4>
                {[
                  { range: '18-24', pct: 30 },
                  { range: '25-34', pct: 45 },
                  { range: '35-44', pct: 15 },
                  { range: '45+', pct: 10 },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest mb-1.5">
                      <span className="text-white/30">{item.range}</span>
                      <span className="text-white">{item.pct}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-ticketbox-green h-full shadow-[0_0_10px_rgba(36,195,115,0.4)] transition-all duration-1000" style={{ width: `${item.pct}%` }}></div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-pure-black rounded-3xl shadow-2xl border border-white/5 p-8 font-sans">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Hoạt động đặt vé</h3>
            <button className="text-ticketbox-green font-black text-xs uppercase tracking-widest hover:underline">Xem tất cả</button>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/5">
            <table className="w-full text-left">
              <thead className="bg-white/5 border-b border-white/5">
                <tr>
                  <th className="p-5 text-[10px] font-black text-white/30 uppercase tracking-widest">Sự kiện</th>
                  <th className="p-5 text-[10px] font-black text-white/30 uppercase tracking-widest text-center">Hạng vé</th>
                  <th className="p-5 text-[10px] font-black text-white/30 uppercase tracking-widest text-right">Thời gian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats.recentTickets.map((ticket: TicketFeedItem) => (
                  <tr key={ticket.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="p-5">
                      <p className="font-black text-white text-md tracking-tight leading-tight">{ticket.eventName}</p>
                      <p className="text-[10px] text-white/30 font-black uppercase mt-0.5">#ORD-{ticket.orderNumber}</p>
                    </td>
                    <td className="p-5 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${ticket.tier === 'VIP Pass' ? 'bg-error/10 text-error border border-error/20' : 'bg-ticketbox-green/10 text-ticketbox-green border border-ticketbox-green/20'}`}>
                        {ticket.tier}
                      </span>
                    </td>
                    <td className="p-5 text-right text-[10px] text-white/30 font-black uppercase">
                      {ticket.timestamp === 'Just now' ? 'Vừa xong' : ticket.timestamp.replace('min ago', 'phút trước')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-pure-black rounded-3xl shadow-2xl border border-white/5 p-8 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Lấp đầy ghế</h3>
            <span className="bg-ticketbox-green/10 text-ticketbox-green px-4 py-1.5 rounded-full text-[10px] font-black border border-ticketbox-green/20 uppercase tracking-widest">85% Đã đặt</span>
          </div>
          <div className="flex-1 bg-white/[0.02] p-10 rounded-[40px] border border-white/5 flex flex-col items-center">
             <div className="w-full max-w-sm h-10 bg-white rounded-t-[40px] mb-10 flex items-center justify-center shadow-2xl">
               <span className="text-[10px] text-black/20 font-black tracking-[0.8em] uppercase">SÂN KHẤU</span>
             </div>
             <div className="grid grid-cols-12 gap-2.5 w-full max-w-md">
               {Array.from({ length: 48 }).map((_, i) => (
                 <div 
                   key={i} 
                   className={`w-full pt-[100%] rounded-md transition-all cursor-pointer hover:scale-125 hover:shadow-lg ${
                     i < 12 ? 'bg-error shadow-error/10' : i < 36 ? 'bg-ticketbox-green shadow-ticketbox-green/20' : 'bg-pure-black border border-white/20'
                   }`}
                 />
               ))}
             </div>
             <div className="flex gap-10 mt-12 p-6 bg-pure-black rounded-3xl shadow-2xl border border-white/5">
               <div className="flex items-center gap-3"><div className="w-4 h-4 bg-error rounded shadow-sm"></div><span className="text-[10px] font-black text-white/30 uppercase tracking-widest">VIP</span></div>
               <div className="flex items-center gap-3"><div className="w-4 h-4 bg-ticketbox-green rounded shadow-sm"></div><span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Thường</span></div>
               <div className="flex items-center gap-3"><div className="w-4 h-4 bg-pure-black border border-white/20 rounded shadow-sm"></div><span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Trống</span></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
