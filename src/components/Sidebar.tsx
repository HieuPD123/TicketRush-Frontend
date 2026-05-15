'use client';

import { LayoutDashboard, Ticket, Users, BarChart3, Settings, HelpCircle, LogOut, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-pure-black border-r border-white/5 z-50 flex flex-col p-6 font-sans">
      <div className="mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-ticketbox-green flex items-center justify-center text-black shadow-lg shadow-ticketbox-green/20">
          <Ticket className="w-6 h-6 fill-black" />
        </div>
        <div>
          <h1 className="text-xl font-black text-white tracking-tighter leading-none uppercase">TicketRush</h1>
          <p className="text-[10px] font-bold text-ticketbox-green uppercase tracking-widest mt-1">Management</p>
        </div>
      </div>

      <Link href="/events/create" className="group w-full bg-ticketbox-green hover:brightness-110 text-black font-black py-3.5 rounded-xl mb-8 transition-all duration-300 ease-out active:scale-95 shadow-lg shadow-ticketbox-green/10 flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-xl hover:shadow-ticketbox-green/20">
        <Plus className="w-5 h-5 transition-all duration-300 ease-out group-hover:rotate-90" />
        <span className="transition-all duration-300 ease-out">Tạo Sự Kiện</span>
      </Link>

      <nav className="flex-1 space-y-1">
        {[
          { id: '', href: '/', label: 'Tổng quan', icon: LayoutDashboard },
          { id: 'events', href: '/events', label: 'Sự kiện', icon: Ticket },
          { id: 'customers', href: '/customers', label: 'Khách hàng', icon: Users },
          { id: 'reports', href: '/reports', label: 'Báo cáo', icon: BarChart3 },
          { id: 'settings', href: '/settings', label: 'Cài đặt', icon: Settings },
        ].map((item) => {
          const isActive = item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`group relative w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] ${
                isActive 
                  ? 'bg-white/10 text-white shadow-inner border border-white/5 shadow-white/5' 
                  : 'text-white/40 hover:bg-white/5 hover:text-white hover:shadow-md'
              }`}
            >
              {/* Active indicator */}
              <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-ticketbox-green rounded-r-full transition-all duration-300 ${
                isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              }`} />
              
              <item.icon className={`w-5 h-5 transition-all duration-300 ease-out ${
                isActive 
                  ? 'text-ticketbox-green scale-110' 
                  : 'text-current group-hover:scale-105'
              }`} />
              
              <span className="transition-all duration-300 ease-out">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-1 border-t border-white/5 pt-6">
        <button className="group w-full flex items-center gap-3 px-4 py-3 text-white/30 hover:bg-white/5 hover:text-white transition-all duration-300 ease-out font-bold text-sm rounded-xl hover:scale-[1.02] active:scale-[0.98]">
          <HelpCircle className="w-5 h-5 transition-all duration-300 ease-out group-hover:scale-105" />
          <span className="transition-all duration-300 ease-out">Hỗ Trợ</span>
        </button>
        <button className="group w-full flex items-center gap-3 px-4 py-3 text-white/30 hover:bg-white/5 hover:text-error transition-all duration-300 ease-out font-bold text-sm rounded-xl hover:scale-[1.02] active:scale-[0.98]">
          <LogOut className="w-5 h-5 transition-all duration-300 ease-out group-hover:scale-105" />
          <span className="transition-all duration-300 ease-out">Đăng Xuất</span>
        </button>
      </div>
    </aside>
  );
}
