import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Zap, Users, Lightbulb, Mic2, ArrowRight, ChevronRight, Globe, Layout, Cpu, Eye, Camera, Music, Coffee, Monitor, CheckCircle2, ShoppingCart, Loader2, Check } from "lucide-react";
import PageLayout from "../components/PageLayout";
import { useAuth } from "../components/AuthProvider";
import { placeServiceOrder, db } from "../lib/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";
import { Wallet, CreditCard, QrCode as QrIcon, Copy } from "lucide-react";
import { SERVICES_PACKAGES } from "../constants/services";

import { askHubAI } from "../lib/gemini";
import { Sparkles, Search } from "lucide-react";

const Services = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [aiSearch, setAiSearch] = useState("");
  const [isAiMatching, setIsAiMatching] = useState(false);
  const [matchedServiceId, setMatchedServiceId] = useState<string | null>(null);

  const handleAiMatch = async () => {
    if (!aiSearch.trim()) return;
    setIsAiMatching(true);
    const result = await askHubAI(`Dựa trên nhu cầu: "${aiSearch}", hãy chọn DUY NHẤT một ID phòng phù hợp từ danh sách này: [the-nest, the-creative-hall, the-grand-hub]. Chỉ trả về duy nhất ID đó, không thêm bất cứ từ nào khác.`);
    const cleanId = result.trim().toLowerCase();
    if (['the-nest', 'the-creative-hall', 'the-grand-hub'].includes(cleanId)) {
      setMatchedServiceId(cleanId);
      const element = document.getElementById(cleanId);
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setIsAiMatching(false);
  };
  
  const [ordering, setOrdering] = useState<any | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"methods" | "card">("methods");
  const [cardData, setCardData] = useState({
     number: "",
     name: "",
     expiry: "",
     cvv: ""
  });
  const [qrCodeData, setQrCodeData] = useState("");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const orderId = searchParams.get('order');
    if (orderId) {
      const pkg = SERVICES_PACKAGES.find(p => p.id === orderId);
      if (pkg) setOrdering(pkg);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleAiTrigger = (e: any) => {
      const packageId = e.detail.packageId;
      const pkg = SERVICES_PACKAGES.find(p => p.id === packageId);
      if (pkg) {
        setOrdering(pkg);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
    window.addEventListener('ai-trigger-order', handleAiTrigger);
    return () => window.removeEventListener('ai-trigger-order', handleAiTrigger);
  }, []);

  const handlePlaceOrder = async () => {
    if (!user || !ordering || !paymentMethod) return;

    if (paymentMethod === "credit-card") {
       if (cardData.number !== "4242 4242 4242 4242") {
          return alert("Demo: Vui lòng sử dụng số thẻ 4242 4242 4242 4242 để trải nghiệm!");
       }
       setIsProcessing(true);
       // Luxury simulation: wait 3 seconds
       await new Promise(resolve => setTimeout(resolve, 3000));
       setIsProcessing(false);
    }

    // Price parsing
    const priceStr = ordering.price.replace("Từ ", "").replace("tr", "").replace(/,/g, "").replace("đ", "");
    const price = priceStr.includes("tr") ? parseFloat(priceStr.replace("tr", "")) * 1000000 : parseInt(priceStr);

    if (paymentMethod === "hub-coin" && (profile?.hubCoins || 0) < price) {
      alert("Bạn không đủ Hub-Coin để thực hiện giao dịch này!");
      return;
    }

    setIsSubmitting(true);
    try {
      await placeServiceOrder(user.uid, {
        serviceId: ordering.id || ordering.title.toLowerCase().replace(/ /g, "-"),
        serviceName: ordering.title,
        price,
        paymentMethod,
        status: (paymentMethod === "hub-coin" || paymentMethod === "credit-card") ? "paid" : "pending"
      });
      
      if (paymentMethod === "hub-coin") {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          hubCoins: increment(-price)
        });
      }

      setQrCodeData(`HUB-PASS-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
      setOrderSuccess(true);
      setTimeout(() => {
        setOrderSuccess(false);
        setOrdering(null);
        setShowPayment(false);
        setPaymentMethod(null);
      }, 3000);
    } catch (error) {
      console.error("Order failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const areas = [
    { 
      id: "the-nest", 
      title: "The Nest", 
      desc: "Học nhóm / Họp nhỏ", 
      capacity: "5-10 người", 
      price: "150k/giờ", 
      features: ["Wi-Fi 6", "Bảng trắng", "Tivi 55 inch", "Trà đá miễn phí"],
      img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"
    },
    { 
      id: "the-creative-hall", 
      title: "The Creative Hall", 
      desc: "Workshop / Training", 
      capacity: "20-40 người", 
      price: "500k/giờ", 
      features: ["Máy chiếu 4K", "Âm thanh vòm", "Bàn ghế linh hoạt", "Hỗ trợ kỹ thuật"],
      img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200"
    },
    { 
      id: "the-grand-hub", 
      title: "The Grand Hub", 
      desc: "Sự kiện lớn", 
      capacity: "50-100 người", 
      price: "1.2tr/giờ", 
      features: ["Màn hình LED lớn", "Ánh sáng sân khấu", "Khu vực Teabreak", "Hệ thống Livestream"],
      img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1200"
    },
  ];

  const packages = SERVICES_PACKAGES;

  const comparison = [
    { feature: "Sức chứa", basic: "20-40 người", team: "30-60 người", event: "50-150 người" },
    { feature: "Tiện ích đi kèm", basic: "Tiêu chuẩn", team: "Chuyên nghiệp", event: "Cao cấp/Tùy biến" },
    { feature: "Hỗ trợ kỹ thuật", basic: "Hỗ trợ 1-1", team: "Team kỹ thuật riêng", event: "Trọn gói vận hành" },
    { feature: "Concept", basic: "Theo mẫu", team: "Tùy chỉnh nhẹ", event: "Sáng tạo riêng biệt" },
  ];

  const equipment = [
    { icon: <Camera />, name: "Máy quay 4K", price: "500k/buổi" },
    { icon: <Mic2 />, name: "Micro không dây", price: "100k/cái" },
    { icon: <Coffee />, name: "Phục vụ Teabreak", price: "50k/người" },
    { icon: <Monitor />, name: "Màn hình phụ", price: "200k/cái" },
  ];

  return (
    <PageLayout>
      <div className="container mx-auto px-6">
        <div className="text-center mb-24 flex flex-col items-center">
          <span className="text-hub-blue font-black uppercase tracking-[0.3em] text-[10px] mb-4 block animate-pulse flex items-center gap-2">
            <Sparkles className="w-3 h-3" /> Kiểm soát bởi Hub-AI
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-6 text-gradient-cosmic uppercase tracking-tighter italic">
            Không gian & Dịch vụ
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed mb-10">
            Hệ thống không gian đa năng, trang thiết bị hiện đại giúp sự kiện của bạn diễn ra suôn sẻ và ấn tượng nhất.
          </p>

          {/* AI Helper Bar */}
          <div className="glass p-4 rounded-[2.5rem] border-hub-blue/20 flex flex-col md:flex-row gap-4 w-full max-w-2xl shadow-2xl shadow-hub-blue/10">
             <div className="flex-1 relative flex items-center px-6 bg-white/5 rounded-2xl">
                <Search className="w-4 h-4 text-hub-blue mr-4 opacity-50" />
                <input 
                  type="text" 
                  value={aiSearch}
                  onChange={(e) => setAiSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAiMatch()}
                  placeholder="Tôi muốn tổ chức Workshop 30 người, cần máy chiếu..."
                  className="bg-transparent py-4 text-xs focus:outline-none flex-1 font-medium placeholder:text-gray-600"
                />
             </div>
             <button 
               onClick={handleAiMatch}
               disabled={isAiMatching || !aiSearch.trim()}
               className="px-10 py-4 bg-hub-blue text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-lg shadow-hub-blue/30 disabled:opacity-50"
             >
               {isAiMatching ? (
                 <>
                   <Loader2 className="w-4 h-4 animate-spin" /> Analyzing 
                 </>
               ) : (
                 <>
                   <Sparkles className="w-4 h-4" /> AI Tư vấn
                 </>
               )}
             </button>
          </div>
        </div>

        {/* Areas */}
        <div className="space-y-24 mb-32">
          {areas.map((area, i) => (
            <motion.div 
              id={area.id}
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`flex flex-col lg:flex-row gap-16 items-center ${i % 2 !== 0 ? "lg:flex-row-reverse" : ""} relative ${matchedServiceId === area.id ? "ring-2 ring-hub-blue rounded-[4rem] p-8 bg-hub-blue/5 scale-[1.02]" : ""}`}
            >
              {matchedServiceId === area.id && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-hub-blue text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl animate-bounce">
                  <Sparkles className="w-4 h-4" /> AI Đề xuất cho bạn
                </div>
              )}
              <div className="lg:w-1/2 relative group">
                <div className="aspect-video rounded-[3rem] overflow-hidden glass p-2 border-white/10">
                  <img src={area.img} className="w-full h-full object-cover rounded-[2.5rem] group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                </div>
                <div className="absolute -bottom-6 -right-6 glass px-8 py-4 rounded-2xl border-white/10 shadow-2xl">
                  <span className="text-hub-blue font-black text-2xl">{area.price}</span>
                </div>
              </div>
              <div className="lg:w-1/2 space-y-8">
                <div>
                  <span className="text-hub-purple font-bold tracking-widest uppercase text-xs mb-4 block">{area.desc}</span>
                  <h2 className="text-4xl md:text-5xl font-bold mb-6">{area.title}</h2>
                  <p className="text-gray-400 text-lg leading-relaxed mb-8">
                    Không gian được thiết kế tối ưu cho {area.desc.toLowerCase()}, với sức chứa {area.capacity}. 
                    Đầy đủ tiện nghi và hỗ trợ kỹ thuật xuyên suốt.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {area.features.map((f, j) => (
                      <div key={j} className="flex items-center gap-3 text-sm text-gray-300">
                        <CheckCircle2 className="w-5 h-5 text-hub-blue" /> {f}
                      </div>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => navigate("/booking")}
                  className="px-10 py-4 bg-white text-hub-black rounded-full font-bold hover:bg-hub-blue hover:text-white transition-all uppercase text-xs tracking-widest"
                >
                  Đặt phòng ngay
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Packages */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter italic">Gói Dịch Vụ Đa Tầng</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Thấu hiểu nhu cầu của từng đối tượng, từ góc học tập cá nhân đến đấu trường sự kiện lớn chuyên nghiệp.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {packages.map((p, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="glass p-8 md:p-10 rounded-[3rem] border-white/5 relative overflow-hidden group flex flex-col"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 ${p.bgClass} opacity-10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:opacity-20 transition-all`} />
                <div className="mb-6 flex justify-between items-start relative z-10">
                   <div className={`px-4 py-1.5 glass rounded-full text-[8px] font-black uppercase tracking-widest ${p.textClass} ${p.borderClass} border`}>{p.tag}</div>
                </div>
                <h4 className="text-2xl font-black uppercase tracking-tight mb-2 italic">{p.title}</h4>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-6">{p.desc}</p>
                <div className="text-3xl font-black text-white mb-8 group-hover:text-hub-blue transition-colors">{p.price}</div>
                <ul className="space-y-4 mb-10 flex-1 relative z-10">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-[11px] text-gray-400 font-medium">
                      <CheckCircle2 className={`w-4 h-4 ${p.textClass}`} /> {f}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => setOrdering(p)}
                  className={`w-full py-4 ${p.bgClass} text-white rounded-full font-black hover:scale-105 transition-all uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-lg ${p.shadowClass}`}
                >
                  <ShoppingCart className="w-4 h-4" /> Kích hoạt ngay
                </button>
              </motion.div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="max-w-4xl mx-auto glass rounded-[3rem] border-white/5 overflow-hidden shadow-2xl">
            <div className="p-8 md:p-12">
              <h3 className="text-2xl font-black uppercase tracking-widest text-center mb-10">So sánh quyền lợi</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-6 text-[10px] uppercase tracking-widest text-gray-500">Đặc tính</th>
                      <th className="py-6 text-[10px] uppercase tracking-widest text-hub-blue">Thuyết trình</th>
                      <th className="py-6 text-[10px] uppercase tracking-widest text-hub-purple">Ra mắt SP</th>
                      <th className="py-6 text-[10px] uppercase tracking-widest text-hub-magenta">Premium Custom</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.map((row, i) => (
                      <tr key={i} className="border-b border-white/5 last:border-0 group hover:bg-white/[0.02] transition-colors">
                        <td className="py-6 font-bold text-xs pr-4">{row.feature}</td>
                        <td className="py-6 text-[11px] text-gray-400">{row.basic}</td>
                        <td className="py-6 text-[11px] text-gray-400">{row.team}</td>
                        <td className="py-6 text-[11px] text-gray-200 font-bold">{row.event}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Order Modal */}
        <AnimatePresence>
          {ordering && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => !isSubmitting && setOrdering(null)}
                className="absolute inset-0 bg-hub-black/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-lg glass p-10 rounded-[3rem] border-white/10 shadow-2xl"
              >
                {!orderSuccess ? (
                  <>
                    <h3 className="text-3xl font-bold mb-2 uppercase tracking-tight italic">
                      {!showPayment ? "Xác nhận ghi danh" : (paymentStep === "card" ? "Bảo mật Quốc tế" : "Thanh toán Một Chạm")}
                    </h3>
                    <p className="text-gray-400 mb-8 font-medium italic text-xs uppercase tracking-widest">
                      {!showPayment ? "Gói dịch vụ cao cấp tại The Hub" : (paymentStep === "card" ? "Nhập thông tin thẻ Visa/Mastercard" : "Chọn phương thức phù hợp với bạn")}
                    </p>
                    
                    {!showPayment ? (
                      <div className="space-y-8">
                        <div className="glass p-6 rounded-2xl border-white/5">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Dịch vụ</span>
                            <span className="text-lg font-bold">{ordering.title}</span>
                          </div>
                          <div className="flex justify-between items-center pt-4 border-t border-white/5">
                            <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Giá niêm yết</span>
                            <span className="text-2xl font-black text-hub-blue">{ordering.price}</span>
                          </div>
                        </div>

                        {!user ? (
                          <div className="text-center py-4">
                            <p className="text-red-400 text-xs font-bold uppercase tracking-widest mb-4">Vui lòng đăng nhập để đặt hàng</p>
                            <button 
                              onClick={() => { setOrdering(null); window.scrollTo(0, 0); }}
                              className="w-full py-4 bg-white text-hub-black rounded-full font-bold uppercase tracking-widest text-xs"
                            >
                              Quay lại đăng nhập
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-4">
                            <button 
                              onClick={() => setOrdering(null)}
                              className="flex-1 py-4 glass rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-white/10"
                            >
                              Hủy bỏ
                            </button>
                            <button 
                              onClick={() => setShowPayment(true)}
                              className="flex-[2] py-4 bg-hub-purple rounded-full font-bold uppercase tracking-widest text-[10px] hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-lg shadow-hub-purple/30"
                            >
                               Tiếp tục thanh toán <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {paymentStep === "methods" ? (
                           <>
                             <div className="grid grid-cols-2 gap-4">
                               {[
                                 { id: "momo", name: "Ví Momo", icon: "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" },
                                 { id: "vnpay", name: "VNPay QR", icon: "https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg" },
                                 { id: "credit-card", name: "Thẻ Quốc tế", icon: null, isCredit: true },
                                 { id: "hub-coin", name: "Hub-Coin", icon: null },
                               ].map(pay => (
                                 <button 
                                   key={pay.id}
                                   onClick={() => {
                                      setPaymentMethod(pay.id);
                                      if (pay.id === "credit-card") setPaymentStep("card");
                                   }}
                                   className={`p-4 rounded-2xl glass border flex flex-col items-center gap-2 transition-all ${paymentMethod === pay.id ? "border-hub-blue bg-hub-blue/10 scale-105 shadow-lg shadow-hub-blue/20" : "border-white/5 opacity-60 hover:opacity-100"}`}
                                 >
                                    {pay.isCredit ? <CreditCard className="w-6 h-6 text-hub-blue" /> : pay.icon ? <img src={pay.icon} className="h-6 object-contain" referrerPolicy="no-referrer" /> : <Wallet className="w-6 h-6 text-hub-magenta" />}
                                    <span className="text-[8px] font-black uppercase tracking-widest">{pay.name}</span>
                                 </button>
                               ))}
                             </div>
     
                             {paymentMethod && paymentMethod !== "credit-card" && (
                               <motion.div 
                                 initial={{ opacity: 0, y: 10 }} 
                                 animate={{ opacity: 1, y: 0 }}
                                 className="glass p-6 rounded-2xl border-white/10 text-center"
                               >
                                 {paymentMethod === "hub-coin" ? (
                                   <div className="py-4">
                                     <div className="text-hub-magenta font-black text-xl mb-1">{ordering.price} HH</div>
                                     <p className="text-[8px] text-gray-500 uppercase font-black">Số dư HH của bạn: {profile?.hubCoins || 0}</p>
                                   </div>
                                 ) : (
                                   <div className="flex flex-col items-center">
                                     <div className="w-40 h-40 bg-white p-2 rounded-xl mb-4">
                                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=SERVICE_${ordering.id}`} className="w-full h-full" referrerPolicy="no-referrer" />
                                     </div>
                                     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Vui lòng quét mã và chờ xác nhận</p>
                                   </div>
                                 )}
                               </motion.div>
                             )}
                           </>
                        ) : (
                           <motion.div 
                             initial={{ opacity: 0, scale: 0.9 }}
                             animate={{ opacity: 1, scale: 1 }}
                             className="space-y-6"
                           >
                              <div className="glass p-6 rounded-[2rem] border-white/10 bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden group">
                                 <div className="absolute top-0 right-0 p-6 opacity-20"><CreditCard className="w-12 h-12" /></div>
                                 <div className="space-y-4">
                                    <div className="space-y-1">
                                       <label className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-500 ml-2">Số thẻ (Demo: 4242 4242 4242 4242)</label>
                                       <input 
                                          type="text"
                                          placeholder="XXXX XXXX XXXX XXXX"
                                          value={cardData.number}
                                          onChange={e => setCardData(prev => ({ ...prev, number: e.target.value }))}
                                          className="w-full px-6 py-3 bg-white/5 rounded-xl border border-white/10 outline-none focus:border-hub-blue transition-all font-mono text-sm"
                                       />
                                    </div>
                                    <div className="space-y-1">
                                       <label className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-500 ml-2">Tên chủ thẻ (Viết hoa)</label>
                                       <input 
                                          type="text"
                                          placeholder="NGUYEN VAN A"
                                          value={cardData.name}
                                          onChange={e => setCardData(prev => ({ ...prev, name: e.target.value.toUpperCase() }))}
                                          className="w-full px-6 py-3 bg-white/5 rounded-xl border border-white/10 outline-none focus:border-hub-blue transition-all text-sm font-bold"
                                       />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                       <div className="space-y-1">
                                          <label className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-500 ml-2">Ngày hết hạn</label>
                                          <input 
                                             type="text"
                                             placeholder="MM/YY"
                                             value={cardData.expiry}
                                             onChange={e => setCardData(prev => ({ ...prev, expiry: e.target.value }))}
                                             className="w-full px-6 py-3 bg-white/5 rounded-xl border border-white/10 outline-none focus:border-hub-blue transition-all text-sm"
                                          />
                                       </div>
                                       <div className="space-y-1">
                                          <label className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-500 ml-2">Mã CVV</label>
                                          <input 
                                             type="password"
                                             placeholder="***"
                                             value={cardData.cvv}
                                             maxLength={3}
                                             onChange={e => setCardData(prev => ({ ...prev, cvv: e.target.value }))}
                                             className="w-full px-6 py-3 bg-white/5 rounded-xl border border-white/10 outline-none focus:border-hub-blue transition-all text-sm"
                                          />
                                       </div>
                                    </div>
                                    <div className="p-4 bg-hub-blue/5 rounded-xl border border-hub-blue/20 flex items-center gap-3">
                                       <div className="w-8 h-8 rounded-full bg-hub-blue/20 flex items-center justify-center text-hub-blue"><Zap className="w-4 h-4" /></div>
                                       <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">Thông tin thẻ được mã hóa AES-256 đầu cuối. The Hub không lưu giữ số thẻ của bạn.</p>
                                    </div>
                                 </div>
                              </div>
                           </motion.div>
                        )}
                        
                        <div className="flex gap-4">
                          <button 
                            disabled={isSubmitting || isProcessing}
                            onClick={() => {
                               if (paymentStep === "card") {
                                  setPaymentStep("methods");
                                  setPaymentMethod(null);
                               } else {
                                  setShowPayment(false);
                               }
                            }}
                            className="flex-1 py-4 glass rounded-full font-bold uppercase tracking-widest text-[10px]"
                          >
                            Trở lại
                          </button>
                          <button 
                            disabled={isSubmitting || !paymentMethod || isProcessing}
                            onClick={handlePlaceOrder}
                            className="flex-[2] py-4 bg-hub-blue rounded-full font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-lg shadow-hub-blue/30 disabled:opacity-50"
                          >
                            {isProcessing ? (
                               <>
                                 <Loader2 className="w-5 h-5 animate-spin" /> Verifying Visa...
                               </>
                            ) : isSubmitting ? (
                               <>
                                 <Loader2 className="w-5 h-5 animate-spin" /> Preparing Pass...
                               </>
                            ) : "Xác nhận Thanh toán"}
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-10 space-y-8">
                    <div className="relative inline-block">
                       <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(34,197,94,0.4)] relative z-10">
                         <Check className="w-12 h-12 text-white" />
                       </div>
                       <motion.div 
                          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 bg-green-500 rounded-full blur-2xl" 
                       />
                    </div>
                    
                    <div>
                       <h3 className="text-4xl font-black mb-2 uppercase tracking-tight italic">Giao dịch Hoàn tất!</h3>
                       <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]">{ordering.title} đã được kích hoạt</p>
                    </div>

                    <div className="glass p-8 rounded-[2.5rem] border-hub-blue/30 bg-hub-blue/5 space-y-6">
                       <div className="bg-white p-3 rounded-2xl w-32 h-32 mx-auto shadow-2xl">
                          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrCodeData}`} className="w-full h-full" referrerPolicy="no-referrer" />
                       </div>
                       <div className="space-y-1">
                          <div className="text-[10px] text-hub-blue font-black uppercase tracking-widest">Hub-Pass Tạm thời</div>
                          <div className="text-sm font-mono font-bold text-white">{qrCodeData}</div>
                       </div>
                    </div>

                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                       Chúng tớ đã gửi hóa đơn chi tiết qua Email của bạn.<br/>
                       Hẹn gặp bạn tại The Hub!
                    </div>

                    <button 
                      onClick={() => setOrdering(null)}
                      className="px-12 py-4 glass rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all border-white/10"
                    >
                      Xong
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Equipment */}
        <section className="py-24 glass rounded-[4rem] border-white/5 px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 uppercase tracking-tight">Thiết Bị Thuê Thêm</h2>
            <p className="text-gray-400">Hỗ trợ tối đa cho các hoạt động sáng tạo và ghi hình.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {equipment.map((e, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mx-auto mb-6 text-hub-blue group-hover:bg-hub-blue group-hover:text-white transition-all">
                  {e.icon}
                </div>
                <h4 className="font-bold mb-2 uppercase text-xs tracking-widest">{e.name}</h4>
                <p className="text-hub-purple font-bold text-sm">{e.price}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Services;
