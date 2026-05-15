'use client';

import { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket, ArrowLeft, ArrowRight, Upload, Calendar, MapPin, Info, Plus, Minus, Trash2 } from 'lucide-react';
import { apiService } from '@/services/apiService';
import { Event } from '@/types';
import { useRouter } from 'next/navigation';

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [formData, setFormData] = useState<Partial<Event>>({});

  useEffect(() => {
    apiService.getEvents().then(events => {
      const found = events.find(e => e.id === id);
      if (found) {
        setFormData(found);
        setImages(found.bannerUrl ? [found.bannerUrl] : [
          'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop'
        ]);
        setSections([
          { 
            id: '1', 
            name: found.venueName || 'Khu vực sàn A', 
            rows: 10, 
            seatsPerRow: 12, 
            tiers: [
              { id: 't1', name: 'VIP Premium', price: 2000000, color: 'bg-error', rowCount: 2 },
              { id: 't2', name: 'Thường', price: 1000000, color: 'bg-primary', rowCount: 8 }
            ]
          }
        ]);
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="p-10 text-center text-white/50 animate-pulse font-bold">Đang tải thông tin sự kiện...</div>;

  const [selectedSectionId, setSelectedSectionId] = useState('1');
  const activeSection = sections.find(s => s.id === selectedSectionId) || sections[0];

  const updateSection = (id: string, updates: any) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const adjustTierRowCount = (tierId: string, delta: number) => {
    updateSection(activeSection.id, {
      tiers: activeSection.tiers.map((t: any) => {
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
    updateSection(activeSection.id, {
      tiers: activeSection.tiers.filter((t: any) => t.id !== tierId)
    });
  };

  const updateTier = (tierId: string, updates: any) => {
    updateSection(activeSection.id, {
      tiers: activeSection.tiers.map((t: any) => t.id === tierId ? { ...t, ...updates } : t)
    });
  };

  const getTierForRow = (rowIndex: number) => {
    let accumulatedRows = 0;
    for (const tier of activeSection.tiers) {
      accumulatedRows += tier.rowCount;
      if (rowIndex < accumulatedRows) return tier;
    }
    return null;
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handlePublish = async () => {
    await apiService.saveEvent({ ...formData, status: 'Selling' });
    router.push('/events');
  };

  const onCancel = () => {
    router.push('/events');
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Step Header */}
      <div className="flex items-center justify-between mb-12 font-sans px-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">
            Chỉnh sửa sự kiện
          </h2>
          <p className="text-white/40 mt-1 font-bold uppercase tracking-widest text-[10px]">
            Đang chỉnh sửa: {formData.title}
          </p>
        </div>
        <div className="flex gap-4">
          <button onClick={onCancel} className="px-6 py-2.5 rounded-xl border border-white/10 font-black text-xs text-white/40 hover:bg-white/5 transition-all uppercase tracking-widest">
            Hủy bỏ
          </button>
          {step < 3 ? (
            <button 
              onClick={nextStep}
              className="px-6 py-2.5 rounded-xl bg-ticketbox-green text-black font-black text-xs hover:brightness-110 shadow-lg shadow-ticketbox-green/20 transition-all flex items-center gap-2 uppercase tracking-widest"
            >
              Tiếp theo
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button 
              onClick={handlePublish}
              className="px-6 py-2.5 rounded-xl bg-white text-black font-black text-xs hover:bg-neutral-200 shadow-lg shadow-white/10 transition-all flex items-center gap-2 uppercase tracking-widest"
            >
              Lưu thay đổi
              <Rocket className="w-4 h-4" />
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
            <section className="bg-pure-black rounded-3xl shadow-sm border border-white/5 overflow-hidden">
               <div className="px-8 py-5 border-b border-white/5 bg-white/[0.02] flex items-center gap-3">
                 <Info className="w-5 h-5 text-ticketbox-green" />
                 <h3 className="font-black text-white uppercase tracking-tighter">Thông tin cơ bản</h3>
               </div>
               <div className="p-8 space-y-6">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Tên sự kiện</label>
                   <input 
                    type="text" 
                    placeholder="Ví dụ: Lễ hội Âm nhạc Mùa hè 2024"
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-ticketbox-green/20 outline-none transition-all font-bold text-white"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                   />
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Danh mục</label>
                       <select 
                         className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3.5 font-bold text-white outline-none focus:ring-2 focus:ring-ticketbox-green/20"
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
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Mô tả ngắn</label>
                    <textarea 
                      rows={4} 
                      className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3.5 font-bold text-white outline-none focus:ring-2 focus:ring-ticketbox-green/20"
                      placeholder="Mô tả tóm tắt về sự kiện của bạn..."
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    ></textarea>
                 </div>
               </div>
            </section>

            <section className="bg-pure-black rounded-3xl shadow-sm border border-white/5 overflow-hidden">
               <div className="px-8 py-5 border-b border-white/5 bg-white/[0.02] flex items-center gap-3">
                 <Calendar className="w-5 h-5 text-ticketbox-green" />
                 <h3 className="font-black text-white uppercase tracking-tighter">Thời gian diễn ra</h3>
               </div>
               <div className="p-8 grid grid-cols-4 gap-6">
                 <div className="space-y-2 col-span-2">
                   <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Ngày bắt đầu</label>
                   <input type="date" className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3.5 font-bold text-white outline-none focus:ring-2 focus:ring-ticketbox-green/20" />
                 </div>
                 <div className="space-y-2 col-span-2">
                   <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Giờ bắt đầu</label>
                   <input type="time" className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3.5 font-bold text-white outline-none focus:ring-2 focus:ring-ticketbox-green/20" />
                 </div>
               </div>
            </section>

            <section className="bg-pure-black rounded-3xl shadow-sm border border-white/5 overflow-hidden">
               <div className="px-8 py-5 border-b border-white/5 bg-white/[0.02] flex items-center gap-3">
                 <MapPin className="w-5 h-5 text-ticketbox-green" />
                 <h3 className="font-black text-white uppercase tracking-tighter">Địa điểm</h3>
               </div>
               <div className="p-8 grid grid-cols-3 gap-6">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Tên địa điểm</label>
                   <input type="text" placeholder="Ví dụ: SVĐ Quân khu 7" className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3.5 font-bold text-white outline-none focus:ring-2 focus:ring-ticketbox-green/20" />
                 </div>
                 <div className="space-y-2 col-span-2">
                   <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Thành phố / Tỉnh</label>
                   <input type="text" placeholder="Hồ Chí Minh, Việt Nam" className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3.5 font-bold text-white outline-none focus:ring-2 focus:ring-ticketbox-green/20" />
                 </div>
               </div>
            </section>
            <section className="bg-pure-black rounded-3xl shadow-sm border border-white/5 overflow-hidden">
               <div className="px-8 py-5 border-b border-white/5 bg-white/[0.02] flex items-center gap-3">
                 <Upload className="w-5 h-5 text-ticketbox-green" />
                 <h3 className="font-black text-white uppercase tracking-tighter">Hình ảnh minh họa</h3>
               </div>
               <div className="p-8 space-y-6">
                 <div className="grid grid-cols-4 gap-4">
                   {images.map((url, i) => (
                     <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-white/5 relative group">
                       <img src={url} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="bg-white text-black p-2 rounded-full hover:scale-110 transition-transform">
                             <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                     </div>
                   ))}
                   <button className="aspect-square rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 text-white/20 hover:border-ticketbox-green hover:text-ticketbox-green transition-all bg-white/[0.02]">
                     <Upload className="w-6 h-6" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Tải ảnh</span>
                   </button>
                 </div>
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
              <div className="bg-pure-black rounded-3xl shadow-sm border border-white/5 p-8 space-y-6">
                 <h3 className="font-black text-lg text-white uppercase tracking-tighter">Trình sửa khu vực</h3>
                 <div className="space-y-4">
                   <div className="space-y-1">
                     <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Tên khu vực</label>
                     <input 
                      type="text" 
                      value={activeSection.name} 
                      onChange={e => updateSection(activeSection.id, { name: e.target.value })}
                      className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 font-bold text-white outline-none focus:ring-2 focus:ring-ticketbox-green/20" 
                    />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Số hàng</label>
                        <input 
                          type="number" 
                          value={activeSection.rows} 
                          onChange={e => updateSection(activeSection.id, { rows: parseInt(e.target.value) || 0 })}
                          className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 font-bold text-white outline-none focus:ring-2 focus:ring-ticketbox-green/20" 
                        />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Ghế mỗi hàng</label>
                        <input 
                          type="number" 
                          value={activeSection.seatsPerRow} 
                          onChange={e => updateSection(activeSection.id, { seatsPerRow: parseInt(e.target.value) || 0 })}
                          className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 font-bold text-white outline-none focus:ring-2 focus:ring-ticketbox-green/20" 
                        />
                     </div>
                   </div>
                 </div>
              </div>

              <div className="bg-pure-black rounded-3xl shadow-sm border border-white/5 p-8 space-y-6">
                 <div className="flex justify-between items-center">
                   <h3 className="font-black text-lg text-white uppercase tracking-tighter">Hạng vé</h3>
                   <button onClick={addTier} className="text-[10px] text-ticketbox-green font-black uppercase tracking-widest hover:underline flex items-center gap-1">
                     <Plus className="w-3 h-3" /> Thêm
                   </button>
                 </div>
                 <div className="space-y-4">
                    {activeSection.tiers.map((tier: any) => (
                      <div key={tier.id} className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex gap-3 items-center">
                            <div className={`w-5 h-5 rounded shadow-sm ${tier.color}`}></div>
                            <input 
                              type="text" 
                              value={tier.name}
                              onChange={e => updateTier(tier.id, { name: e.target.value })}
                              className="text-xs font-black text-white bg-transparent border-none p-0 focus:ring-0 w-32 uppercase tracking-widest"
                            />
                          </div>
                          <button onClick={() => deleteTier(tier.id)} className="text-white/20 hover:text-error transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                             <input 
                               type="text" 
                               value={tier.price.toLocaleString()}
                               onChange={e => updateTier(tier.id, { price: parseInt(e.target.value.replace(/\D/g, '')) || 0 })}
                               className="text-xs font-black text-white bg-white/5 border border-white/5 rounded-lg px-3 py-1.5 w-28"
                            />
                             <span className="text-[10px] text-white/20 font-black uppercase">VND</span>
                          </div>
                          
                          <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-lg p-1">
                             <button 
                               onClick={() => adjustTierRowCount(tier.id, -1)}
                               className="p-1.5 hover:bg-white/5 rounded text-white/20 transition-colors"
                             >
                               <Minus className="w-3 h-3" />
                             </button>
                             <div className="flex flex-col items-center min-w-[35px]">
                               <span className="text-xs font-black text-white leading-none">{tier.rowCount}</span>
                               <span className="text-[8px] text-white/20 font-black uppercase tracking-tighter">Hàng</span>
                             </div>
                             <button 
                               onClick={() => adjustTierRowCount(tier.id, 1)}
                               className="p-1.5 hover:bg-white/5 rounded text-white/20 transition-colors"
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

            <div className="col-span-8 bg-white/[0.01] rounded-3xl border border-white/5 overflow-hidden flex flex-col items-center p-12 shadow-inner font-sans">
               <div className="w-full max-w-xl h-12 bg-pure-black border border-white/10 rounded-t-[40px] flex items-center justify-center text-white/20 text-[10px] font-black tracking-[0.8em] mb-12 shadow-2xl relative">
                 SÂN KHẤU
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
                                rowTier ? rowTier.color : 'bg-white/5 border border-white/5'
                              }`} 
                            />
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
               </div>
               <div className="mt-12 flex flex-wrap justify-center gap-8 p-6 bg-pure-black rounded-3xl shadow-sm border border-white/5">
                  {activeSection.tiers.map((tier: any) => (
                    <div key={tier.id} className="flex items-center gap-3">
                      <div className={`w-5 h-5 ${tier.color} rounded shadow-sm`}></div>
                      <span className="text-[10px] font-black text-white/20 tracking-[0.2em] uppercase">{tier.name}</span>
                    </div>
                  ))}
               </div>
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
              <section className="bg-pure-black rounded-3xl shadow-sm border border-white/5 p-8 space-y-8 font-sans">
                <h3 className="text-xl font-black border-b border-white/5 pb-6 text-white uppercase tracking-tighter">Tổng kết sự kiện</h3>
                <div className="space-y-6">
                  <div className="flex flex-col gap-3 px-8 py-6 bg-white/[0.02] border border-white/5 rounded-[2rem]">
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Tên sự kiện</span>
                    <span className="text-2xl font-black text-white">{formData.title || '(Chưa đặt tên)'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                     <div className="p-8 bg-white/[0.02] rounded-[2rem] border border-white/5 flex items-center gap-5">
                        <div className="bg-ticketbox-green text-black p-4 rounded-2xl shadow-lg shadow-ticketbox-green/20">
                           <Calendar className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Ngày diễn ra</p>
                          <p className="text-lg font-black text-white">21 Tháng 6, 2024</p>
                        </div>
                     </div>
                     <div className="p-8 bg-white/[0.02] rounded-[2rem] border border-white/5 flex items-center gap-5">
                        <div className="bg-white text-black p-4 rounded-2xl shadow-lg shadow-white/20">
                           <MapPin className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Địa điểm</p>
                          <p className="text-lg font-black text-black">Trung tâm SECC, Q.7</p>
                        </div>
                     </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="space-y-8">
               <section className="bg-pure-black rounded-3xl shadow-sm border border-white/5 p-8 space-y-6">
                <h4 className="font-black text-sm text-white uppercase tracking-widest">Thiết lập xuất bản</h4>
                <div className="space-y-4">
                  {[
                    'Đưa lên Chợ sự kiện TicketRush',
                    'Bật thông báo mở bán sớm',
                    'Yêu cầu xác minh danh tính (KYC)'
                  ].map((setting, i) => (
                    <label key={i} className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl cursor-pointer transition-colors border border-transparent hover:border-white/5">
                      <input type="checkbox" defaultChecked className="w-5 h-5 rounded-lg text-ticketbox-green focus:ring-ticketbox-green/20 border-white/10 bg-transparent" />
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{setting}</span>
                    </label>
                  ))}
                </div>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center text-white/20 font-sans px-4">
        {step > 1 && (
          <button 
            onClick={prevStep}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl border-2 border-ticketbox-green text-ticketbox-green font-black hover:bg-ticketbox-green/5 transition-all active:scale-95 uppercase tracking-widest text-xs"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </button>
        )}
        <div className="flex gap-4 ml-auto">
          <button className="px-8 py-3.5 rounded-xl font-black text-[10px] text-white/20 hover:text-white transition-colors uppercase tracking-widest">Lưu bản nháp</button>
          
          {step === 3 && (
             <button 
              onClick={handlePublish}
              className="bg-ticketbox-green text-black px-10 py-3.5 rounded-xl font-black shadow-xl shadow-ticketbox-green/20 flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all uppercase tracking-widest text-xs"
            >
              Lưu thay đổi
              <Rocket className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
