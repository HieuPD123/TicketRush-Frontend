import { useState, useRef, type ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Save, Rocket, ArrowLeft, ArrowRight, Upload, Calendar, MapPin, Info, Plus, Minus, Trash2 } from 'lucide-react';
import { apiService } from '../services/apiService';
import { Event } from '../types';

interface CreateEventWizardProps {
  onComplete: () => void;
  initialEvent?: Event;
}

export const CreateEventWizard = ({ onComplete, initialEvent }: CreateEventWizardProps) => {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<string[]>(
    initialEvent?.bannerUrl ? [initialEvent.bannerUrl] : [
      'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop'
    ]
  );
  
  // Logic khởi tạo sections từ initialEvent (giả định nếu có)
  const [sections, setSections] = useState(initialEvent ? [
    { 
      id: '1', 
      name: initialEvent.venueName || 'Khu vực sàn A', 
      rows: 10, 
      seatsPerRow: 12, 
      tiers: [
        { id: 't1', name: 'VIP Premium', price: 2000000, color: 'bg-error', rowCount: 2 },
        { id: 't2', name: 'Thường', price: 1000000, color: 'bg-primary', rowCount: 8 }
      ]
    }
  ] : [
    { 
      id: '1', 
      name: 'Khu vực sàn A', 
      rows: 10, 
      seatsPerRow: 12, 
      tiers: [
        { id: 't1', name: 'VIP Premium', price: 2000000, color: 'bg-error', rowCount: 2 },
        { id: 't2', name: 'Thường', price: 1000000, color: 'bg-primary', rowCount: 8 }
      ]
    }
  ]);

  const [selectedSectionId, setSelectedSectionId] = useState('1');
  const [formData, setFormData] = useState<Partial<Event>>(initialEvent || {
    title: '',
    category: 'Concert',
    description: '',
    startDate: '',
    startTime: '',
    venueName: '',
    city: '',
    status: 'Draft'
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activeSection = sections.find(s => s.id === selectedSectionId) || sections[0];

  const updateSection = (id: string, updates: any) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const adjustTierRowCount = (tierId: string, delta: number) => {
    if (!activeSection) return;

    updateSection(activeSection.id, {
      tiers: activeSection.tiers.map(t => {
        if (t.id === tierId) {
          const newCount = Math.max(0, Math.min(activeSection.rows, t.rowCount + delta));
          return { ...t, rowCount: newCount };
        }
        return t;
      })
    });
  };

  const TIER_COLORS = ['bg-error', 'bg-primary', 'bg-secondary', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500'];

  const addTier = () => {
    if (!activeSection) return;

    const colorIndex = activeSection.tiers.length % TIER_COLORS.length;
    const newTier = {
      id: `t${Date.now()}`,
      name: `Hạng vé ${activeSection.tiers.length + 1}`,
      price: 500000,
      color: TIER_COLORS[colorIndex],
      rowCount: 1
    };
    updateSection(activeSection.id, {
      tiers: [...activeSection.tiers, newTier]
    });
  };

  const deleteTier = (tierId: string) => {
    if (!activeSection) return;

    updateSection(activeSection.id, {
      tiers: activeSection.tiers.filter(t => t.id !== tierId)
    });
  };

  const updateTier = (tierId: string, updates: any) => {
    if (!activeSection) return;

    updateSection(activeSection.id, {
      tiers: activeSection.tiers.map(t => t.id === tierId ? { ...t, ...updates } : t)
    });
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const revokeObjectUrl = (url: string) => {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setImages(prev => [...prev, objectUrl]);
    event.target.value = '';
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const next = [...prev];
      const [removed] = next.splice(index, 1);
      if (removed) revokeObjectUrl(removed);
      return next;
    });
  };

  const getTierForRow = (rowIndex: number) => {
    if (!activeSection) return null;

    let accumulatedRows = 0;
    for (const tier of activeSection.tiers) {
      accumulatedRows += tier.rowCount;
      if (rowIndex < accumulatedRows) return tier;
    }
    return null;
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const persistEvent = async (status: Event['status']) => {
    await apiService.saveEvent({
      ...formData,
      status,
      bannerUrl: images[0] || formData.bannerUrl || '',
      thumbnailUrl: images[0] || formData.thumbnailUrl || '',
      endDate: formData.endDate || formData.startDate,
      endTime: formData.endTime || formData.startTime,
      totalCapacity: activeSection ? activeSection.rows * activeSection.seatsPerRow : formData.totalCapacity || 0,
      revenue: activeSection ? activeSection.tiers.reduce((acc, t) => acc + t.rowCount * activeSection.seatsPerRow * t.price, 0) : formData.revenue || 0,
      ticketsSold: formData.ticketsSold ?? 0,
    });
  };

  const handleSaveDraft = async () => {
    await persistEvent('Draft');
    onComplete();
  };

  const handlePublish = async () => {
    await persistEvent('Selling');
    onComplete();
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Step Header */}
      <div className="flex items-center justify-between mb-12 font-sans px-4">
        <div>
          <h2 className="text-3xl tracking-tight text-white font-black">
            {initialEvent ? 'Chỉnh sửa sự kiện' : (step === 1 ? 'Thông tin sự kiện' : step === 2 ? 'Sơ đồ chỗ ngồi' : 'Kiểm tra & Xuất bản')}
          </h2>
          <p className="text-neutral-500 mt-1 font-medium">
            {initialEvent ? `Đang chỉnh sửa: ${initialEvent.title}` : 'Điền đầy đủ thông tin để khởi tạo trải nghiệm tiếp theo của bạn.'}
          </p>
        </div>
        <div className="flex gap-4">
          <button onClick={onComplete} className="px-6 py-2.5 rounded-xl border border-neutral-200 font-black text-sm text-neutral-500 hover:bg-neutral-50 transition-all uppercase tracking-widest">
            Hủy bỏ
          </button>
          {step < 3 ? (
            <button 
              onClick={nextStep}
              className="px-6 py-2.5 rounded-xl bg-primary text-white font-black text-sm hover:brightness-90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2 uppercase tracking-widest"
            >
              Tiếp theo
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button 
              onClick={handlePublish}
              className="px-6 py-2.5 rounded-xl bg-black text-white font-black text-sm hover:bg-neutral-800 shadow-lg shadow-black/20 transition-all flex items-center gap-2 uppercase tracking-widest"
            >
              {initialEvent ? 'Lưu thay đổi' : 'Xuất bản sự kiện'}
              <Rocket className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-4 mb-12 font-sans px-4">
        {[1, 2, 3].map(i => (
          <div key={i} className={`flex items-center gap-3 ${step < i ? 'opacity-40' : ''} transition-opacity`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${step >= i ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-neutral-100 text-neutral-400 border border-neutral-200'}`}>
              {i}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${step >= i ? 'text-primary' : 'text-neutral-400'}`}>
              {i === 1 ? 'Thông tin' : i === 2 ? 'Sơ đồ' : 'Kiểm tra'}
            </span>
            {i < 3 && <div className="h-px w-16 bg-neutral-200"></div>}
          </div>
        ))}
      </div>

      {/* Content Form */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 px-4"
          >
            <section className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden">
               <div className="px-8 py-5 border-b border-neutral-50 bg-neutral-50/30 flex items-center gap-3">
                 <Info className="w-5 h-5 text-primary" />
                 <h3 className="font-black text-black">Thông tin cơ bản</h3>
               </div>
               <div className="p-8 space-y-6">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Tên sự kiện</label>
                   <input 
                    type="text" 
                    placeholder="Ví dụ: Lễ hội Âm nhạc Mùa hè 2024"
                    className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-black"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                   />
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Danh mục</label>
                      <select 
                        className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3.5 font-bold text-black outline-none focus:ring-2 focus:ring-primary/20"
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value as any})}
                      >
                        <option value="Concert">Hòa nhạc (Concert)</option>
                        <option value="Tech">Công nghệ</option>
                        <option value="Festival">Lễ hội</option>
                        <option value="Comedy">Hài kịch</option>
                      </select>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Mô tả ngắn</label>
                    <textarea 
                      rows={4} 
                      className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3.5 font-bold text-black outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Mô tả tóm tắt về sự kiện của bạn..."
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    ></textarea>
                 </div>
               </div>
            </section>

            <section className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden">
               <div className="px-8 py-5 border-b border-neutral-50 bg-neutral-50/30 flex items-center gap-3">
                 <Calendar className="w-5 h-5 text-primary" />
                 <h3 className="font-black text-black">Thời gian diễn ra</h3>
               </div>
               <div className="p-8 grid grid-cols-4 gap-6">
                 <div className="space-y-2 col-span-2">
                   <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Ngày bắt đầu</label>
                   <input type="date" className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3.5 font-bold text-black outline-none focus:ring-2 focus:ring-primary/20" />
                 </div>
                 <div className="space-y-2 col-span-2">
                   <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Giờ bắt đầu</label>
                   <input type="time" className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3.5 font-bold text-black outline-none focus:ring-2 focus:ring-primary/20" />
                 </div>
               </div>
            </section>

            <section className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden">
               <div className="px-8 py-5 border-b border-neutral-50 bg-neutral-50/30 flex items-center gap-3">
                 <MapPin className="w-5 h-5 text-primary" />
                 <h3 className="font-black text-black">Địa điểm</h3>
               </div>
               <div className="p-8 grid grid-cols-3 gap-6">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Tên địa điểm</label>
                   <input type="text" placeholder="Ví dụ: SVĐ Quân khu 7" className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3.5 font-bold text-black outline-none focus:ring-2 focus:ring-primary/20" />
                 </div>
                 <div className="space-y-2 col-span-2">
                   <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Thành phố / Tỉnh</label>
                   <input type="text" placeholder="Hồ Chí Minh, Việt Nam" className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3.5 font-bold text-black outline-none focus:ring-2 focus:ring-primary/20" />
                 </div>
               </div>
            </section>
            <section className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden">
               <div className="px-8 py-5 border-b border-neutral-50 bg-neutral-50/30 flex items-center gap-3">
                 <Upload className="w-5 h-5 text-primary" />
                 <h3 className="font-black text-black">Hình ảnh minh họa</h3>
               </div>
               <div className="p-8 space-y-6">
                 <input
                   ref={fileInputRef}
                   type="file"
                   accept="image/*"
                   className="hidden"
                   onChange={handleImageChange}
                 />
                 <div className="grid grid-cols-4 gap-4">
                   {images.map((url, i) => (
                     <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-neutral-100 relative group">
                       <img src={url} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="bg-white text-black p-2 rounded-full hover:scale-110 transition-transform"
                          >
                             <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                     </div>
                   ))}
                   <button
                     type="button"
                     onClick={triggerImageUpload}
                     className="aspect-square rounded-2xl border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center gap-2 text-neutral-400 hover:border-primary hover:text-primary transition-all bg-neutral-50/50"
                   >
                     <Upload className="w-6 h-6" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Tải ảnh</span>
                   </button>
                 </div>
                 <p className="text-xs text-neutral-400 font-medium italic">* Khuyên dùng ảnh tỉ lệ 16:9 cho ảnh bìa và 1:1 cho ảnh minh họa chi tiết.</p>
               </div>
            </section>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-12 gap-8 px-4"
          >
            <div className="col-span-4 space-y-6">
              <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 p-8 space-y-6">
                 <h3 className="font-black text-lg text-black uppercase tracking-widest">Trình sửa khu vực</h3>
                 <div className="space-y-4">
                   <div className="space-y-1">
                     <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Tên khu vực</label>
                     <input 
                      type="text" 
                      value={activeSection.name} 
                      onChange={e => updateSection(activeSection.id, { name: e.target.value })}
                      className="w-full border-neutral-200 rounded-xl py-3 px-4 font-bold text-black outline-none focus:ring-2 focus:ring-primary/20" 
                    />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Số hàng</label>
                        <input 
                          type="number" 
                          value={activeSection.rows} 
                          onChange={e => updateSection(activeSection.id, { rows: parseInt(e.target.value) || 0 })}
                          className="w-full border-neutral-200 rounded-xl py-3 px-4 font-bold text-black outline-none focus:ring-2 focus:ring-primary/20" 
                        />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Ghế mỗi hàng</label>
                        <input 
                          type="number" 
                          value={activeSection.seatsPerRow} 
                          onChange={e => updateSection(activeSection.id, { seatsPerRow: parseInt(e.target.value) || 0 })}
                          className="w-full border-neutral-200 rounded-xl py-3 px-4 font-bold text-black outline-none focus:ring-2 focus:ring-primary/20" 
                        />
                     </div>
                   </div>
                 </div>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 p-8 space-y-6">
                 <div className="flex justify-between items-center">
                   <h3 className="font-black text-lg text-black uppercase tracking-widest">Hạng vé</h3>
                   <button onClick={addTier} className="text-xs text-primary font-black uppercase tracking-widest hover:underline flex items-center gap-1">
                     <Plus className="w-3 h-3" /> Thêm
                   </button>
                 </div>
                 <div className="space-y-4">
                    {activeSection.tiers.map((tier) => (
                      <div key={tier.id} className="p-5 rounded-2xl border border-neutral-100 bg-neutral-50/30 space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex gap-3 items-center">
                            <div className={`w-5 h-5 rounded shadow-sm ${tier.color}`}></div>
                            <input 
                              type="text" 
                              value={tier.name}
                              onChange={e => updateTier(tier.id, { name: e.target.value })}
                              className="text-sm font-black text-black bg-transparent border-none p-0 focus:ring-0 w-32 uppercase tracking-widest"
                            />
                          </div>
                          <button onClick={() => deleteTier(tier.id)} className="text-neutral-300 hover:text-error transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                             <input 
                              type="text" 
                              value={tier.price.toLocaleString()}
                              onChange={e => updateTier(tier.id, { price: parseInt(e.target.value.replace(/\D/g, '')) || 0 })}
                              className="text-xs font-black text-black bg-white border border-neutral-200 rounded-lg px-3 py-1.5 w-28"
                            />
                            <span className="text-[10px] text-neutral-400 font-black">VND</span>
                          </div>
                          
                          <div className="flex items-center gap-3 bg-white border border-neutral-200 rounded-lg p-1">
                             <button 
                               onClick={() => adjustTierRowCount(tier.id, -1)}
                               className="p-1.5 hover:bg-neutral-100 rounded text-neutral-400 transition-colors"
                             >
                               <Minus className="w-3 h-3" />
                             </button>
                             <div className="flex flex-col items-center min-w-[35px]">
                               <span className="text-xs font-black text-black leading-none">{tier.rowCount}</span>
                               <span className="text-[8px] text-neutral-400 font-black uppercase tracking-tighter">Hàng</span>
                             </div>
                             <button 
                               onClick={() => adjustTierRowCount(tier.id, 1)}
                               className="p-1.5 hover:bg-neutral-100 rounded text-neutral-400 transition-colors"
                             >
                               <Plus className="w-3 h-3" />
                             </button>
                          </div>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>

            <div className="col-span-8 bg-neutral-50/50 rounded-3xl border border-neutral-100 overflow-hidden flex flex-col items-center p-12 shadow-inner font-sans">
               <div className="w-full max-w-xl h-12 bg-black rounded-t-[40px] flex items-center justify-center text-white/20 text-[10px] font-black tracking-[0.8em] mb-12 shadow-2xl relative">
                 SÂN KHẤU
                 <div className="absolute -bottom-1 left-1/4 right-1/4 h-2 bg-black blur-xl opacity-20"></div>
               </div>
               <div className="overflow-auto max-h-[500px] w-full flex justify-center p-4">
                <div className="flex flex-col gap-2.5">
                  {Array.from({length: activeSection.rows}).map((_, r) => {
                    const rowTier = getTierForRow(r);
                    return (
                      <div key={r} className="flex gap-2.5">
                        {Array.from({length: activeSection.seatsPerRow}).map((_, c) => {
                          return (
                            <div 
                              key={c} 
                              className={`w-8 h-8 rounded-lg shadow-sm transition-all hover:scale-125 cursor-help ${
                                rowTier ? rowTier.color : 'bg-white border border-neutral-200'
                              }`} 
                              title={rowTier ? `Row ${r+1}, Seat ${c+1} (${rowTier.name})` : `Row ${r+1}, Seat ${c+1} (Empty)`}
                            />
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
               </div>
               <div className="mt-12 flex flex-wrap justify-center gap-8 p-6 bg-white rounded-3xl shadow-sm border border-neutral-100">
                  {activeSection.tiers.map(tier => (
                    <div key={tier.id} className="flex items-center gap-3">
                      <div className={`w-5 h-5 ${tier.color} rounded shadow-sm`}></div>
                      <span className="text-[10px] font-black text-neutral-400 tracking-[0.2em] uppercase">{tier.name}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-3"><div className="w-5 h-5 bg-white border border-neutral-200 rounded shadow-sm"></div><span className="text-[10px] font-black text-neutral-400 tracking-[0.2em] uppercase">Trống</span></div>
               </div>
               <p className="mt-6 text-[10px] text-neutral-400 font-black italic tracking-widest uppercase">* Điều chỉnh số lượng hàng của từng hạng vé ở bảng bên trái</p>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-3 gap-8 px-4"
          >
            <div className="col-span-2 space-y-8">
              <section className="bg-white rounded-3xl shadow-sm border border-neutral-100 p-8 space-y-8 font-sans">
                <h3 className="text-xl font-black border-b border-neutral-50 pb-6 text-black uppercase tracking-widest">Tổng kết sự kiện</h3>
                <div className="space-y-6">
                  <div className="flex flex-col gap-3 px-8 py-6 bg-neutral-50 border border-neutral-100 rounded-[2rem]">
                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Tên sự kiện</span>
                    <span className="text-2xl font-black text-black">{formData.title || '(Chưa đặt tên)'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                     <div className="p-8 bg-neutral-50 rounded-[2rem] border border-neutral-100 flex items-center gap-5">
                        <div className="bg-primary text-white p-4 rounded-2xl shadow-lg shadow-primary/20">
                           <Calendar className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-1">Ngày diễn ra</p>
                          <p className="text-lg font-black text-black">21 Tháng 6, 2024</p>
                        </div>
                     </div>
                     <div className="p-8 bg-neutral-50 rounded-[2rem] border border-neutral-100 flex items-center gap-5">
                        <div className="bg-black text-white p-4 rounded-2xl shadow-lg shadow-black/20">
                           <MapPin className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-1">Địa điểm</p>
                          <p className="text-lg font-black text-black">Trung tâm SECC, Q.7</p>
                        </div>
                     </div>
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-3xl shadow-sm border border-neutral-100 p-8 space-y-8">
                 <h3 className="text-xl font-black border-b border-neutral-50 pb-6 text-black uppercase tracking-widest">Đăng ký & Bán vé</h3>
                 <div className="grid grid-cols-3 gap-6">
                   <div className="p-8 border border-neutral-100 rounded-3xl text-center shadow-sm bg-neutral-50/50">
                     <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-2">Sức chứa</p>
                     <p className="text-3xl font-black text-black">{(activeSection.rows * activeSection.seatsPerRow).toLocaleString()}</p>
                   </div>
                   <div className="p-8 border border-neutral-100 rounded-3xl text-center shadow-sm bg-neutral-50/50">
                     <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-2">Hạng vé</p>
                     <p className="text-3xl font-black text-black">{activeSection.tiers.length}</p>
                   </div>
                   <div className="p-8 border border-primary/20 rounded-3xl text-center shadow-sm bg-primary/5">
                     <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Dự kiến thu</p>
                     <p className="text-xl font-black text-center text-primary">
                       {activeSection.tiers.reduce((acc, t) => acc + (t.rowCount * activeSection.seatsPerRow * t.price), 0).toLocaleString()}
                       <span className="text-xs ml-1 font-black">₫</span>
                     </p>
                   </div>
                 </div>
              </section>
            </div>

            <div className="space-y-8">
              <section className="bg-white rounded-3xl shadow-sm border border-neutral-100 p-6 space-y-5">
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Xem trước ảnh bìa</span>
                <div className="aspect-video bg-neutral-100 rounded-2xl border border-neutral-100 overflow-hidden shadow-lg">
                   <img src={images[0]} className="w-full h-full object-cover" />
                </div>
              </section>

              <section className="bg-white rounded-3xl shadow-sm border border-neutral-100 p-8 space-y-6">
                <h4 className="font-black text-sm text-black uppercase tracking-widest">Thiết lập xuất bản</h4>
                <div className="space-y-4">
                  {[
                    'Đưa lên Chợ sự kiện TicketRush',
                    'Bật thông báo mở bán sớm',
                    'Yêu cầu xác minh danh tính (KYC)'
                  ].map((setting, i) => (
                    <label key={i} className="flex items-center gap-4 p-4 hover:bg-neutral-50 rounded-2xl cursor-pointer transition-colors border border-transparent hover:border-neutral-100">
                      <input type="checkbox" defaultChecked className="w-5 h-5 rounded-lg text-primary focus:ring-primary/20 border-neutral-300" />
                      <span className="text-xs font-black text-neutral-600 uppercase tracking-widest">{setting}</span>
                    </label>
                  ))}
                </div>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-12 pt-8 border-t border-neutral-100 flex justify-between items-center text-neutral-400 font-sans px-4">
        {step > 1 && (
          <button 
            onClick={prevStep}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl border-2 border-primary text-primary font-black hover:bg-primary/5 transition-all active:scale-95 uppercase tracking-widest text-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </button>
        )}
        <div className="flex gap-4 ml-auto">
          <button className="px-8 py-3.5 rounded-xl font-black text-sm text-neutral-400 hover:text-black transition-colors uppercase tracking-widest">Lưu bản nháp</button>
          
          {step === 3 && (
             <button 
              onClick={handlePublish}
              className="bg-primary text-white px-10 py-3.5 rounded-xl font-black shadow-xl shadow-primary/20 flex items-center gap-2 hover:brightness-90 active:scale-95 transition-all uppercase tracking-widest text-sm"
            >
              {initialEvent ? 'Xác nhận cập nhật' : 'Xác nhận & Khởi động'}
              <Rocket className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
