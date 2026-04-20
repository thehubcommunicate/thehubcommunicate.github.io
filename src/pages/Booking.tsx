import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Zap, Users, Calendar, ArrowRight, ChevronRight, CheckCircle2, CreditCard, QrCode as QrIcon, Wallet, Layout, Palette, MessageSquare, Sparkles, Bot, Loader2, Map as MapIcon, Shield, Globe, Coffee, Wifi, Monitor, Info, Trophy, Gem, Lightbulb, Star, Target, Layers, BookOpen, Copy } from "lucide-react";
import PageLayout from "../components/PageLayout";
import { suggestEventLayout } from "../lib/gemini";
import { createBooking, db } from "../lib/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { useAuth } from "../components/AuthProvider";

interface ConceptTemplate {
  id: string;
  title: string;
  tier: "essential" | "standard" | "premium";
  description: string;
  image: string;
  features: string[];
  basePrice: number;
}

const BUDGET_TIERS = [
  { id: "essential", name: "Essential", desc: "Tối ưu ngân sách, hiệu quả tối đa", icon: <Zap className="w-5 h-5" />, color: "from-blue-500/20 to-cyan-500/20", borderColor: "border-blue-500/30", textColor: "text-blue-400" },
  { id: "standard", name: "Standard", desc: "Sự cân bằng hoàn hảo cho sự kiện chuyên nghiệp", icon: <Star className="w-5 h-5" />, color: "from-purple-500/20 to-pink-500/20", borderColor: "border-purple-500/30", textColor: "text-purple-400" },
  { id: "premium", name: "Premium", desc: "Đỉnh cao trải nghiệm, trọn gói sang trọng", icon: <Trophy className="w-5 h-5" />, color: "from-amber-500/20 to-orange-500/20", borderColor: "border-amber-500/30", textColor: "text-amber-400" },
];

const EVENT_TYPES = [
  { id: "education", name: "Trải nghiệm giáo dục (Thuyết trình)", icon: <BookOpen className="w-5 h-5" />, desc: "Tổ chức các buổi thuyết trình, chia sẻ kiến thức" },
  { id: "launch", name: "Tổ chức sự kiện ra mắt sản phẩm", icon: <Zap className="w-5 h-5" />, desc: "Setup và vận hành sự kiện launch sản phẩm" },
  { id: "birthday", name: "Tổ chức sự kiện sinh nhật", icon: <Star className="w-5 h-5" />, desc: "Khách mời, MC/Nhân vật đặc biệt, Dụng cụ tổ chức" },
  { id: "other", name: "Tổ chức hoạt động khác", icon: <Users className="w-5 h-5" />, desc: "Câu lạc bộ, cộng đồng, workshop..." },
  { id: "premium", name: "Premium Custom Event", icon: <Trophy className="w-5 h-5" />, desc: "Thiết kế & vận hành theo yêu cầu riêng biệt" },
];

