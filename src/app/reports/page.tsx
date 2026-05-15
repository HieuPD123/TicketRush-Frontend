'use client';

import { BarChart3, TrendingUp, Download, Calendar } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function ReportsPage() {
  const data = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 900 },
  ];

  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">Báo cáo & Phân tích</h2>
          <p className="text-white/40 mt-1 font-bold uppercase tracking-widest text-[10px]">Theo dõi hiệu suất kinh doanh qua các chỉ số chi tiết</p>
        </div>
        <button className="bg-white/5 hover:bg-white/10 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all border border-white/5 shadow-lg active:scale-95 text-xs uppercase">
          <Download className="w-5 h-5" />
          Xuất báo cáo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Tỷ lệ chuyển đổi', value: '4.2%', trend: '+0.5%', icon: TrendingUp },
          { label: 'Giá trị đơn TB', value: '1,250,000₫', trend: '+12%', icon: BarChart3 },
          { label: 'Tỉ lệ quay lại', value: '28%', trend: '-2%', icon: Calendar },
        ].map((stat, i) => (
          <div key={i} className="bg-pure-black p-8 rounded-3xl border border-white/5 shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{stat.label}</p>
              <stat.icon className="w-5 h-5 text-ticketbox-green" />
            </div>
            <h4 className="text-3xl font-black text-white mb-2">{stat.value}</h4>
            <span className={`text-[10px] font-black uppercase ${stat.trend.startsWith('+') ? 'text-ticketbox-green' : 'text-error'}`}>
              {stat.trend} so với tháng trước
            </span>
          </div>
        ))}
      </div>

      <div className="bg-pure-black rounded-3xl border border-white/5 p-8 shadow-2xl">
        <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-8">Biểu đồ tăng trưởng</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#ffffff20' }} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#000000', borderRadius: '12px', border: '1px solid #ffffff10' }}
                itemStyle={{ color: '#24C373' }}
              />
              <Area type="monotone" dataKey="value" stroke="#24C373" fill="#24C37320" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
