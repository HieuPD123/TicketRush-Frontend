import { LayoutDashboard, Ticket, Users, BarChart3, Settings, HelpCircle, LogOut, Search, Plus } from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export const Sidebar = ({ activePage, onNavigate }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'events', label: 'Sự kiện', icon: Ticket },
    { id: 'customers', label: 'Khách hàng', icon: Users },
    { id: 'reports', label: 'Báo cáo', icon: BarChart3 },
    { id: 'settings', label: 'Cài đặt', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-pure-black border-right border-white/5 z-50 flex flex-col p-6 font-sans">
      <div className="mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-ticketbox-green flex items-center justify-center text-black shadow-lg shadow-ticketbox-green/20">
          <Ticket className="w-6 h-6 fill-black" />
        </div>
        <div>
          <h1 className="text-xl font-black text-white tracking-tighter leading-none uppercase">Ticketbox</h1>
          <p className="text-[10px] font-bold text-ticketbox-green uppercase tracking-widest mt-1">Management</p>
        </div>
      </div>

      <button 
        onClick={() => onNavigate('create-event')}
        className="w-full bg-ticketbox-green hover:brightness-110 text-black font-black py-3.5 rounded-xl mb-8 transition-all active:scale-95 shadow-lg shadow-ticketbox-green/10 flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Tạo Sự Kiện
      </button>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = activePage === item.id || (activePage.startsWith('create') && item.id === 'events');
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                isActive
                  ? 'bg-ticketbox-green text-black'
                  : 'text-white/40 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto space-y-1 border-t border-white/5 pt-6">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-white/30 hover:bg-white/5 hover:text-white transition-all font-bold text-sm rounded-xl">
          <HelpCircle className="w-5 h-5" />
          Hỗ Trợ
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-white/30 hover:bg-white/5 hover:text-error transition-all font-bold text-sm rounded-xl">
          <LogOut className="w-5 h-5" />
          Đăng Xuất
        </button>
      </div>
    </aside>
  );
};

export const Header = () => {
  return (
    <header className="h-16 bg-pure-black border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-40 w-full shadow-md">
      <div className="flex items-center bg-white/5 rounded-xl px-4 py-2 w-80 focus-within:ring-2 focus-within:ring-ticketbox-green/50 transition-all border border-white/5">
        <Search className="text-white/20 mr-2 w-5 h-5" />
        <input 
          type="text" 
          className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-white/20 text-white font-medium" 
          placeholder="Tìm kiếm sự kiện..." 
        />
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2.5 text-white/40 hover:bg-white/5 hover:text-white rounded-full transition-colors relative border border-transparent">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-ticketbox-green rounded-full ring-2 ring-pure-black"></span>
        </button>
        
        <div className="h-8 w-px bg-white/5 mx-1"></div>
        
        <div className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-1.5 rounded-xl transition-colors border border-transparent">
          <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden shadow-sm">
             <img 
               src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" 
               alt="User"
               className="w-full h-full object-cover"
             />
          </div>
          <span className="font-bold text-sm text-white hidden md:block">Quản trị viên</span>
        </div>
      </div>
    </header>
  );
};

