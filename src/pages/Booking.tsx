import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Zap, Users, Calendar, ArrowRight, ChevronRight, CheckCircle2, CreditCard, QrCode as QrIcon, Wallet, Layout, Palette, MessageSquare, Sparkles, Bot, Loader2, Map as MapIcon, Shield, Globe, Coffee, Wifi, Monitor, Info } from "lucide-react";
import PageLayout from "../components/PageLayout";
import { suggestEventLayout } from "../lib/gemini";
import { createBooking, db } from "../lib/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { useAuth } from "../components/AuthProvider";
import { Copy, QrCode as QrIconCode } from "lucide-react";

const Booking = () => {
  const [step, setStep] = useState(1);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [eventContext, setEventContext] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [qrPass, setQrPass] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [showQRStatus, setShowQRStatus] = useState(false);
  const { user, profile } = useAuth();
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

  const isHighTier = bookingData.roomName.includes("Grand Hub") || bookingData.roomId === "hall-1";
  const depositAmount = isHighTier ? bookingData.totalAmount * 0.5 : bookingData.totalAmount;

  const handleCreateBooking = async () => {
    if (!user) return alert("Vui lòng đăng nhập!");
    if (!paymentMethod) return alert("Vui lòng chọn phương thức thanh toán!");
    
    // Hub-Coin Check
    if (paymentMethod === "hub-coin" && (profile?.hubCoins || 0) < bookingData.totalAmount) {
      alert("Bạn không đủ Hub-Coin để thực hiện giao dịch này!");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createBooking(user.uid, {
        ...bookingData,
        paymentStatus: paymentMethod === "hub-coin" ? "paid" : "pending_verification",
        paymentMethod,
        depositRequired: depositAmount,
        bookingType: isHighTier ? "high-tier" : "standard",
        totalAmount: bookingData.totalAmount
      });

      // If Hub-Coin, deduct balance
      if (paymentMethod === "hub-coin") {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          hubCoins: increment(-bookingData.totalAmount)
        });
      }

      const snap = await getDoc(res);
      const data = snap.data();
      setBookingId(res.id);
      setQrPass(data?.qrPass || "");
      setStep(5); // Success step
    } catch (error) {
      console.error("Booking error", error);
      alert("Đã xảy ra lỗi khi tạo đơn đặt chỗ. Vui lòng thử lại.");
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
                  <h2 className="text-3xl font-black uppercase italic tracking-widest mb-2">Quy trình thanh toán khép kín</h2>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Hệ thống "Một chạm" - Nhanh chóng, An toàn, Tiện lợi.</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-6">
                      <h3 className="text-sm font-black uppercase tracking-widest text-hub-blue border-b border-white/5 pb-4">Tóm lược đấu trường</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500">Mô hình:</span>
                          <span className="font-bold">{bookingData.roomName}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500">Thời khắc:</span>
                          <span className="font-bold">{bookingData.date} | {bookingData.time}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-hub-magenta">
                          <span className="font-bold">Loại gói:</span>
                          <span className="font-black uppercase tracking-widest">{isHighTier ? "Gói Official (Sự kiện)" : "Gói Trial / Standard"}</span>
                        </div>
                      </div>
                      
                      <div className="pt-6 border-t border-white/5 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-gray-400">TỔNG CHI PHÍ:</span>
                          <span className="text-xl font-black text-white">{bookingData.totalAmount.toLocaleString()}đ</span>
                        </div>
                        {isHighTier && (
                          <div className="p-4 bg-hub-purple/10 rounded-2xl border border-hub-purple/30">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[10px] font-black text-hub-purple uppercase tracking-widest italic">Cọc giữ chỗ (50%):</span>
                              <span className="text-lg font-black text-hub-purple">{depositAmount.toLocaleString()}đ</span>
                            </div>
                            <p className="text-[8px] text-gray-500 leading-tight uppercase font-bold italic">* Bạn chỉ cần thanh toán tiền cọc để giữ chỗ chắc chắn. Phần còn lại thanh toán tại Hub.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Phương thức thanh toán đa nền tảng</label>
                       <div className="grid grid-cols-2 gap-4">
                          {[
                            { id: "momo", name: "Ví Momo", icon: "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png", color: "hover:bg-[#a50064]/20" },
                            { id: "zalopay", name: "ZaloPay", icon: "https://vanchuyenhangquangchau.vn/wp-content/uploads/2023/10/logo-zalopay.png", color: "hover:bg-blue-600/20" },
                            { id: "vnpay", name: "VNPay QR", icon: "https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg", color: "hover:bg-red-500/20" },
                            { id: "vietqr", name: "VietQR (Bank)", icon: "https://vietqr.net/img/vietqr-logo-02.png", color: "hover:bg-hub-blue/20" },
                          ].map(pay => (
                            <button 
                              key={pay.id}
                              onClick={() => setPaymentMethod(pay.id)}
                              className={`p-4 rounded-3xl glass border transition-all flex flex-col items-center gap-3 relative overflow-hidden group ${paymentMethod === pay.id ? "border-hub-blue bg-hub-blue/10 scale-105" : "border-white/5 " + pay.color}`}
                            >
                               <img src={pay.icon} className="h-8 object-contain rounded-lg" referrerPolicy="no-referrer" />
                               <span className="text-[9px] font-black uppercase tracking-widest">{pay.name}</span>
                               {paymentMethod === pay.id && <div className="absolute top-2 right-2 w-2 h-2 bg-hub-blue rounded-full shadow-[0_0_10px_#38bdf8]" />}
                            </button>
                          ))}
                          <button 
                            onClick={() => setPaymentMethod("hub-coin")}
                            className={`col-span-2 p-4 rounded-3xl glass border transition-all flex items-center justify-between px-8 relative overflow-hidden group ${paymentMethod === "hub-coin" ? "border-hub-magenta bg-hub-magenta/10 scale-105" : "border-white/5 hover:bg-hub-magenta/20"}`}
                          >
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-hub-magenta/20 rounded-2xl flex items-center justify-center">
                                  <Wallet className="w-6 h-6 text-hub-magenta" />
                                </div>
                                <div>
                                   <div className="text-[10px] font-black uppercase tracking-widest text-white">Hub-Coin (HH)</div>
                                   <div className="text-[8px] text-gray-500 uppercase tracking-widest">Sử dụng điểm tích lũy của bạn</div>
                                </div>
                             </div>
                             <div className="text-right">
                                <div className="text-sm font-black text-hub-magenta">{profile?.hubCoins || 0} HH</div>
                                <div className="text-[7px] text-gray-500 uppercase font-black italic">Sẵn dùng</div>
                             </div>
                             {paymentMethod === "hub-coin" && <div className="absolute top-2 right-2 w-2 h-2 bg-hub-magenta rounded-full shadow-[0_0_10px_#d946ef]" />}
                          </button>
                       </div>
                    </div>
                  </div>

                  <div className="relative">
                    <AnimatePresence mode="wait">
                      {paymentMethod && paymentMethod !== "hub-coin" ? (
                        <motion.div 
                          key="qr-view"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="glass p-10 rounded-[3rem] border-white/10 text-center flex flex-col items-center justify-center sticky top-32"
                        >
                           <h4 className="text-lg font-black uppercase tracking-widest mb-2 italic">Quét mã trong 3 giây</h4>
                           <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest mb-8">Nội dung đã được điền tự động</p>
                           
                           <div className="relative group mb-8">
                              <div className="absolute -inset-4 bg-hub-blue/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                              <div className="w-56 h-56 bg-white p-4 rounded-[2rem] relative z-10 shadow-2xl">
                                 <img 
                                   src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=PAYMENT_HUB_${bookingData.totalAmount}_${user?.uid.slice(0,5)}`} 
                                   className="w-full h-full object-contain" 
                                   referrerPolicy="no-referrer"
                                 />
                                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center">
                                    <img src="/favicon.ico" className="w-6 h-6" onError={(e) => (e.currentTarget.src = "https://ui-avatars.com/api/?name=H&background=7c3aed&color=fff")} />
                                 </div>
                              </div>
                           </div>
                           
                           <div className="space-y-4 w-full max-w-xs">
                              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest border-b border-white/5 pb-2">
                                 <span className="text-gray-500">Người thụ hưởng:</span>
                                 <span className="text-white">THE HUB ARENA CO-WORKING</span>
                              </div>
                              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest border-b border-white/5 pb-2">
                                 <span className="text-gray-500">Số tiền:</span>
                                 <span className="text-hub-blue">{depositAmount.toLocaleString()}đ</span>
                              </div>
                              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                 <span className="text-gray-500">Nội dung:</span>
                                 <div className="flex items-center gap-2">
                                    <span className="text-white">HUB{user?.uid.slice(0,6).toUpperCase()}</span>
                                    <button className="text-hub-blue"><Copy className="w-3 h-3" /></button>
                                 </div>
                              </div>
                           </div>
                        </motion.div>
                      ) : paymentMethod === "hub-coin" ? (
                        <motion.div 
                          key="hub-coin-view"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="glass p-12 rounded-[3.5rem] border-hub-magenta/20 bg-gradient-to-br from-hub-magenta/5 to-transparent flex flex-col items-center text-center justify-center h-full sticky top-32"
                        >
                           <div className="w-20 h-20 bg-hub-magenta/20 rounded-3xl flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(217,70,239,0.3)]">
                              <Wallet className="w-10 h-10 text-hub-magenta" />
                           </div>
                           <h4 className="text-2xl font-black uppercase italic tracking-widest mb-4">Thanh toán Hub-Coin</h4>
                           <div className="space-y-6 w-full max-w-xs mb-10">
                              <div className="flex justify-between items-center text-xs border-b border-white/5 pb-3">
                                 <span className="text-gray-500 uppercase font-black tracking-widest">Chi phí:</span>
                                 <span className="text-xl font-black text-hub-magenta">{bookingData.totalAmount} HH</span>
                              </div>
                              <div className="flex justify-between items-center text-xs border-b border-white/5 pb-3">
                                 <span className="text-gray-500 uppercase font-black tracking-widest">Số dư sau GD:</span>
                                 <span className="text-lg font-black text-gray-300">{(profile?.hubCoins || 0) - bookingData.totalAmount} HH</span>
                              </div>
                           </div>
                           <p className="text-[9px] text-gray-500 leading-relaxed uppercase font-bold italic">
                              "Sáng tạo là vàng. Mỗi đồng Hub-Coin bạn chi ra là minh chứng cho tinh thần nhiệt huyết tại cộng đồng The Hub."
                           </p>
                        </motion.div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30">
                           <div className="w-24 h-24 rounded-[2rem] border-2 border-dashed border-gray-600 flex items-center justify-center">
                              <QrIconCode className="w-10 h-10 text-gray-600" />
                           </div>
                           <p className="text-[10px] font-black uppercase tracking-widest max-w-[200px]">Vui lòng chọn phương thức để xem chi tiết giao dịch</p>
                        </div>
                      )}
                    </AnimatePresence>
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
                <div className="w-24 h-24 bg-hub-blue rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(56,189,248,0.4)] relative">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-hub-magenta text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest"
                  >
                    Done
                  </motion.div>
                </div>
                <h2 className="text-4xl font-black uppercase tracking-widest mb-4 italic">XÁC NHẬN TỨC THÌ!</h2>
                <p className="text-gray-400 text-sm max-w-lg mx-auto mb-8">Thưa Đấu sĩ, hệ thống đã ghi nhận thanh toán. Hóa đơn điện tử và mã Hub-Pass quyền năng đã được gửi tới tài khoản của bạn.</p>
                
                <div className="max-w-md mx-auto grid md:grid-cols-2 gap-6 mb-12">
                   <div className="glass p-8 rounded-[2.5rem] border-hub-blue/30 bg-hub-blue/5">
                      <div className="aspect-square glass rounded-2xl flex items-center justify-center mb-6 relative group overflow-hidden">
                         <QrIconCode className="w-32 h-32 text-white opacity-80" />
                         <div className="absolute inset-0 bg-gradient-to-t from-hub-blue/20 to-transparent"></div>
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-hub-blue mb-2">HUB-PASS ID</div>
                      <div className="text-xl font-black tracking-[0.2em]">{qrPass || "LOADING..."}</div>
                   </div>

                   <div className="glass p-8 rounded-[2.5rem] border-white/5 flex flex-col justify-center text-left">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-6 border-b border-white/5 pb-2">Hóa đơn điện tử</h4>
                      <div className="space-y-4 mb-8">
                         <div>
                            <div className="text-[8px] text-gray-500 uppercase font-black">Mã giao dịch</div>
                            <div className="text-xs font-bold">#TRX-{bookingId?.slice(0,8).toUpperCase()}</div>
                         </div>
                         <div>
                            <div className="text-[8px] text-gray-500 uppercase font-black">Trạng thái</div>
                            <div className="text-xs font-bold text-green-500 uppercase">Đã xác thực</div>
                         </div>
                         <div>
                            <div className="text-[8px] text-gray-500 uppercase font-black">Ngày xuất</div>
                            <div className="text-xs font-bold">{new Date().toLocaleDateString()}</div>
                         </div>
                      </div>
                      <button className="w-full py-3 glass rounded-xl border-white/10 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10">
                         <CreditCard className="w-4 h-4" /> Tải Hóa Đơn
                      </button>
                   </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={() => navigate("/dashboard")} className="px-10 py-4 glass rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">Về tổng hành dinh</button>
                  <button onClick={() => setStep(1)} className="px-10 py-4 bg-hub-blue rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">Đặt chỗ mới</button>
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