const CONCEPTS: Record<string, ConceptTemplate[]> = {
  education: [
    { id: "edu-ess", title: "Standard Presentation", tier: "essential", basePrice: 2000000, description: "Không gian thuyết trình cơ bản, đầy đủ trang thiết bị.", image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80", features: ["Âm thanh cơ bản", "Máy chiếu HD", "Nước suối"] },
    { id: "edu-std", title: "Pro Workshop", tier: "standard", basePrice: 3500000, description: "Mô hình workshop chuyên nghiệp với hỗ trợ kỹ thuật.", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80", features: ["Teabreak nhẹ", "Sắp xếp bàn chữ U", "Micro không dây"] },
    { id: "edu-pre", title: "Academy Summit", tier: "premium", basePrice: 5000000, description: "Hội nghị giáo dục cao cấp với trải nghiệm tối ưu.", image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80", features: ["Buffet nhẹ", "Livestream cơ bản", "Hỗ trợ kỹ thuật 1-1"] },
  ],
  launch: [
    { id: "lau-ess", title: "Basic Launch", tier: "essential", basePrice: 1500000, description: "Giải pháp nhanh gọn để giới thiệu sản phẩm.", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80", features: ["Bục trưng bày", "Wifi tốc độ cao", "Standee cơ bản"] },
    { id: "lau-std", title: "Creative Showcase", tier: "standard", basePrice: 2500000, description: "Không gian trưng bày sáng tạo mang đậm dấu ấn thương hiệu.", image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80", features: ["Hệ thống đèn spotlight", "Khu vực check-in", "Âm thanh PA"] },
    { id: "lau-pre", title: "Grand Reveal", tier: "premium", basePrice: 4000000, description: "Sự kiện ra mắt hoành tráng với vận hành chuyên nghiệp.", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80", features: ["Màn hình LED", "Quay phim highlight", "Tiệc Teabreak cao cấp"] },
  ],
  birthday: [
    { id: "bir-ess", title: "Cozy Birthday", tier: "essential", basePrice: 1000000, description: "Tiệc sinh nhật ấm cúng cho nhóm nhỏ.", image: "https://images.unsplash.com/photo-1530103862676-fa8c9d34dbad?auto=format&fit=crop&q=80", features: ["Trang trí cơ bản", "Hệ thống loa Bluetooth", "Nước uống"] },
    { id: "bir-std", title: "Party Vibe", tier: "standard", basePrice: 1700000, description: "Buổi tiệc sinh nhật năng động với âm thanh ánh sáng.", image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80", features: ["Gói decor chủ đề", "Karaoke system", "Bánh kem Hub-Style"] },
    { id: "bir-pre", title: "VIP Celebration", tier: "premium", basePrice: 2500000, description: "Trải nghiệm sinh nhật đẳng cấp với nhân vật đặc biệt.", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80", features: ["MC điều phối", "Chụp ảnh sự kiện", "Quà tặng riêng từ The Hub"] },
  ],
  other: [
    { id: "oth-ess", title: "Hub Gathering", tier: "essential", basePrice: 4000000, description: "Gặp mặt cộng đồng, câu lạc bộ thân mật.", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80", features: ["Sắp xếp linh hoạt", "Wifi 6", "Nước uống"] },
    { id: "oth-std", title: "Active Workshop", tier: "standard", basePrice: 5500000, description: "Hoạt động workshop sáng tạo với đầy đủ dụng cụ.", image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80", features: ["Vật liệu sáng tạo", "Catering nhẹ", "Màn hình tương tác"] },
    { id: "oth-pre", title: "Community Fest", tier: "premium", basePrice: 7000000, description: "Sự kiện cộng đồng quy mô với hỗ trợ toàn diện.", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80", features: ["Quảng bá trên nền tảng Hub", "Livestream", "Hệ thống loa công suất lớn"] },
  ],
  premium: [
    { id: "pre-ess", title: "Custom Essential", tier: "essential", basePrice: 10000000, description: "Thiết kế concept riêng cho sự kiện quy mô vừa.", image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80", features: ["Concept sáng tạo riêng", "Lên kịch bản chi tiết", "Setup không gian"] },
    { id: "pre-std", title: "Executive Custom", tier: "standard", basePrice: 15000000, description: "Tổ chức trọn gói cho doanh nghiệp và branding event.", image: "https://images.unsplash.com/photo-1505373633560-fa3a194602bb?auto=format&fit=crop&q=80", features: ["Điều phối nhân sự (MC, Kỹ thuật)", "Hệ thống LED chuyên nghiệp", "Hậu kỳ video highlight"] },
    { id: "pre-pre", title: "Elite Masterpiece", tier: "premium", basePrice: 20000000, description: "Showcase/Gala đẳng cấp nhất với vận hành hoàn hảo.", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80", features: ["Vận hành full-service", "Brand experience design", "Performer cao cấp"] },
  ]
};

const Booking = () => {
  const [step, setStep] = useState(1);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [eventContext, setEventContext] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [qrPass, setQrPass] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<"methods" | "card">("methods");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBookingDone, setIsBookingDone] = useState(false);
  const [hubPassCode, setHubPassCode] = useState("");
  const [cardData, setCardData] = useState({
     number: "",
     name: "",
     expiry: "",
     cvv: ""
  });

  const navigate = useNavigate();
  const { user, profile } = useAuth();

  // Tiered Booking State
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<string>("standard");
  const [selectedConcept, setSelectedConcept] = useState<ConceptTemplate | null>(null);

  const [bookingData, setBookingData] = useState({
    roomId: null as string | null,
    roomName: "",
    date: new Date().toISOString().split('T')[0],
    time: "10:00",
    participants: 10,
    eventName: "",
    description: "",
    privacy: "private" as "public" | "private",
    addOns: [] as string[],
    totalAmount: 0,
  });

  const addOnsList = [
    { id: "teabreak", name: "Gói Teabreak Cao cấp", price: 500000, icon: <Coffee className="w-4 h-4" /> },
    { id: "camera", name: "Nhiếp ảnh chuyên nghiệp", price: 1500000, icon: <Layout className="w-4 h-4" /> },
    { id: "livestream", name: "Hệ thống Livestream", price: 2500000, icon: <Monitor className="w-4 h-4" /> },
    { id: "security", name: "An ninh & Lễ tân", price: 1000000, icon: <Shield className="w-4 h-4" /> },
  ];

  const rooms = [
    { id: "hall-1", name: "The Grand Hub I", type: "Event", capacity: "50-100", price: 1500000, image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200", tags: ["Sân khấu", "Màn hình LED"] },
    { id: "nest-1", name: "The Nest II", type: "Creative", capacity: "10-20", price: 800000, image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200", tags: ["Gương decor", "Spotlight"] },
    { id: "suite-1", name: "Creative Suite III", type: "Academy", capacity: "20-40", price: 1200000, image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=1200", tags: ["Bảng vẽ", "Acoustic System"] },
  ];

  // Auto-calculate total based on selection
  useEffect(() => {
    let base = selectedConcept?.basePrice || 0;
    const roomPrice = rooms.find(r => r.id === bookingData.roomId)?.price || 0;
    const addOnPrice = bookingData.addOns.reduce((sum, id) => {
      const item = addOnsList.find(a => a.id === id);
      return sum + (item?.price || 0);
    }, 0);
    setBookingData(prev => ({ ...prev, totalAmount: base + roomPrice + addOnPrice }));
  }, [selectedConcept, bookingData.roomId, bookingData.addOns]);

  const isHighTier = selectedTier === "premium" || (bookingData.roomName && bookingData.roomName.includes("Grand Hub"));
  const depositAmount = isHighTier ? bookingData.totalAmount * 0.5 : bookingData.totalAmount;

  const handleCreateBooking = async () => {
    if (!user) return alert("Vui lòng đăng nhập!");
    if (!paymentMethod) return alert("Vui lòng chọn phương thức thanh toán!");
    
    if (paymentMethod === "credit-card" && cardData.number !== "4242 4242 4242 4242") {
        return alert("Demo: Vui lòng sử dụng số thẻ 4242 4242 4242 4242!");
    }

    if (paymentMethod === "hub-coin" && (profile?.hubCoins || 0) < bookingData.totalAmount) {
      return alert("Bạn không đủ Hub-Coin!");
    }

    setIsSubmitting(true);
    try {
      const finalData = {
        ...bookingData,
        conceptId: selectedConcept?.id,
        conceptTitle: selectedConcept?.title,
        tier: selectedTier,
        type: selectedType,
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        status: "pending",
        createdAt: new Date(),
        paymentMethod,
        depositAmount: depositAmount,
      };

      const res = await createBooking(user.uid, finalData);

      if (paymentMethod === "hub-coin") {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { hubCoins: increment(-bookingData.totalAmount) });
      }

      const snap = await getDoc(res);
      const data = snap.data();
      setBookingId(res.id);
      setQrPass(data?.qrPass || "");
      setHubPassCode(data?.qrPass || `HUB-${res.id.slice(0, 5)}`);
      setIsBookingDone(true);
      setStep(5);
    } catch (error) {
      console.error(error);
      alert("Lỗi khi đặt chỗ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !selectedType) return alert("Vui lòng chọn loại hình sự kiện!");
    if (step === 2 && !selectedConcept) return alert("Vui lòng chọn một Concept!");
    setStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <PageLayout>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-6 text-gradient-cosmic uppercase tracking-tighter">THE HUB: CHOOSE YOUR VIBE</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed uppercase tracking-[0.2em] font-bold text-[10px]">
            Tích hợp Concept gợi ý theo ngân sách — Trải nghiệm cá nhân hóa 30 giây.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Progress Indicator */}
          {step <= 4 && (
            <div className="flex justify-center mb-16 gap-4">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs transition-all duration-500 ${step >= s ? "bg-hub-purple text-white shadow-lg shadow-hub-purple/40" : "bg-white/5 text-gray-600"}`}>
                    {s}
                  </div>
                  {s < 4 && <div className={`w-12 h-[2px] mx-2 transition-all duration-700 ${step > s ? "bg-hub-purple" : "bg-white/5"}`} />}
                </div>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12"
              >
                <div className="text-center space-y-4">
                  <h2 className="text-5xl font-black uppercase italic tracking-tighter text-gradient-cosmic">Mục tiêu & Ngân sách</h2>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] max-w-lg mx-auto leading-relaxed">Chọn loại hình sự kiện và tầng ngân sách để chúng tớ gợi ý concept tối ưu nhất cho bạn.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                   <div className="space-y-6">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4 flex items-center gap-2 italic">
                         <Target className="w-4 h-4" /> 1. Loại hình sự kiện
                      </label>
                      <div className="grid gap-4">
                         {EVENT_TYPES.map(type => (
                           <button 
                             key={type.id}
                             onClick={() => setSelectedType(type.id)}
                             className={`w-full p-6 text-left rounded-[2rem] border transition-all flex items-center gap-6 group relative overflow-hidden ${selectedType === type.id ? "bg-hub-blue/10 border-hub-blue shadow-lg shadow-hub-blue/20" : "glass border-white/5 hover:border-white/10"}`}
                           >
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${selectedType === type.id ? "bg-hub-blue text-white" : "bg-white/5 text-gray-500"}`}>
                                 {type.icon}
                              </div>
                              <div className="flex-1">
                                 <div className="text-sm font-black uppercase tracking-widest text-white">{type.name}</div>
                                 <div className="text-[10px] text-gray-500 uppercase font-black">{type.desc}</div>
                              </div>
                              {selectedType === type.id && <div className="absolute top-2 right-2 w-2 h-2 bg-hub-blue rounded-full" />}
                           </button>
                         ))}
                      </div>
                   </div>

                   <div className="space-y-6">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4 flex items-center gap-2 italic">
                         <Layers className="w-4 h-4" /> 2. Tầng ngân sách dự kiến
                      </label>
                      <div className="grid gap-4">
                         {BUDGET_TIERS.map(tier => (
                            <button 
                              key={tier.id}
                              onClick={() => setSelectedTier(tier.id)}
                              className={`w-full p-6 text-left rounded-[2rem] border transition-all relative overflow-hidden group ${selectedTier === tier.id ? `bg-gradient-to-br ${tier.color} border-${tier.borderColor} shadow-xl` : "glass border-white/5 hover:border-white/10"}`}
                            >
                               <div className="flex justify-between items-center mb-3">
                                  <div className={`p-3 rounded-xl ${selectedTier === tier.id ? "bg-white text-hub-black" : "bg-white/5 text-gray-500"}`}>
                                     {tier.icon}
                                  </div>
                                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${selectedTier === tier.id ? tier.textColor : "text-gray-600"}`}>
                                     {tier.name}
                                  </span>
                               </div>
                               <div className="text-sm font-black uppercase tracking-widest text-white mb-1">{tier.name === "Essential" ? "Gói Cơ bản" : tier.name === "Standard" ? "Gói Tiêu chuẩn" : "Gói Cao cấp"}</div>
                               <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed line-clamp-2">{tier.desc}</div>
                            </button>
                         ))}
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
                className="space-y-12"
              >
                <div className="text-center space-y-4">
                  <h2 className="text-5xl font-black uppercase italic tracking-tighter text-gradient-cosmic">Concept gợi ý cho bạn</h2>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] max-w-lg mx-auto">Dựa trên mục tiêu {EVENT_TYPES.find(t => t.id === selectedType)?.name.toLowerCase()}, đây là các lựa chọn phù hợp nhất.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                   {CONCEPTS[selectedType || "education"]?.map(concept => (
                      <motion.div 
                        key={concept.id}
                        whileHover={{ y: -10 }}
                        onClick={() => setSelectedConcept(concept)}
                        className={`cursor-pointer group relative rounded-[3.5rem] overflow-hidden border-2 transition-all p-4 ${selectedConcept?.id === concept.id ? "border-hub-blue bg-hub-blue/10" : "border-white/5 glass hover:border-white/10"}`}
                      >
                         <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-8 relative">
                            <img src={concept.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" />
                            <div className="absolute inset-0 bg-gradient-to-t from-hub-black via-transparent to-transparent opacity-60" />
                            <div className="absolute top-4 left-4">
                               <span className="px-5 py-2 glass border-white/20 rounded-full text-[8px] font-black uppercase tracking-widest text-white backdrop-blur-md">
                                  {concept.tier.toUpperCase()}
                               </span>
                            </div>
                         </div>

                         <div className="px-4 space-y-4">
                            <div className="flex justify-between items-start">
                               <h3 className="text-xl font-black uppercase italic tracking-tighter leading-tight text-white">{concept.title}</h3>
                               <div className="text-right">
                                  <div className="text-[8px] text-gray-500 uppercase font-black">Chỉ từ</div>
                                  <div className="text-sm font-black text-hub-blue">{concept.basePrice.toLocaleString()}đ</div>
                               </div>
                            </div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest leading-relaxed h-10 overflow-hidden line-clamp-2">{concept.description}</p>
                            
                            <div className="pt-4 border-t border-white/5 space-y-2">
                               <div className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Bao gồm:</div>
                               {concept.features.map((feat, i) => (
                                 <div key={i} className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.2em] text-gray-500">
                                    <CheckCircle2 className="w-3 h-3 text-hub-blue" /> {feat}
                                 </div>
                               ))}
                            </div>

                            <button className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[9px] transition-all ${selectedConcept?.id === concept.id ? "bg-hub-blue text-white shadow-xl shadow-hub-blue/30" : "bg-white/5 text-gray-400 group-hover:bg-white/10"}`}>
                               {selectedConcept?.id === concept.id ? "Đã chọn Concept" : "Chọn Concept này"}
                            </button>
                         </div>
                      </motion.div>
                   ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid lg:grid-cols-2 gap-16"
              >
                <div className="space-y-12">
                   <div className="space-y-4">
                      <h2 className="text-4xl font-black uppercase italic tracking-tighter text-gradient-cosmic">Lịch trình & Chi tiết</h2>
                      <div className="p-6 glass rounded-[2.5rem] border-hub-blue/20 bg-hub-blue/5 flex items-center gap-6">
                         <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0">
                            <img src={selectedConcept?.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                         </div>
                         <div>
                            <div className="text-[10px] font-black text-hub-blue uppercase tracking-widest">Concept đã chọn</div>
                            <div className="text-xl font-black uppercase italic text-white">{selectedConcept?.title}</div>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-8">
                     <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2 text-left">
                         <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Ngày diễn ra</label>
                         <input 
                           type="date" 
                           value={bookingData.date}
                           onChange={e => setBookingData(prev => ({ ...prev, date: e.target.value }))}
                           className="w-full px-6 py-4 glass border-white/10 rounded-2xl outline-none focus:border-hub-purple transition-all" 
                         />
                       </div>
                       <div className="space-y-2 text-left">
                         <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Khung giờ</label>
                         <select 
                           value={bookingData.time}
                           onChange={e => setBookingData(prev => ({ ...prev, time: e.target.value }))}
                           className="w-full px-6 py-4 glass border-white/10 rounded-2xl outline-none focus:border-hub-purple appearance-none"
                         >
                           <option value="" className="bg-hub-black text-white">Chọn giờ</option>
                           <option value="08:00 - 12:00" className="bg-hub-black text-white">08:00 - 12:00 (Sáng)</option>
                           <option value="13:30 - 17:30" className="bg-hub-black text-white">13:30 - 17:30 (Chiều)</option>
                           <option value="18:30 - 22:30" className="bg-hub-black text-white">18:30 - 22:30 (Tối)</option>
                         </select>
                       </div>
                     </div>

                     <div className="space-y-6">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Mô hình không gian (Mặc định gợi ý)</label>
                       <div className="grid gap-4">
                         {rooms.map(room => (
                           <button 
                             key={room.id}
                             onClick={() => setBookingData(prev => ({ ...prev, roomId: room.id, roomName: room.name }))}
                             className={`p-4 rounded-3xl border transition-all flex items-center gap-6 text-left relative overflow-hidden group ${bookingData.roomId === room.id ? "bg-hub-purple/10 border-hub-purple" : "glass border-white/5 hover:border-white/10"}`}
                           >
                             <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                               <img src={room.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                             </div>
                             <div className="flex-1">
                               <h4 className="text-sm font-black uppercase italic tracking-tighter text-white">{room.name}</h4>
                               <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{room.capacity} Người | {room.type}</p>
                               <div className="flex gap-2 mt-2">
                                  {room.tags.map(tag => (
                                    <span key={tag} className="text-[8px] px-2 py-0.5 glass rounded-full opacity-60">{tag}</span>
                                  ))}
                               </div>
                             </div>
                             {bookingData.roomId === room.id && <div className="absolute top-2 right-2 w-2 h-2 bg-hub-purple rounded-full" />}
                           </button>
                         ))}
                       </div>
                     </div>
                   </div>
                </div>

                <div className="space-y-12">
                   <div className="space-y-6 w-full">
                      <div className="flex justify-between items-center mb-4">
                         <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Quân sư AI: Sơ đồ gợi ý</label>
                         <button 
                           onClick={async () => {
                             setIsAiLoading(true);
                             const res = await suggestEventLayout(eventContext || "Sự kiện " + (selectedConcept?.title || ""), bookingData.roomName || "Không gian The Hub");
                             setAiSuggestion(res);
                             setIsAiLoading(false);
                           }}
                           disabled={isAiLoading}
                           className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-hub-blue hover:text-white transition-colors"
                         >
                            {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                            Hỏi Quân sư
                         </button>
                      </div>
                      <div className="glass p-6 rounded-[2.5rem] border-white/5 min-h-[160px] relative overflow-hidden font-mono text-[10px] leading-relaxed text-gray-400">
                         {aiSuggestion ? (
                           <div className="whitespace-pre-line text-left">{aiSuggestion}</div>
                         ) : (
                           <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                              <Lightbulb className="w-8 h-8 opacity-20" />
                              <p className="max-w-[180px]">Nhấn "Hỏi Quân sư" để nhận sơ đồ bố trí không gian tối ưu cho Concept này.</p>
                           </div>
                         )}
                      </div>
                   </div>

                   <div className="grid md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Quy mô (Số ghế)</label>
                       <div className="flex gap-4 items-center">
                         {[10, 25, 50, 100].map(l => (
                           <button 
                             key={l}
                             onClick={() => setBookingData(prev => ({ ...prev, participants: l }))}
                             className={`flex-1 py-4 rounded-2xl font-black text-[10px] transition-all ${bookingData.participants === l ? "bg-hub-magenta text-white" : "glass border-white/5 opacity-50"}`}
                           >
                             {l}
                           </button>
                         ))}
                       </div>
                     </div>

                     <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Chế độ hiển thị</label>
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
                     </div>
                   </div>

                   <div className="space-y-6">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Vật phẩm bổ trợ (Add-ons)</label>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {addOnsList.map(item => (
                          <button
                            key={item.id}
                            onClick={() => {
                              setBookingData(prev => ({
                                ...prev,
                                addOns: prev.addOns.includes(item.id) 
                                  ? prev.addOns.filter(id => id !== item.id)
                                  : [...prev.addOns, item.id]
                              }));
                            }}
                            className={`p-4 rounded-2xl border transition-all flex justify-between items-center group ${bookingData.addOns.includes(item.id) ? "bg-hub-blue/20 border-hub-blue" : "glass border-white/5 hover:border-white/10"}`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${bookingData.addOns.includes(item.id) ? "bg-hub-blue text-white" : "glass text-gray-500"}`}>
                                {item.icon}
                              </div>
                              <span className="text-[9px] font-black uppercase tracking-widest text-left">{item.name}</span>
                            </div>
                            <span className="text-[9px] font-black">+{item.price.toLocaleString()}đ</span>
                          </button>
                        ))}
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
                          <div className="w-20 h-20 bg-hub-purple rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-hub-purple/40">
                             <CheckCircle2 className="w-10 h-10 text-white" />
                          </div>
                          <h2 className="text-5xl font-black uppercase italic tracking-tighter text-gradient-cosmic">Ghi danh Thành công</h2>
                          <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px]">Cảm ơn bạn đã lựa chọn tin tưởng hệ thống The Hub Connect.</p>
                       </div>

                       <div className="grid md:grid-cols-2 gap-12 text-left">
                          <div className="space-y-8">
                             <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 italic ml-4">Mã định danh (Hub-Pass)</label>
                                <div className="p-6 glass rounded-2xl border-white/10 flex items-center justify-between group">
                                   <span className="text-2xl font-black text-hub-purple tracking-tighter uppercase italic">{hubPassCode}</span>
                                   <button 
                                     onClick={() => {
                                        navigator.clipboard.writeText(hubPassCode);
                                        alert("Đã sao chép mã định danh!");
                                     }}
                                     className="p-3 glass rounded-xl hover:bg-white/10 transition-all opacity-40 group-hover:opacity-100"
                                   >
                                      <Copy className="w-4 h-4" />
                                   </button>
                                </div>
                             </div>

                             <div className="space-y-4">
                                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 italic ml-4">Tóm lược lịch trình</label>
                                <div className="space-y-3">
                                   {[
                                     { label: "Mô hình", value: bookingData.roomName, icon: <Layout className="w-4 h-4" /> },
                                     { label: "Concept", value: selectedConcept?.title, icon: <Sparkles className="w-4 h-4" /> },
                                     { label: "Thời khắc", value: `${bookingData.date} @ ${bookingData.time}`, icon: <Calendar className="w-4 h-4" /> },
                                   ].map((item, idx) => (
                                      <div key={idx} className="flex items-center gap-4 p-4 glass rounded-2xl border-white/5 opacity-80">
                                         <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-hub-blue">{item.icon}</div>
                                         <div>
                                            <div className="text-[8px] text-gray-500 uppercase font-black tracking-widest font-mono">{item.label}</div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-white leading-none mt-1">{item.value}</div>
                                         </div>
                                      </div>
                                   ))}
                                </div>
                             </div>
                          </div>

                          <div className="flex flex-col items-center justify-center space-y-8 glass p-8 rounded-[3rem] border-white/10 bg-white/5 relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-hub-blue/20 blur-[80px] -mr-16 -mt-16" />
                             <div className="space-y-2 text-center relative z-10">
                                <h4 className="text-xs font-black uppercase italic tracking-widest text-hub-blue font-mono">Hub-Pass QR</h4>
                                <p className="text-[8px] text-gray-500 uppercase font-bold tracking-widest max-w-[140px]">Vui lòng trình mã này tại quầy lễ tân khi check-in.</p>
                             </div>
                             <div className="w-48 h-48 bg-white p-4 rounded-3xl shadow-2xl relative z-10">
                                <img 
                                  src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${hubPassCode}`} 
                                  className="w-full h-full object-contain"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-xl shadow-lg flex items-center justify-center border border-gray-100 p-1">
                                   <div className="w-full h-full bg-hub-purple rounded-md" />
                                </div>
                             </div>
                             <div className="pt-4 relative z-10">
                               <span className="px-4 py-2 border border-white/10 rounded-full text-[8px] font-black uppercase tracking-[0.2em] text-gray-500">
                                  Lượt check-in duy nhất
                               </span>
                             </div>
                          </div>
                       </div>

                       <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row gap-4">
                          <button 
                            onClick={() => navigate("/events")}
                            className="flex-1 py-5 glass border-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-hub-blue/10 hover:border-hub-blue transition-all"
                          >
                             Khám phá Sự kiện khác
                          </button>
                          <button 
                             onClick={() => navigate("/")}
                             className="flex-1 py-5 bg-white text-hub-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-xl shadow-white/20 italic"
                          >
                             Về Trang chủ
                          </button>
                       </div>
                   </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          {step < 5 && (
            <div className="flex justify-between items-center max-w-6xl mx-auto pt-12 border-t border-white/5 mt-12 pb-24">
              <button 
                onClick={prevStep}
                disabled={step === 1 || isSubmitting}
                className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all disabled:opacity-0"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
                <span>Quay lại</span>
              </button>
              
              {step < 4 ? (
                <button 
                  onClick={nextStep}
                  className="flex items-center gap-6 group"
                >
                  <div className="text-right">
                    <div className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Màn tiếp theo</div>
                    <div className="text-sm font-black text-white uppercase tracking-widest italic">{step === 1 ? "Chọn Concept" : step === 2 ? "Lên lịch trình" : "Vào Đấu trường"}</div>
                  </div>
                  <div className="w-14 h-14 bg-hub-purple rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                    <ArrowRight className="w-6 h-6 text-white" />
                  </div>
                </button>
              ) : (
                <div /> // Action button is inside step 4
              )}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Booking;
