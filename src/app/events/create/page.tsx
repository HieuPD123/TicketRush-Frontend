'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket, ArrowLeft, ArrowRight, Calendar, MapPin, Info, Plus, Trash2 } from 'lucide-react';
import { apiService } from '@/services/apiService';
import { useRouter } from 'next/navigation';

// Danh sách các màu hỗ trợ cho hạng vé (Khu vực)
const TAILWIND_TO_HEX: Record<string, string> = {
  'bg-error': '#EF4444',       
  'bg-primary': '#3B82F6',     
  'bg-secondary': '#6B7280',   
  'bg-emerald-500': '#10B981', 
  'bg-purple-500': '#8B5CF6',  
  'bg-amber-500': '#F59E0B'    
};

const TIER_COLORS = Object.keys(TAILWIND_TO_HEX);

export default function CreateEventPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [images] = useState<string[]>([
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop'
  ]);
  
  // State quản lý sơ đồ: 1 Khu vực = 1 Hạng vé
  const [sections, setSections] = useState([
    { 
      id: '1', 
      name: 'Khu vực VIP', 
      rows: 5, 
      seatsPerRow: 10, 
      price: 1000000, 
      color: 'bg-error' 
    }
  ]);

  const [selectedSectionId, setSelectedSectionId] = useState('1');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue: '',
    startTime: '',
    endTime: '',
    longitude: '',
    latitude: '',
    type: 'LIVE_MUSIC' as 'LIVE_MUSIC' | 'SPORTS' | 'THEATER',
    posterUrl: '',
  });

  const activeSection = sections.find(s => s.id === selectedSectionId) || sections[0];

  // --- CÁC HÀM XỬ LÝ KHU VỰC (HẠNG VÉ) ---
  const addSection = () => {
    const newId = Date.now().toString();
    const colorIndex = sections.length % TIER_COLORS.length;
    setSections([...sections, {
      id: newId,
      name: `Khu vực ${sections.length + 1}`,
      rows: 5,
      seatsPerRow: 10,
      price: 500000,
      color: TIER_COLORS[colorIndex]
    }]);
    setSelectedSectionId(newId);
  };

  const deleteSection = (id: string) => {
    if (sections.length === 1) {
      alert('Sự kiện phải có ít nhất một khu vực (hạng vé)!');
      return;
    }
    const newSections = sections.filter(s => s.id !== id);
    setSections(newSections);
    if (selectedSectionId === id) {
      setSelectedSectionId(newSections[0].id);
    }
  };

  const updateSection = (id: string, updates: any) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  // --- ĐIỀU HƯỚNG ---
  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  // --- XỬ LÝ GỌI API ---
  const handlePublish = async () => {
    try {
      // 1. Kiểm tra thông tin sự kiện cơ bản
      if (!formData.title || !formData.venue) {
        alert('Vui lòng điền tên sự kiện và địa điểm!'); return;
      }
      if (!formData.startTime || !formData.endTime) {
        alert('Vui lòng chọn thời gian bắt đầu và kết thúc!'); return;
      }
      if (new Date(formData.endTime) <= new Date(formData.startTime)) {
        alert('Thời gian kết thúc phải lớn hơn thời gian bắt đầu!'); return;
      }

      // 2. Lọc ra danh sách các khu vực (Zone) hợp lệ
      const validSections = sections.filter(
        section => section.name.trim() !== '' && section.seatsPerRow > 0 && section.rows > 0
      );

      if (validSections.length === 0) {
        alert('Vui lòng đặt tên và thiết lập số ghế cho ít nhất một khu vực ở Bước 2!'); return;
      }

      // 3. Gọi API tạo sự kiện chính
      const createdEvent = await apiService.createEvent({
        title: formData.title.trim(),
        description: formData.description.trim(),
        venue: formData.venue.trim(),
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        longitude: Number(formData.longitude) || 0,
        latitude: Number(formData.latitude) || 0,
        type: formData.type,
        posterUrl: formData.posterUrl || images[0],
        endTimeAfterStartTime: true, 
      });

      // 4. Gọi API tạo khu vực (Zones) bằng Promise.all để chạy song song
      try {
        const zonePromises = validSections.map((section) => {
          return apiService.createZone(createdEvent.id, {
            name: section.name.trim(),
            price: Number(section.price),
            totalRows: Number(section.rows),
            totalCols: Number(section.seatsPerRow),
            colorHex: TAILWIND_TO_HEX[section.color] || '#FFFFFF', 
          });
        });

        await Promise.all(zonePromises);

        alert('Tạo sự kiện và sơ đồ chỗ ngồi thành công!');
        router.push('/events');

      } catch (zoneError: any) {
        console.error('Lỗi API tạo Zone:', zoneError);
        alert('Sự kiện đã được tạo, nhưng gặp sự cố khi tạo các khu vực ghế. Vui lòng kiểm tra lại!');
        router.push('/events'); 
      }

    } catch (eventError: any) {
      console.error('Lỗi API tạo Event:', eventError);
      alert(`Có lỗi xảy ra khi tạo sự kiện: ${eventError.message || 'Vui lòng kiểm tra console'}`);
    }
  };

  const onCancel = () => router.push('/events');

  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Bước Header */}
      <div className="flex items-center justify-between mb-12 font-sans px-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">
            {step === 1 ? 'Thông tin sự kiện' : step === 2 ? 'Sơ đồ chỗ ngồi' : 'Kiểm tra & Xuất bản'}
          </h2>
          <p className="text-white/40 mt-1 font-bold uppercase tracking-widest text-[10px]">
            Điền đầy đủ thông tin để khởi tạo trải nghiệm tiếp theo của bạn.
          </p>
        </div>
        <div className="flex gap-4">
          <button onClick={onCancel} className="px-6 py-2.5 rounded-xl border border-white/10 font-black text-xs text-white/40 hover:bg-white/5 transition-all uppercase tracking-widest">
            Hủy bỏ
          </button>
          {step < 3 ? (
            <button onClick={nextStep} className="px-6 py-2.5 rounded-xl bg-ticketbox-green text-black font-black text-xs hover:brightness-110 shadow-lg shadow-ticketbox-green/20 transition-all flex items-center gap-2 uppercase tracking-widest">
              Tiếp theo <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handlePublish} className="px-6 py-2.5 rounded-xl bg-white text-black font-black text-xs hover:bg-neutral-200 shadow-lg shadow-white/10 transition-all flex items-center gap-2 uppercase tracking-widest">
              Xuất bản <Rocket className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-4 mb-12 font-sans px-4">
        {[1, 2, 3].map(i => (
          <div key={i} className={`flex items-center gap-3 ${step < i ? 'opacity-40' : ''} transition-opacity`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${step >= i ? 'bg-ticketbox-green text-black shadow-md shadow-ticketbox-green/20' : 'bg-white/5 text-white/20 border border-white/5'}`}>
              {i}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${step >= i ? 'text-ticketbox-green' : 'text-white/20'}`}>
              {i === 1 ? 'Thông tin' : i === 2 ? 'Sơ đồ' : 'Kiểm tra'}
            </span>
            {i < 3 && <div className="h-px w-16 bg-white/5"></div>}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* --- BƯỚC 1: THÔNG TIN CƠ BẢN --- */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 px-4">
            <section className="bg-pure-black rounded-3xl shadow-sm border border-white/5 overflow-hidden">
               <div className="px-8 py-5 border-b border-white/5 bg-white/[0.02] flex items-center gap-3">
                 <Info className="w-5 h-5 text-ticketbox-green" />
                 <h3 className="font-black text-white uppercase tracking-tighter">Thông tin cơ bản</h3>
               </div>
               <div className="p-8 space-y-6">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Tên sự kiện</label>
                   <input type="text" placeholder="Ví dụ: Lễ hội Âm nhạc Mùa hè 2024" className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-ticketbox-green/20 outline-none font-bold text-white" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Mô tả</label>
                   <textarea rows={4} placeholder="Mô tả chi tiết về sự kiện..." className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3.5 font-bold text-white outline-none focus:ring-2 focus:ring-ticketbox-green/20 resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Địa điểm</label>
                   <input type="text" placeholder="Ví dụ: Sân vận động Mỹ Đình" className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3.5 font-bold text-white outline-none focus:ring-2 focus:ring-ticketbox-green/20" value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} />
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Bắt đầu</label>
                       <input type="datetime-local" className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3.5 font-bold text-white outline-none focus:ring-2 focus:ring-ticketbox-green/20" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Kết thúc</label>
                       <input type="datetime-local" className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3.5 font-bold text-white outline-none focus:ring-2 focus:ring-ticketbox-green/20" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} />
                    </div>
                 </div>
                 <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Longitude</label>
                       <input type="number" step="0.000001" placeholder="0.1" className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3.5 font-bold text-white outline-none focus:ring-2 focus:ring-ticketbox-green/20" value={formData.longitude} onChange={e => setFormData({...formData, longitude: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Latitude</label>
                       <input type="number" step="0.000001" placeholder="0.1" className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3.5 font-bold text-white outline-none focus:ring-2 focus:ring-ticketbox-green/20" value={formData.latitude} onChange={e => setFormData({...formData, latitude: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Loại</label>
                       <select className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3.5 font-bold text-white outline-none focus:ring-2 focus:ring-ticketbox-green/20" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                         <option value="LIVE_MUSIC">LIVE_MUSIC</option>
                         <option value="SPORTS">SPORTS</option>
                         <option value="THEATER">THEATER</option>
                       </select>
                    </div>
                 </div>
                 <div className="space-y-2">
                       <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">URL Poster</label>
                       <input type="url" placeholder="https://example.com/poster.jpg" className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3.5 font-bold text-white outline-none focus:ring-2 focus:ring-ticketbox-green/20" value={formData.posterUrl} onChange={e => setFormData({...formData, posterUrl: e.target.value})} />
                 </div>
               </div>
            </section>
          </motion.div>
        )}

        {/* --- BƯỚC 2: TẠO SƠ ĐỒ CHỖ NGỒI --- */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6 px-4">
            
            {/* Tabs chọn Khu Vực / Hạng vé */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {sections.map(s => (
                <div key={s.id} className="relative group">
                  <button 
                    onClick={() => setSelectedSectionId(s.id)}
                    className={`px-5 py-2.5 rounded-xl font-black text-xs whitespace-nowrap transition-all uppercase tracking-wider border flex items-center gap-2 ${
                      selectedSectionId === s.id 
                        ? 'bg-ticketbox-green text-black border-ticketbox-green shadow-md shadow-ticketbox-green/20' 
                        : 'bg-pure-black text-white/40 border-white/5 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className={`w-2.5 h-2.5 rounded-full ${s.color}`}></div>
                    {s.name || 'Khu vực mới'}
                  </button>
                  {selectedSectionId === s.id && (
                     <button onClick={() => deleteSection(s.id)} className="absolute -top-2 -right-2 bg-error text-white p-1 rounded-full shadow-lg hover:scale-110 transition-transform">
                       <Trash2 className="w-3 h-3" />
                     </button>
                  )}
                </div>
              ))}
              <button onClick={addSection} className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/5 text-ticketbox-green font-black text-xs hover:bg-white/10 flex items-center gap-2 uppercase tracking-wider">
                <Plus className="w-4 h-4" /> Thêm Khu Vực
              </button>
            </div>

            <div className="grid grid-cols-12 gap-8">
              {/* Cột trái: Form điều khiển Khu Vực */}
              <div className="col-span-5 space-y-6">
                
                <div className="bg-pure-black rounded-3xl shadow-sm border border-white/5 p-8 space-y-6">
                   <h3 className="font-black text-lg text-white uppercase tracking-tighter">Cấu hình Hạng vé</h3>
                   <div className="space-y-5">
                     <div className="space-y-1">
                       <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Tên khu vực (Hạng vé)</label>
                       <input type="text" placeholder="Ví dụ: VIP, Thường..." value={activeSection.name} onChange={e => updateSection(activeSection.id, { name: e.target.value })} className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 font-bold text-white outline-none focus:ring-2 focus:ring-ticketbox-green/20" />
                     </div>
                     
                     <div className="space-y-1">
                       <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Giá vé (VND)</label>
                       <div className="relative">
                         <input type="text" value={activeSection.price === 0 ? '' : activeSection.price.toLocaleString()} placeholder="Nhập giá vé..." onChange={e => updateSection(activeSection.id, { price: parseInt(e.target.value.replace(/\D/g, '')) || 0 })} className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-4 pr-12 font-bold text-ticketbox-green outline-none focus:ring-2 focus:ring-ticketbox-green/20" />
                         <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-white/20 uppercase">VND</span>
                       </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1">
                          <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Số hàng ghế</label>
                          <input type="number" value={activeSection.rows} onChange={e => updateSection(activeSection.id, { rows: parseInt(e.target.value) || 0 })} className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 font-bold text-white outline-none focus:ring-2 focus:ring-ticketbox-green/20" />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Số ghế / 1 hàng</label>
                          <input type="number" value={activeSection.seatsPerRow} onChange={e => updateSection(activeSection.id, { seatsPerRow: parseInt(e.target.value) || 0 })} className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 font-bold text-white outline-none focus:ring-2 focus:ring-ticketbox-green/20" />
                       </div>
                     </div>

                     <div className="space-y-2 pt-2 border-t border-white/5">
                        <label className="text-[10px] font-black text-white/20 uppercase tracking-widest block mb-2">Màu sắc hiển thị</label>
                        <div className="flex gap-3">
                          {TIER_COLORS.map(color => (
                            <button
                              key={color}
                              onClick={() => updateSection(activeSection.id, { color })}
                              title="Chọn màu này"
                              className={`w-6 h-6 rounded-full transition-all ${color} ${
                                activeSection.color === color 
                                  ? 'ring-2 ring-offset-2 ring-offset-pure-black ring-white scale-125 shadow-md' 
                                  : 'opacity-40 hover:opacity-100 hover:scale-110'
                              }`}
                            />
                          ))}
                        </div>
                     </div>
                   </div>
                </div>
              </div>

              {/* Cột phải: Mô phỏng sơ đồ ghế của Khu Vực hiện tại */}
              <div className="col-span-7 bg-white/[0.01] rounded-3xl border border-white/5 overflow-hidden flex flex-col items-center p-8 shadow-inner font-sans relative">
                 <div className="absolute top-4 left-6 flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${activeSection.color}`}></div>
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{activeSection.name || 'Khu vực mới'}</span>
                 </div>

                 <div className="w-full max-w-sm h-10 bg-pure-black border border-white/10 rounded-t-[30px] flex items-center justify-center text-white/20 text-[10px] font-black tracking-[0.8em] mb-10 shadow-2xl mt-4">
                   SÂN KHẤU
                 </div>
                 <div className="overflow-auto max-h-[500px] w-full flex justify-center p-4 scrollbar-hide">
                  <div className="flex flex-col gap-2">
                    {Array.from({length: activeSection.rows}).map((_, r) => {
                      return (
                        <div key={r} className="flex gap-2 items-center">
                          <span className="text-[8px] font-black text-white/20 w-4 text-right pr-2">
                            {r + 1}
                          </span>
                          {Array.from({length: activeSection.seatsPerRow}).map((_, c) => {
                            return (
                              <div 
                                key={c} 
                                title={`${activeSection.name} - Hàng ${r+1} Ghế ${c+1}`}
                                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg shadow-sm transition-all hover:scale-110 cursor-help ${activeSection.color}`} 
                              />
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                 </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- BƯỚC 3: KIỂM TRA VÀ XUẤT BẢN --- */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-3 gap-8 px-4">
            <div className="col-span-2 space-y-8">
              <section className="bg-pure-black rounded-3xl shadow-sm border border-white/5 p-8 space-y-8 font-sans">
                <h3 className="text-xl font-black border-b border-white/5 pb-6 text-white uppercase tracking-tighter">Tổng kết sự kiện</h3>
                <div className="space-y-6">
                  <div className="flex flex-col gap-3 px-8 py-6 bg-white/[0.02] border border-white/5 rounded-[2rem]">
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Tên sự kiện</span>
                    <span className="text-2xl font-black text-white">{formData.title || '(Chưa đặt tên)'}</span>
                  </div>
                  <div className="flex flex-col gap-3 px-8 py-6 bg-white/[0.02] border border-white/5 rounded-[2rem]">
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Mô tả</span>
                    <span className="text-lg font-bold text-white/60">{formData.description || '(Chưa có mô tả)'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                     <div className="p-8 bg-white/[0.02] rounded-[2rem] border border-white/5 flex items-center gap-5">
                        <div className="bg-ticketbox-green text-black p-4 rounded-2xl shadow-lg shadow-ticketbox-green/20">
                           <Calendar className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Bắt đầu</p>
                          <p className="text-lg font-black text-white">{formData.startTime ? new Date(formData.startTime).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' }) : '(Chưa chọn ngày)'}</p>
                          <p className="text-sm font-bold text-white/40">{formData.startTime ? new Date(formData.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''}</p>
                        </div>
                     </div>
                     <div className="p-8 bg-white/[0.02] rounded-[2rem] border border-white/5 flex items-center gap-5">
                        <div className="bg-white text-black p-4 rounded-2xl shadow-lg shadow-white/20">
                           <Calendar className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Kết thúc</p>
                          <p className="text-lg font-black text-white">{formData.endTime ? new Date(formData.endTime).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' }) : '(Chưa chọn ngày)'}</p>
                          <p className="text-sm font-bold text-white/40">{formData.endTime ? new Date(formData.endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''}</p>
                        </div>
                     </div>
                     <div className="p-8 bg-white/[0.02] rounded-[2rem] border border-white/5 flex items-center gap-5">
                        <div className="bg-white text-black p-4 rounded-2xl shadow-lg shadow-white/20">
                           <MapPin className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Địa điểm</p>
                          <p className="text-lg font-black text-white">{formData.venue || '(Chưa chọn địa điểm)'}</p>
                        </div>
                     </div>
                  </div>
                  <div className="flex flex-col gap-3 px-8 py-6 bg-white/[0.02] border border-white/5 rounded-[2rem]">
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Poster sự kiện</span>
                    <div className="w-full h-48 bg-white/5 rounded-2xl overflow-hidden border border-white/10">
                      <img src={formData.posterUrl || images[0]} alt="Event poster" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = images[0]; }} />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center text-white/20 font-sans px-4">
        {step > 1 && (
          <button onClick={prevStep} className="flex items-center gap-2 px-8 py-3.5 rounded-xl border-2 border-ticketbox-green text-ticketbox-green font-black hover:bg-ticketbox-green/5 transition-all active:scale-95 uppercase tracking-widest text-xs">
            <ArrowLeft className="w-5 h-5" /> Quay lại
          </button>
        )}
        <div className="flex gap-4 ml-auto">
          <button className="px-8 py-3.5 rounded-xl font-black text-[10px] text-white/20 hover:text-white transition-colors uppercase tracking-widest">Lưu bản nháp</button>
          {step === 3 && (
             <button onClick={handlePublish} className="bg-ticketbox-green text-black px-10 py-3.5 rounded-xl font-black shadow-xl shadow-ticketbox-green/20 flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all uppercase tracking-widest text-xs">
              Xác nhận & Khởi động <Rocket className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}