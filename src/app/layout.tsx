import type { Metadata } from "next";
import "./globals.css";
import { Search } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: "TicketRush - Event Management Pro",
  description: "Professional event management dashboard with real-time analytics and ticketing logistics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="bg-dark-gray text-white antialiased">
        <div className="flex min-h-screen">
          <Sidebar />

          {/* Main Content Area */}
          <div className="flex-1 ml-[260px] flex flex-col min-h-screen">

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
            
            <main className="flex-1 p-8">
              <div className="max-w-[1440px] mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
