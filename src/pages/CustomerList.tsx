import { useState, useEffect } from 'react';
import { Search, User, Mail, Phone, ShoppingBag, ExternalLink, Filter, MoreHorizontal, X, Calendar, Ticket, ChevronRight, Edit3, Trash2, ShieldCheck, ShieldAlert } from 'lucide-react';
import { apiService } from '../services/apiService';
import { Customer } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export const CustomerList = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showActionsId, setShowActionsId] = useState<string | null>(null);

  useEffect(() => {
    apiService.getCustomers().then((data) => {
      setCustomers(data);
      setLoading(false);
    });
  }, []);

  const handleToggleStatus = (id: string) => {
    setCustomers((prev: Customer[]) => prev.map((c: Customer) => 
      c.id === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c
    ));
    setShowActionsId(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
      setCustomers((prev: Customer[]) => prev.filter((c: Customer) => c.id !== id));
      setShowActionsId(null);
    }
  };

  const filteredCustomers = customers.filter((c: Customer) => 
    c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (loading) return <div className="p-10 text-center text-white/50 animate-pulse font-bold uppercase tracking-widest text-[10px]">Đang tải danh sách khách hàng...</div>;

  return (
    <div className="space-y-8 font-sans pb-20 relative">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">Khách hàng</h2>
          <p className="text-white/40 mt-1 font-bold uppercase tracking-widest text-[10px]">Quản lý thông tin và lịch sử mua vé của khách hàng</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-white/5 hover:bg-white/10 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all border border-white/5 shadow-lg active:scale-95 text-xs uppercase">
            <Filter className="w-5 h-5" />
            Bộ lọc
          </button>
          <button className="bg-ticketbox-green hover:brightness-110 text-black font-black px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-ticketbox-green/20 active:scale-95 text-xs uppercase">
            <User className="w-5 h-5" />
            Thêm khách hàng
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Tổng khách hàng', value: customers.length, sub: '8 khách mới hôm nay', icon: User, color: 'primary' },
          { label: 'Khách hàng Active', value: customers.filter((c: Customer) => c.status === 'Active').length, sub: '92% tỉ lệ hoạt động', icon: User, color: 'black' },
          { label: 'Tổng chi tiêu', value: formatCurrency(customers.reduce((acc: number, c: Customer) => acc + c.totalSpent, 0)), sub: 'Trung bình 1.2tr/khách', icon: ShoppingBag, color: 'black' },
          { label: 'Yêu cầu hỗ trợ', value: '2', sub: 'Cần phản hồi gấp', icon: Mail, color: 'error' },
        ].map((stat, i) => (
          <div key={i} className="bg-pure-black p-6 rounded-3xl border border-white/5 flex flex-col gap-4 shadow-xl hover:border-white/10 transition-all">
             <div className="flex justify-between items-start">
               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                 stat.color === 'primary' ? 'bg-ticketbox-green text-black' : 
                 stat.color === 'black' ? 'bg-white/5 text-white' : 
                 'bg-error/10 text-error'
               }`}>
                  <stat.icon className="w-5 h-5" />
               </div>
               <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Live</span>
             </div>
             <div>
               <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
               <h4 className="text-2xl font-black text-white leading-none truncate">{stat.value}</h4>
               <p className="text-[9px] font-bold text-white/20 mt-2 italic">{stat.sub}</p>
             </div>
          </div>
        ))}
      </div>

      {/* List Area */}
      <div className="bg-pure-black rounded-3xl border border-white/5 shadow-2xl overflow-hidden min-h-[400px]">
        <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/[0.02]">
          <h3 className="text-xl font-black text-white uppercase tracking-tighter">Danh sách tài khoản</h3>
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
            <input 
              type="text" 
              placeholder="Tìm tên, email hoặc số điện thoại..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/5 rounded-xl pl-11 pr-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-ticketbox-green/20 w-full text-white placeholder:text-white/20 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/[0.02]">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-white/30 uppercase tracking-widest">Khách hàng</th>
                <th className="px-8 py-5 text-[10px] font-black text-white/30 uppercase tracking-widest">Liên hệ</th>
                <th className="px-8 py-5 text-[10px] font-black text-white/30 uppercase tracking-widest text-center">Đơn hàng</th>
                <th className="px-8 py-5 text-[10px] font-black text-white/30 uppercase tracking-widest text-right">Tổng chi tiêu</th>
                <th className="px-8 py-5 text-[10px] font-black text-white/30 uppercase tracking-widest text-center">Trạng thái</th>
                <th className="px-8 py-5 text-[10px] font-black text-white/30 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-white/[0.03] group transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white/5 overflow-hidden border border-white/10 shadow-sm relative shrink-0">
                        {customer.avatarUrl ? (
                          <img src={customer.avatarUrl} alt={customer.fullName} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/20 font-black text-xl">
                            {customer.fullName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-black text-white text-lg leading-tight mb-0.5 group-hover:text-ticketbox-green transition-colors">{customer.fullName}</p>
                        <p className="text-[10px] text-white/30 font-black uppercase tracking-wider">ID: {customer.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-white/50 text-sm font-medium">
                        <Mail className="w-3 h-3 text-ticketbox-green" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-white/30 text-[11px] font-bold">
                        <Phone className="w-3 h-3" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <p className="text-sm font-black text-white">{customer.ordersCount}</p>
                    <p className="text-[9px] text-white/20 font-black uppercase">Đơn hàng</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <p className="text-sm font-black text-ticketbox-green">{formatCurrency(customer.totalSpent)}</p>
                    <p className="text-[9px] text-white/20 font-black uppercase">Cuối: {customer.lastOrderDate}</p>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      customer.status === 'Active' ? 'bg-ticketbox-green/10 text-ticketbox-green border-ticketbox-green/20' :
                      'bg-white/5 text-white/30 border-white/10'
                    }`}>
                      {customer.status === 'Active' ? 'Hoạt động' : 'Khóa'}
                    </span>
                  </td>
                  <td className="px-8 py-6 relative">
                    <div className="flex justify-end gap-2">
                       <button 
                        onClick={() => setSelectedCustomer(customer)}
                        className="p-3 text-white/20 hover:bg-white/5 hover:text-ticketbox-green rounded-xl transition-all"
                        title="Xem chi tiết"
                       >
                        <ExternalLink className="w-5 h-5" />
                      </button>
                      <div className="relative">
                        <button 
                          onClick={() => setShowActionsId(showActionsId === customer.id ? null : customer.id)}
                          className={`p-3 rounded-xl transition-all ${showActionsId === customer.id ? 'bg-white/10 text-white' : 'text-white/20 hover:bg-white/5 hover:text-white'}`}
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                        {showActionsId === customer.id && (
                          <div className="absolute right-0 top-full mt-2 w-48 bg-pure-black border border-white/10 rounded-2xl shadow-2xl z-50 p-2 overflow-hidden animate-in fade-in zoom-in duration-200">
                             <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-white/60 hover:bg-white/5 hover:text-white transition-all">
                               <Edit3 className="w-4 h-4 text-ticketbox-green" /> Chỉnh sửa
                             </button>
                             <button 
                              onClick={() => handleToggleStatus(customer.id)}
                              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-white/60 hover:bg-white/5 hover:text-white transition-all"
                             >
                               {customer.status === 'Active' ? <ShieldAlert className="w-4 h-4 text-error" /> : <ShieldCheck className="w-4 h-4 text-ticketbox-green" />}
                               {customer.status === 'Active' ? 'Khóa tài khoản' : 'Kích hoạt'}
                             </button>
                             <div className="my-1 border-t border-white/5"></div>
                             <button 
                              onClick={() => handleDelete(customer.id)}
                              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-error/60 hover:bg-error/10 hover:text-error transition-all"
                             >
                               <Trash2 className="w-4 h-4" /> Xóa dữ liệu
                             </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-white/20 font-bold uppercase tracking-widest text-[10px]">
                    Không tìm thấy khách hàng phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Side Panel */}
      <AnimatePresence>
        {selectedCustomer && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCustomer(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-xl bg-pure-black border-l border-white/5 z-[101] shadow-2xl p-8 flex flex-col"
            >
              <div className="flex justify-between items-center mb-10">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-ticketbox-green rounded-full shadow-[0_0_10px_rgba(36,195,115,0.5)]"></div>
                    <h3 className="text-sm font-black text-white/40 uppercase tracking-[0.3em]">Hồ sơ chi tiết</h3>
                 </div>
                 <button 
                  onClick={() => setSelectedCustomer(null)}
                  className="p-2 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-full transition-all"
                 >
                   <X className="w-6 h-6" />
                 </button>
              </div>

              <div className="flex items-center gap-6 mb-12">
                <div className="w-24 h-24 rounded-[32px] overflow-hidden border border-white/10 shadow-2xl relative bg-white/5">
                   {selectedCustomer.avatarUrl ? (
                     <img src={selectedCustomer.avatarUrl} alt={selectedCustomer.fullName} className="w-full h-full object-cover" />
                   ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20 font-black text-3xl">
                        {selectedCustomer.fullName.charAt(0)}
                      </div>
                   )}
                </div>
                <div>
                   <h4 className="text-3xl font-black text-white tracking-tight leading-none mb-2">{selectedCustomer.fullName}</h4>
                   <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        selectedCustomer.status === 'Active' ? 'bg-ticketbox-green/10 text-ticketbox-green border-ticketbox-green/20' :
                        'bg-white/5 text-white/30 border-white/10'
                      }`}>
                        {selectedCustomer.status === 'Active' ? 'Hoạt động' : 'Bị khóa'}
                      </span>
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-widest italic leading-none">Tham gia từ 2023</span>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-10">
                 <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-3">Tổng chi tiêu</p>
                    <p className="text-2xl font-black text-ticketbox-green">{formatCurrency(selectedCustomer.totalSpent)}</p>
                 </div>
                 <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-3">Đơn hàng hoàn tất</p>
                    <p className="text-2xl font-black text-white">{selectedCustomer.ordersCount}</p>
                 </div>
              </div>

              <div className="space-y-6 flex-1 overflow-y-auto pr-2 no-scrollbar">
                 <h5 className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-4">Thông tin liên lạc</h5>
                 <div className="space-y-4">
                    <div className="flex items-center gap-4 group">
                       <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-ticketbox-green group-hover:bg-ticketbox-green group-hover:text-black transition-all">
                          <Mail className="w-4 h-4" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-0.5">Email</p>
                          <p className="text-sm font-bold text-white/80">{selectedCustomer.email}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4 group">
                       <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-ticketbox-green group-hover:bg-ticketbox-green group-hover:text-black transition-all">
                          <Phone className="w-4 h-4" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-0.5">Số điện thoại</p>
                          <p className="text-sm font-bold text-white/80">{selectedCustomer.phone}</p>
                       </div>
                    </div>
                 </div>

                 <div className="pt-8 mt-4 border-t border-white/5">
                    <h5 className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-6 flex justify-between">
                       Lịch sử vé gần đây
                       <button className="text-ticketbox-green hover:underline lowercase italic">Xem tất cả</button>
                    </h5>
                    <div className="space-y-4">
                       {[
                         { id: '1', title: 'Jimmii Nguyễn - Tri kỷ', date: '2024-05-10', price: '2.000.000₫', type: 'VIP', icon: Ticket },
                         { id: '2', title: 'Chung kết LCK Mùa Hè', date: '2024-03-15', price: '450.000₫', type: 'Thường', icon: Ticket },
                       ].map((ticket) => (
                         <div key={ticket.id} className="bg-white/[0.02] hover:bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4 transition-all cursor-pointer group">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/30 group-hover:text-ticketbox-green transition-all">
                               <ticket.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                               <p className="text-xs font-black text-white mb-0.5">{ticket.title}</p>
                               <div className="flex items-center gap-3">
                                  <span className="text-[9px] font-bold text-white/30 flex items-center gap-1 uppercase tracking-widest">
                                    <Calendar className="w-3 h-3" /> {ticket.date}
                                  </span>
                                  <span className="text-[9px] font-black text-ticketbox-green uppercase tracking-widest">{ticket.type}</span>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="text-xs font-black text-white">{ticket.price}</p>
                               <ChevronRight className="inline w-3 h-3 text-white/20" />
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              <button className="w-full bg-ticketbox-green hover:brightness-110 text-black font-black py-4 rounded-2xl mt-8 transition-all shadow-xl shadow-ticketbox-green/20 uppercase tracking-widest text-sm">
                 Xuất dữ liệu khách hàng
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

