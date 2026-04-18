import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Zap, Users, Calendar, ArrowRight, ChevronRight, CheckCircle2, CreditCard, QrCode as QrIcon, Wallet, Layout, Palette, MessageSquare, Sparkles, Bot, Loader2, Map as MapIcon, Shield, Globe, Coffee, Wifi, Monitor, Info } from "lucide-react";
import PageLayout from "../components/PageLayout";
import { suggestEventLayout } from "../lib/gemini";
import { createBooking, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../components/AuthProvider";

const Booking = () => {
  const [step, setStep] = useState(1);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [eventContext, setEventContext] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [qrPass, setQrPass] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bookingData, setBookingData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: "10:00",
    roomId: "hall-1",
    roomName: "Creative Hall",
    people: "10-20",
    layout: "Chữ U",
    vibe: "#7c3aed",
    decor: "Hiện đại (Modern)",
    privacy: "private" as "public" | "private",
    addOns: [] as string[],
    totalAmount: 2500000,
  });

  const rooms = [
    { id: "hall-1", name: "Creative Hall", capacity: "50+", basePrice: 2000000, icon: <Layout className="w-5 h-5" /> },
    { id: "nest-1", name: "The Nest", capacity: "10-20", basePrice: 800000, icon: <Users className="w-5 h-5" /> },
    { id: "ar-1", name: "AR Studio", capacity: "5-10", basePrice: 1500000, icon: <Zap className="w-5 h-5" /> },
    { id: "box-1", name: "Quiet Box", capacity: "1-2", basePrice: 100000, icon: <Shield className="w-5 h-5" /> },
  ];

  const layouts = ["Chữ U", "Rạp hát", "Tiệc đứng", "Lớp học"];
  const addOnsList = [
    { id: "coffee", name: "Coffee trọn gói", price: 300000, icon: <Coffee className="w-4 h-4" /> },
    { id: "wifi", name: "WiFi Pro 1Gbps", price: 150000, icon: <Wifi className="w-4 h-4" /> },
    { id: "monitor", name: "Màn hình LED 4K", price: 500000, icon: <Monitor className="w-4 h-4" /> },
  ];

  const steps = [
    { id: 1, title: "Chọn vị trí", icon: <MapIcon /> },
    { id: 2, title: "Lịch & AI", icon: <Calendar /> },
    { id: 3, title: "Tùy biến", icon: <Palette /> },
    { id: 4, title: "Thanh toán", icon: <CreditCard /> },
  ];

  useEffect(() => {
    const base = rooms.find(r => r.id === bookingData.roomId)?.basePrice || 0;
    const addOnsTotal = bookingData.addOns.reduce((acc, id) => {
      const item = addOnsList.find(a => a.id === id);
      return acc + (item?.price || 0);
    }, 0);
    setBookingData(prev => ({ ...prev, totalAmount: base + addOnsTotal }));
  }, [bookingData.roomId, bookingData.addOns]);

  const handleCreateBooking = async () => {
    if (!user) return alert("Vui lòng đăng nhập!");
    setIsSubmitting(true);
    try {
      const res = await createBooking(user.uid, bookingData);
      const snap = await getDoc(res);
      const data = snap.data();
      setBookingId(res.id);
      setQrPass(data?.qrPass || "");
      setStep(5); // Success step
    } catch (error) {
      console.error("Booking error", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAddOn = (id: string) => {
    setBookingData(prev => ({
      ...prev,
      addOns: prev.addOns.includes(id) 
        ? prev.addOns.filter(a => a !== id)
        : [...prev.addOns, id]
    }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <PageLayout>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-6 text-gradient-cosmic uppercase tracking-tighter">ĐẶT CHỖ THÔNG MINH</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Hệ thống đặt chỗ "Real-time" 30 giây. Làm chủ không gian, làm chủ thời gian.
          </p>
        </div>

        {/* Stepper */}
        {step <= 4 && (
          <div className="max-w-4xl mx-auto mb-20">
            <div className="flex justify-between items-center relative">
              <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 -translate-y-1/2 z-0" />
              <div 
                className="absolute top-1/2 left-0 h-px bg-hub-blue -translate-y-1/2 z-0 transition-all duration-500" 
                style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
              />
              {steps.map((s) => (
                <div key={s.id} className="relative z-10 flex flex-col items-center gap-4">
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${step >= s.id ? "bg-hub-blue text-white shadow-lg shadow-hub-blue/40" : "glass text-gray-500"}`}
                  >
                    {step > s.id ? <CheckCircle2 className="w-6 h-6" /> : s.icon}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= s.id ? "text-white" : "text-gray-500"}`}>{s.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="max-w-5xl mx-auto glass p-8 md:p-12 rounded-[3rem] border-white/10 relative overflow-hidden mb-12 shadow-2xl">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="space-y-8"
              >
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-black uppercase tracking-widest mb-2 italic">Live-Map Trực quan</h2>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Phòng nào xanh là trống, đỏ là đã kín. Chọn ngay vị trí lý tưởng!</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 relative aspect-video glass rounded-3xl border-white/5 p-4 flex items-center justify-center overflow-hidden">
                    {/* SVG Live Map Placeholder */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #38bdf8 1px, transparent 0)', backgroundSize: '30px 30px' }} />
                    <div className="grid grid-cols-2 gap-4 w-full h-full relative z-10">
                      {rooms.map((room) => (
                        <button
                          key={room.id}
                          onClick={() => setBookingData(prev => ({ ...prev, roomId: room.id, roomName: room.name }))}
                          className={`relative rounded-2xl border transition-all flex flex-col items-center justify-center gap-3 group ${bookingData.roomId === room.id ? "bg-hub-blue/20 border-hub-blue" : "glass border-white/10 hover:border-hub-blue/50"}`}
                        >
                          <div className={`p-4 rounded-xl ${bookingData.roomId === room.id ? "bg-hub-blue text-white" : "glass text-hub-blue group-hover:scale-110 transition-transform"}`}>
                            {room.icon}
                          </div>
                          <div className="text-center">
                            <div className="text-[10px] font-black uppercase tracking-widest mb-1">{room.name}</div>
                            <div className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">{room.capacity} người</div>
                          </div>
                          {Math.random() > 0.7 && bookingData.roomId !== room.id && (
                            <div className="absolute top-2 right-2 px-2 py-0.5 bg-red-500/20 text-red-500 text-[6px] font-black uppercase tracking-widest rounded-full border border-red-500/30">Đã kín</div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="glass p-6 rounded-2xl border-white/5 h-full">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-hub-blue mb-6">Chi tiết lựa chọn</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] text-gray-500 uppercase font-black">Phòng:</span>
                          <span className="text-xs font-bold">{bookingData.roomName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] text-gray-500 uppercase font-black">Giá cơ sở:</span>
                          <span className="text-xs font-bold text-hub-blue">{(rooms.find(r => r.id === bookingData.roomId)?.basePrice || 0).toLocaleString()}đ</span>
                        </div>
                      </div>
                      <div className="mt-8 p-4 bg-hub-blue/10 rounded-xl flex items-start gap-3">
                        <Info className="w-4 h-4 text-hub-blue flex-shrink-0" />
                        <p className="text-[9px] text-gray-400 italic">"Đặt ngay để không bỏ lỡ không gian sáng tạo nhất tại The Hub."</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black uppercase italic tracking-widest mb-2">Cấu máy thời gian</h2>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Lên lịch sự kiện và để AI gợi ý cấu hình tối ưu nhất.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Ngày diễn ra</label>
                    <input 
                      type="date" 
                      value={bookingData.date}
                      onChange={(e) => setBookingData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-6 py-4 rounded-2xl glass border-white/5 focus:border-hub-blue outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Khung giờ bắt đầu</label>
                    <select 
                      value={bookingData.time}
                      onChange={(e) => setBookingData(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full px-6 py-4 rounded-2xl glass border-white/5 focus:border-hub-blue outline-none transition-all appearance-none"
                    >
                      {["08:00", "10:00", "13:00", "15:00", "18:00", "20:00"].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                {/* AI Planner Section */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-hub-purple to-hub-blue rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                  <div className="relative glass p-8 rounded-3xl border-white/10 bg-hub-purple/5">
                    <div className="flex items-center gap-3 mb-6">
                      <Sparkles className="w-5 h-5 text-hub-purple animate-pulse" />
                      <h4 className="text-xs font-black uppercase tracking-widest leading-none">Hub-AI Smart Planner</h4>
                    </div>
                    <div className="flex gap-4 mb-6">
                      <textarea 
                        value={eventContext}
                        onChange={(e) => setEventContext(e.target.value)}
                        placeholder="Mô tả sự kiện của bạn (vd: Workshop đồ họa cho 30 người, cần không gian mở...)" 
                        className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs focus:border-hub-purple outline-none resize-none transition-all placeholder:text-gray-600"
                        rows={2}
                      />
                      <button 
                        onClick={async () => {
                          if (!eventContext) return;
                          setIsAiLoading(true);
                          const suggestion = await suggestEventLayout(eventContext);
                          setAiSuggestion(suggestion);
                          setIsAiLoading(false);
                        }}
                        disabled={isAiLoading}
                        className="px-8 bg-hub-purple rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50 flex items-center justify-center"
                      >
                        {isAiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Phân tích"}
                      </button>
                    </div>
                    {aiSuggestion && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 glass rounded-2xl border-hub-purple/20 text-[11px] leading-relaxed text-gray-300 italic flex gap-4"
                      >
                         <Bot className="w-6 h-6 text-hub-purple flex-shrink-0" />
                         <div>
                          <div className="text-hub-purple font-black tracking-widest uppercase text-[9px] mb-2">Đề xuất từ AI:</div>
                          {aiSuggestion}
                         </div>
                      </motion.div>
                    )}
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
                className="space-y-12"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black uppercase italic tracking-widest mb-2">Tùy biến & Kết nối</h2>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Kiến tạo không gian 0 giây chờ đợi và mở rộng mạng lưới.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Kiểu sắp xếp (Smart Layout)</label>
                      <div className="grid grid-cols-2 gap-3">
                        {layouts.map(l => (
                          <button
                            key={l}
                            onClick={() => setBookingData(prev => ({ ...prev, layout: l }))}
                            className={`py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${bookingData.layout === l ? "bg-hub-blue border-hub-blue" : "glass border-white/5 hover:border-white/20"}`}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Chế độ hiển thị (Social Booking)</label>
                      <div className="flex gap-4">
                        <button
                          onClick={() => setBookingData(prev => ({ ...prev, privacy: "private" }))}
                          className={`flex-1 py-4 rounded-2xl flex flex-col items-center gap-2 transition-all ${bookingData.privacy === "private" ? "bg-hub-magenta border-hub-magenta scale-105" : "glass border-white/5 opacity-50"}`}
                        >
                          <Shield className="w-5 h-5" />
                          <span className="text-[8px] font-black uppercase tracking-widest">Riêng tư</span>
                        </button>
                        <button
                          onClick={() => setBookingData(prev => ({ ...prev, privacy: "public" }))}
                          className={`flex-1 py-4 rounded-2xl flex flex-col items-center gap-2 transition-all ${bookingData.privacy === "public" ? "bg-hub-blue border-hub-blue scale-105" : "glass border-white/5 opacity-50"}`}
                        >
                          <Globe className="w-5 h-5" />
                          <span className="text-[8px] font-black uppercase tracking-widest">Công khai</span>
                        </button>
                      </div>
                      <p className="text-[9px] text-gray-600 italic px-2">"Công khai để các thành viên khác có cơ hội giao lưu và kết nối với dự án của bạn."</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Vật phẩm bổ trợ (Add-ons)</label>
                      <div className="space-y-3">
                        {addOnsList.map(item => (
                          <button
                            key={item.id}
                            onClick={() => toggleAddOn(item.id)}
                            className={`w-full p-4 rounded-2xl border transition-all flex justify-between items-center group ${bookingData.addOns.includes(item.id) ? "bg-hub-blue/20 border-hub-blue" : "glass border-white/5 hover:border-white/10"}`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${bookingData.addOns.includes(item.id) ? "bg-hub-blue text-white" : "glass text-gray-500"}`}>
                                {item.icon}
                              </div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-left">{item.name}</span>
                            </div>
                            <span className="text-[10px] font-black">{item.price.toLocaleString()}đ</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black uppercase italic tracking-widest mb-2">Thanh toán Pass-point</h2>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Xác nhận thanh toán để nhận ngay Hub-Pass quyền năng.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-hub-blue border-b border-white/5 pb-4">Tóm lược đặt chỗ</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">Phòng:</span>
                        <span className="font-bold">{bookingData.roomName}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">Thời gian:</span>
                        <span className="font-bold">{bookingData.date} | {bookingData.time}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">Cấu hình:</span>
                        <span className="font-bold">{bookingData.layout}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">Dịch vụ thêm:</span>
                        <span className="font-bold">{bookingData.addOns.length} vật phẩm</span>
                      </div>
                    </div>
                    <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                      <span className="text-lg font-black uppercase tracking-widest">Tổng cộng:</span>
                      <span className="text-2xl font-black text-hub-blue">{bookingData.totalAmount.toLocaleString()}đ</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4 mb-2">Chọn phương thức</div>
                    <button onClick={handleCreateBooking} className="w-full py-6 glass rounded-[2rem] border-white/5 flex flex-col items-center gap-2 hover:bg-hub-purple/20 hover:border-hub-purple/50 transition-all group">
                       <CreditCard className="w-8 h-8 text-hub-purple group-hover:scale-110 transition-transform" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Thẻ quốc tế (Visa/Master)</span>
                    </button>
                    <button onClick={handleCreateBooking} className="w-full py-6 glass rounded-[2rem] border-white/5 flex flex-col items-center gap-2 hover:bg-hub-blue/20 hover:border-hub-blue/50 transition-all group">
                       <QrIcon className="w-8 h-8 text-hub-blue group-hover:scale-110 transition-transform" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Ví điện tử (Momo / QR)</span>
                    </button>
                    <button onClick={handleCreateBooking} className="w-full py-6 glass rounded-[2rem] border-white/5 flex flex-col items-center gap-2 hover:bg-hub-magenta/20 hover:border-hub-magenta/50 transition-all group">
                       <Wallet className="w-8 h-8 text-hub-magenta group-hover:scale-110 transition-transform" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Hub-Coin (HH)</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div 
                key="step5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-10"
              >
                <div className="w-24 h-24 bg-hub-blue rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(56,189,248,0.4)]">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-4xl font-black uppercase tracking-widest mb-4 italic">ĐẶT CHỖ THÀNH CÔNG!</h2>
                <p className="text-gray-400 text-sm max-w-lg mx-auto mb-12">Chúc mừng Đấu sĩ! Chỗ ngồi của bạn đã được giữ và chuẩn bị sẵn sàng. Hãy xuất trình Hub-Pass sau đây khi đến cửa.</p>
                
                <div className="max-w-xs mx-auto glass p-8 rounded-[2.5rem] border-hub-blue/30 bg-hub-blue/5 mb-12">
                   <div className="aspect-square glass rounded-2xl flex items-center justify-center mb-6 relative group overflow-hidden">
                      <QrIcon className="w-32 h-32 text-white opacity-80" />
                      <div className="absolute inset-0 bg-gradient-to-t from-hub-blue/20 to-transparent"></div>
                   </div>
                   <div className="text-[10px] font-black uppercase tracking-widest text-hub-blue mb-2">HUB-PASS ID</div>
                   <div className="text-xl font-black tracking-[0.2em]">{qrPass || "LOADING..."}</div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={() => navigate("/dashboard")} className="px-10 py-4 glass rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">Quản lý đặt chỗ</button>
                  <button onClick={() => setStep(1)} className="px-10 py-4 bg-hub-blue rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">Tiếp tục đặt chỗ</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {step <= 4 && (
            <div className="mt-12 flex justify-between items-center">
              {step > 1 && (
                <button 
                  onClick={prevStep}
                  className="px-8 py-3 glass rounded-full font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Quay lại
                </button>
              )}
              <div className="flex-1" />
              <button 
                onClick={nextStep}
                disabled={isSubmitting}
                className="px-10 py-4 bg-gradient-to-r from-hub-purple to-hub-blue rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 group"
              >
                {step === 4 ? (isSubmitting ? "Đang xử lý..." : "Xác nhận đặt hàng") : "Tiếp theo"} 
                {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Booking;
