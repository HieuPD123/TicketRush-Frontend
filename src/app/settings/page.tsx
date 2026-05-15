'use client';

import { Settings, Shield, Bell, CreditCard, User, Save } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-8 font-sans">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">Cài đặt hệ thống</h2>
        <p className="text-white/40 mt-1 font-bold uppercase tracking-widest text-[10px]">Quản lý cấu hình tổ chức và tùy chỉnh cá nhân</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <aside className="md:col-span-3 space-y-2">
          {[
            { label: 'Tài khoản', icon: User, active: true },
            { label: 'Thông báo', icon: Bell },
            { label: 'Bảo mật', icon: Shield },
            { label: 'Thanh toán', icon: CreditCard },
            { label: 'Hệ thống', icon: Settings },
          ].map((item) => (
            <button 
              key={item.label}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                item.active ? 'bg-ticketbox-green text-black shadow-lg shadow-ticketbox-green/20' : 'text-white/40 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </aside>

        <main className="md:col-span-9 space-y-8">
          <section className="bg-pure-black rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/5 bg-white/[0.02]">
              <h3 className="font-black text-white uppercase tracking-tighter">Thông tin tài khoản</h3>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 rounded-[32px] overflow-hidden border border-white/10 relative group bg-white/5">
                  <img 
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" 
                    className="w-full h-full object-cover group-hover:opacity-50 transition-all"
                    alt="Profile"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-[10px] font-black uppercase text-white bg-black/50 px-3 py-1 rounded-full">Thay đổi</button>
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-black text-white">Quản trị viên</h4>
                  <p className="text-white/40 text-xs font-medium">admin@ticketrush.vn</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Họ và tên</label>
                  <input type="text" defaultValue="Quản trị viên" className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3.5 font-bold text-white outline-none focus:ring-2 focus:ring-ticketbox-green/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Số điện thoại</label>
                  <input type="text" defaultValue="0909 123 456" className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3.5 font-bold text-white outline-none focus:ring-2 focus:ring-ticketbox-green/20" />
                </div>
              </div>
            </div>
          </section>

          <footer className="flex justify-end gap-4">
            <button className="px-8 py-3.5 rounded-xl border border-white/10 font-bold text-white/40 hover:bg-white/5 transition-all text-xs uppercase tracking-widest">Khôi phục</button>
            <button className="bg-ticketbox-green text-black px-10 py-3.5 rounded-xl font-black shadow-xl shadow-ticketbox-green/20 flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all text-xs uppercase tracking-widest">
              <Save className="w-5 h-5" />
              Lưu thay đổi
            </button>
          </footer>
        </main>
      </div>
    </div>
  );
}
