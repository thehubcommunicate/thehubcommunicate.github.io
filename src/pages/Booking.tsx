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
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBookingDone, setIsBookingDone] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"methods" | "card">("methods");
  const [cardData, setCardData] = useState({
     number: "",
     name: "",
     expiry: "",
     cvv: ""
  });
  const [hubPassCode, setHubPassCode] = useState("");
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
    
    if (paymentMethod === "credit-card") {
       if (cardData.number !== "4242 4242 4242 4242") {
          return alert("Demo: Vui lòng sử dụng số thẻ 4242 4242 4242 4242 để trải nghiệm!");
       }
       setIsProcessing(true);
       await new Promise(resolve => setTimeout(resolve, 3000));
       setIsProcessing(false);
    }

    // Hub-Coin Check
    if (paymentMethod === "hub-coin" && (profile?.hubCoins || 0) < bookingData.totalAmount) {
      alert("Bạn không đủ Hub-Coin để thực hiện giao dịch này!");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createBooking(user.uid, {
        ...bookingData,
        paymentStatus: (paymentMethod === "hub-coin" || paymentMethod === "credit-card") ? "paid" : "pending_verification",
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
      setHubPassCode(data?.qrPass || `HUB-${res.id.slice(0, 5)}`);
      setIsBookingDone(true);
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
                {!isBookingDone ? (
                   <>
                      <div className="text-center mb-8">
                        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-gradient-cosmic">
                           {paymentStep === "card" ? "Giao dịch Thẻ Quốc tế" : "Đấu trường Thanh toán"}
                        </h2>
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                           {paymentStep === "card" ? "🔒 Cổng bảo mật AES-256 kết nối trực tiếp." : "⚡ Trải nghiệm thanh toán một chạm siêu tốc."}
                        </p>
                      </div>

                      <div className="grid lg:grid-cols-2 gap-12">
                        <div className="space-y-8">
                          <div className="glass p-8 rounded-[3rem] border-white/5 space-y-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Zap className="w-16 h-16" /></div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-hub-blue border-b border-white/5 pb-4">Tóm lược đấu trường</h3>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center text-[11px]">
                                <span className="text-gray-500 uppercase font-black">Mô hình:</span>
                                <span className="font-bold text-white">{bookingData.roomName}</span>
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                <span className="text-gray-500 uppercase font-black">Thời khắc:</span>
                                <span className="font-bold text-white">{bookingData.date} | {bookingData.time}</span>
                              </div>
                              <div className="flex justify-between items-center text-[11px] text-hub-magenta">
                                <span className="font-bold uppercase font-black italic">Gói dịch vụ:</span>
                                <span className="font-black uppercase tracking-widest">{isHighTier ? "EVENT MASTER (Bạch kim)" : "STANDARD (Cơ bản)"}</span>
                              </div>
                            </div>
                            
                            <div className="pt-6 border-t border-white/5 space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">TỔNG GIAO DỊCH:</span>
                                <span className="text-2xl font-black text-white">{bookingData.totalAmount.toLocaleString()}đ</span>
                              </div>
                              {isHighTier && (
                                <div className="p-5 bg-hub-purple/10 rounded-[2rem] border border-hub-purple/30">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] font-black text-hub-purple uppercase tracking-widest italic">Cọc giữ chỗ (50%):</span>
                                    <span className="text-xl font-black text-hub-purple">{depositAmount.toLocaleString()}đ</span>
                                  </div>
                                  <p className="text-[8px] text-gray-500 leading-tight uppercase font-bold italic">* Chỉ cần cọc để xác nhận chỗ trống. Phần còn lại chi trả tại quầy.</p>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col gap-4">
                             <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4 italic">Chọn vũ khí thanh toán</label>
                             <div className="grid grid-cols-2 gap-4">
                                {[
                                  { id: "credit-card", name: "Thẻ Visa/Master", icon: null, isCredit: true, color: "hover:bg-hub-blue/20" },
                                  { id: "momo", name: "Ví Momo", icon: "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png", color: "hover:bg-[#a50064]/20" },
                                  { id: "vnpay", name: "VNPay QR", icon: "https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg", color: "hover:bg-red-500/20" },
                                  { id: "vietqr", name: "Bank Transfer", icon: "https://vietqr.net/img/vietqr-logo-02.png", color: "hover:bg-hub-blue/20" },
                                ].map(pay => (
                                  <button 
                                    key={pay.id}
                                    onClick={() => {
                                       setPaymentMethod(pay.id);
                                       if (pay.id === "credit-card") setPaymentStep("card");
                                       else setPaymentStep("methods");
                                    }}
                                    className={`p-5 rounded-[2rem] glass border transition-all flex flex-col items-center gap-3 relative overflow-hidden group ${paymentMethod === pay.id ? "border-hub-blue bg-hub-blue/10 scale-105 shadow-lg shadow-hub-blue/20" : "border-white/5 " + pay.color}`}
                                  >
                                     {pay.isCredit ? <CreditCard className="w-8 h-8 text-hub-blue" /> : <img src={pay.icon} className="h-8 object-contain rounded-lg" referrerPolicy="no-referrer" />}
                                     <span className="text-[10px] font-black uppercase tracking-widest">{pay.name}</span>
                                     {paymentMethod === pay.id && <div className="absolute top-2 right-2 w-2 h-2 bg-hub-blue rounded-full shadow-[0_0_10px_#38bdf8]" />}
                                  </button>
                                ))}
                                <button 
                                  onClick={() => {
                                     setPaymentMethod("hub-coin");
                                     setPaymentStep("methods");
                                  }}
                                  className={`col-span-2 p-5 rounded-[2rem] glass border transition-all flex items-center justify-between px-8 relative overflow-hidden group ${paymentMethod === "hub-coin" ? "border-hub-magenta bg-hub-magenta/10 scale-105 shadow-xl shadow-hub-magenta/20" : "border-white/5 hover:bg-hub-magenta/20"}`}
                                >
                                   <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 bg-hub-magenta/20 rounded-2xl flex items-center justify-center">
                                        <Wallet className="w-8 h-8 text-hub-magenta" />
                                      </div>
                                      <div>
                                         <div className="text-[10px] font-black uppercase tracking-widest text-white">Hub-Coin (HH)</div>
                                         <div className="text-[8px] text-gray-500 uppercase tracking-widest">Sẵn có: {profile?.hubCoins || 0} HH</div>
                                      </div>
                                   </div>
                                   <div className="text-right">
                                      <div className="text-sm font-black text-hub-magenta animate-pulse">Kích hoạt ví</div>
                                   </div>
                                   {paymentMethod === "hub-coin" && <div className="absolute top-2 right-2 w-2 h-2 bg-hub-magenta rounded-full shadow-[0_0_10px_#d946ef]" />}
                                </button>
                             </div>
                          </div>
                        </div>

                        <div className="relative">
                          <AnimatePresence mode="wait">
                            {paymentStep === "card" ? (
                               <motion.div 
                                 key="card-form"
                                 initial={{ opacity: 0, scale: 0.9 }}
                                 animate={{ opacity: 1, scale: 1 }}
                                 exit={{ opacity: 0, scale: 0.9 }}
                                 className="glass p-10 rounded-[3.5rem] border-white/10 space-y-8 sticky top-32"
                               >
                                  <div className="space-y-6">
                                     <div className="space-y-1 text-left">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-4">Số thẻ (Thẻ Demo: 4242 4242 4242 4242)</label>
                                        <input 
                                           type="text"
                                           placeholder="XXXX XXXX XXXX XXXX"
                                           value={cardData.number}
                                           onChange={e => setCardData(prev => ({ ...prev, number: e.target.value }))}
                                           className="w-full px-6 py-5 bg-white/5 rounded-2xl border border-white/10 outline-none focus:border-hub-blue transition-all font-mono text-lg tracking-widest"
                                        />
                                     </div>
                                     <div className="space-y-1 text-left">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-4">Chủ sở hữu (VIẾT HOA KHÔNG DẤU)</label>
                                        <input 
                                           type="text"
                                           placeholder="TEN CHU THE"
                                           value={cardData.name}
                                           onChange={e => setCardData(prev => ({ ...prev, name: e.target.value.toUpperCase() }))}
                                           className="w-full px-6 py-5 bg-white/5 rounded-2xl border border-white/10 outline-none focus:border-hub-blue transition-all font-black"
                                        />
                                     </div>
                                     <div className="grid grid-cols-2 gap-6 text-left">
                                        <div className="space-y-1">
                                           <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-4">Hết hạn</label>
                                           <input 
                                              type="text"
                                              placeholder="MM/YY"
                                              value={cardData.expiry}
                                              onChange={e => setCardData(prev => ({ ...prev, expiry: e.target.value }))}
                                              className="w-full px-6 py-5 bg-white/5 rounded-2xl border border-white/10 outline-none focus:border-hub-blue transition-all text-center"
                                           />
                                        </div>
                                        <div className="space-y-1">
                                           <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-4">CVV</label>
                                           <input 
                                              type="password"
                                              placeholder="***"
                                              maxLength={3}
                                              value={cardData.cvv}
                                              onChange={e => setCardData(prev => ({ ...prev, cvv: e.target.value }))}
                                              className="w-full px-6 py-5 bg-white/5 rounded-2xl border border-white/10 outline-none focus:border-hub-blue transition-all text-center"
                                           />
                                        </div>
                                     </div>
                                     <div className="p-4 bg-hub-blue/10 rounded-2xl border border-hub-blue/20 flex items-center gap-4">
                                       <div className="w-10 h-10 rounded-xl bg-hub-blue/20 flex items-center justify-center text-hub-blue"><Shield className="w-5 h-5" /></div>
                                       <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest text-left leading-relaxed">The Hub không lưu giữ thông tin thẻ nhạy cảm. Chúng tớ sử dụng cổng thanh toán trung gian mã hóa AES-256 để bảo vệ bạn.</p>
                                     </div>
                                  </div>

                                  <div className="flex gap-4">
                                     <button 
                                       disabled={isSubmitting || isProcessing}
                                       onClick={() => { setPaymentStep("methods"); setPaymentMethod(null); }}
                                       className="flex-1 py-5 glass border-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/5"
                                     >
                                        Hủy
                                     </button>
                                     <button 
                                       disabled={isSubmitting || isProcessing}
                                       onClick={handleCreateBooking}
                                       className="flex-[2] py-5 bg-hub-blue text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-xl shadow-hub-blue/40 flex items-center justify-center gap-2"
                                     >
                                        {isProcessing ? <><Loader2 className="w-5 h-5 animate-spin" /> Đang bảo mật...</> : "Xác nhận & Thanh toán"}
                                     </button>
                                  </div>
                               </motion.div>
                            ) : paymentMethod && paymentMethod !== "hub-coin" ? (
                               <motion.div 
                                 key="qr-view"
                                 initial={{ opacity: 0, y: 20 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 exit={{ opacity: 0, y: -20 }}
                                 className="glass p-10 rounded-[3.5rem] border-white/10 text-center flex flex-col items-center justify-center sticky top-32"
                               >
                                  <h4 className="text-xl font-black uppercase tracking-widest mb-2 italic text-hub-blue">Quét QR Một chạm</h4>
                                  <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest mb-10">Tự động kết nối tới ứng dụng ngân hàng</p>
                                  
                                  <div className="relative group mb-10">
                                     <div className="absolute -inset-6 bg-hub-blue/30 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                     <div className="w-64 h-64 bg-white p-5 rounded-[2.5rem] relative z-10 shadow-3xl">
                                        <img 
                                          src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=BOOKING_HUB_${bookingData.totalAmount}_${user?.uid.slice(0,5)}`} 
                                          className="w-full h-full object-contain" 
                                          referrerPolicy="no-referrer"
                                        />
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-gray-100">
                                           <img src="/favicon.ico" className="w-7 h-7" onError={(e) => (e.currentTarget.src = "https://ui-avatars.com/api/?name=H&background=7c3aed&color=fff")} />
                                        </div>
                                     </div>
                                  </div>

                                  <button 
                                     onClick={handleCreateBooking}
                                     disabled={isSubmitting || !paymentMethod}
                                     className="w-full py-5 bg-hub-blue text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-xl shadow-hub-blue/30 flex items-center justify-center gap-3"
                                  >
                                     {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Tôi đã hoàn tất chuyển khoản"}
                                  </button>
                               </motion.div>
                            ) : paymentMethod === "hub-coin" ? (
                               <motion.div 
                                 key="hub-coin-view"
                                 initial={{ opacity: 0, scale: 0.95 }}
                                 animate={{ opacity: 1, scale: 1 }}
                                 className="glass p-12 rounded-[4rem] border-hub-magenta/20 bg-gradient-to-br from-hub-magenta/5 to-transparent flex flex-col items-center text-center justify-center h-full sticky top-32"
                                >
                                  <div className="w-24 h-24 bg-hub-magenta/20 rounded-[2rem] flex items-center justify-center mb-10 shadow-[0_0_40px_rgba(217,70,239,0.3)]">
                                     <Wallet className="w-12 h-12 text-hub-magenta" />
                                  </div>
                                  <h4 className="text-3xl font-black uppercase italic tracking-tighter mb-6">Hub-Coin Exchange</h4>
                                  <div className="space-y-6 w-full max-w-xs mb-10">
                                     <div className="flex justify-between items-center text-sm border-b border-white/5 pb-4">
                                        <span className="text-gray-500 uppercase font-black tracking-widest">Quy đổi:</span>
                                        <span className="text-2xl font-black text-hub-magenta">{bookingData.totalAmount} HH</span>
                                     </div>
                                     <div className="flex justify-between items-center text-sm border-b border-white/5 pb-4">
                                        <span className="text-gray-500 uppercase font-black tracking-widest">Khả dụng:</span>
                                        <span className="text-xl font-black text-gray-300">{profile?.hubCoins || 0} HH</span>
                                     </div>
                                  </div>
                                  <button 
                                     onClick={handleCreateBooking}
                                     disabled={isSubmitting}
                                     className="w-full py-5 bg-hub-magenta text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-xl shadow-hub-magenta/30"
                                  >
                                     Xác nhận Thanh toán bằng Coin
                                  </button>
                               </motion.div>
                            ) : (
                               <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40 min-h-[500px]">
                                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center">
                                     <CreditCard className="w-10 h-10 text-gray-600" />
                                  </div>
                                  <div className="space-y-2">
                                     <p className="text-[10px] font-black uppercase tracking-widest italic">Chọn vũ khí của bạn</p>
                                     <p className="text-[8px] text-gray-500 max-w-[180px] mx-auto uppercase font-bold tracking-widest">Vui lòng chọn một phương thức thanh toán để tiếp tục quy trình ghi danh.</p>
                                  </div>
                               </div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                   </>
                ) : (
                   <div className="text-center py-20">
                      <Loader2 className="w-12 h-12 animate-spin text-hub-blue mx-auto mb-6" />
                      <p className="text-lg font-bold uppercase tracking-widest">Đang khởi tạo mã định danh...</p>
                   </div>
                )}
              </motion.div>
            )}

            {step === 5 && (
                   <motion.div 
                     key="step5"
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="max-w-2xl mx-auto text-center space-y-12 py-12"
                   >
                       <div className="relative inline-block">
                          <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_60px_rgba(34,197,94,0.5)] relative z-10">
                            <CheckCircle2 className="w-16 h-16 text-white" />
                          </div>
                          <motion.div 
                             animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.2, 0.6] }}
                             transition={{ duration: 2, repeat: Infinity }}
                             className="absolute inset-0 bg-green-500 rounded-full blur-3xl opacity-30" 
                          />
                       </div>

                       <div className="space-y-4">
                          <h2 className="text-6xl font-black uppercase italic tracking-tighter text-gradient-cosmic leading-tight">Ghi danh Đấu trường thành công!</h2>
                          <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em]">Hệ thống đã phê duyệt tư cách tham dự của bạn.</p>
                       </div>

                       <div className="glass p-12 rounded-[3.5rem] border-hub-blue/20 bg-hub-blue/5 space-y-10 relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity"><Zap className="w-32 h-32 text-hub-blue" /></div>
                          
                          <div className="flex flex-col md:flex-row gap-12 items-center">
                             <div className="bg-white p-5 rounded-[2.5rem] w-56 h-56 shadow-2xl relative z-10 flex-shrink-0">
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${hubPassCode}`} className="w-full h-full" referrerPolicy="no-referrer" />
                             </div>
                             
                             <div className="text-left flex-1 space-y-6 relative z-10">
                                <div className="space-y-1">
                                   <div className="text-[10px] text-hub-blue font-black uppercase tracking-widest">Hub-Pass Định danh</div>
                                   <div className="text-2xl font-mono font-black text-white tracking-widest leading-none">{hubPassCode}</div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5">
                                   <div>
                                      <div className="text-[8px] text-gray-500 font-black uppercase tracking-[0.2em] mb-1">Mô hình</div>
                                      <div className="text-sm font-black uppercase text-white tracking-tighter">{bookingData.roomName}</div>
                                   </div>
                                   <div>
                                      <div className="text-[8px] text-gray-500 font-black uppercase tracking-[0.2em] mb-1">Thời khắc</div>
                                      <div className="text-sm font-black uppercase text-white tracking-tighter">{bookingData.date} | {bookingData.time}</div>
                                   </div>
                                </div>
                                
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4">
                                   <Info className="w-5 h-5 text-gray-500" />
                                   <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">Vui lòng mang mã này đến The Hub để được kích hoạt quyền truy cập và nhận ưu đãi Teabreak.</p>
                                </div>
                             </div>
                          </div>
                       </div>

                       <div className="flex flex-col sm:flex-row gap-6 justify-center">
                          <button 
                             onClick={() => navigate("/dashboard")}
                             className="px-12 py-5 glass border-white/10 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                          >
                             Dashboard Quân sư <ArrowRight className="w-4 h-4" />
                          </button>
                          <button 
                             onClick={() => window.location.reload()}
                             className="px-12 py-5 bg-white text-hub-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-hub-blue hover:text-white transition-all shadow-2xl shadow-white/20"
                          >
                             Tiếp tục Book
                          </button>
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
                onClick={step === 4 ? handleCreateBooking : nextStep}
                disabled={isSubmitting || (step === 4 && !paymentMethod)}
                className="px-10 py-4 bg-gradient-to-r from-hub-purple to-hub-blue rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 group disabled:opacity-50 disabled:grayscale"
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
