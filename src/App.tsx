import { motion, AnimatePresence } from "motion/react";
import { HashRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { 
  Users, 
  Lightbulb, 
  Mic2, 
  Coffee, 
  Monitor, 
  ShieldCheck, 
  Calendar, 
  Layout,
  CheckCircle2,
  Star,
  Instagram,
  Facebook,
  Twitter,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  Zap,
  Clock,
  Settings,
  Heart,
  Globe,
  Send,
  MessageSquare,
  BookOpen,
  Camera,
  Printer,
  Music,
  CreditCard,
  QrCode,
  Wallet,
  X
} from "lucide-react";
import { useState, useEffect } from "react";

// --- Components ---

const BookingModal = ({ isOpen, onClose, initialStep = 1, initialData = {} }: { isOpen: boolean, onClose: () => void, initialStep?: number, initialData?: any }) => {
  const [step, setStep] = useState(initialStep);
  const [bookingData, setBookingData] = useState({
    service: initialData.service || "",
    date: "",
    time: "",
    package: initialData.package || ""
  });

  useEffect(() => {
    if (isOpen) {
      setStep(initialStep);
      setBookingData(prev => ({ ...prev, ...initialData }));
    }
  }, [isOpen, initialStep, initialData]);

  if (!isOpen) return null;

  const services = [
    { id: "workshop", title: "Workshop Space", icon: <Users /> },
    { id: "networking", title: "Networking Lounge", icon: <Globe /> },
    { id: "talkshow", title: "Talkshow Stage", icon: <Mic2 /> },
    { id: "training", title: "Training Room", icon: <Monitor /> },
    { id: "launch", title: "Product Launch", icon: <Zap /> },
  ];

  const timeSlots = ["08:00 - 12:00", "13:00 - 17:00", "18:00 - 22:00", "Full Day"];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-hub-black/80 backdrop-blur-xl"
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-2xl glass rounded-[3rem] border-white/10 overflow-hidden shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-full transition-colors z-10">
          <X className="w-6 h-6" />
        </button>

        <div className="p-8 md:p-12">
          {/* Progress Bar */}
          <div className="flex items-center justify-between mb-12 max-w-xs mx-auto">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${step >= s ? "bg-hub-purple text-white" : "bg-white/10 text-gray-500"}`}>
                  {s}
                </div>
                {s < 3 && <div className={`w-12 h-px mx-2 ${step > s ? "bg-hub-purple" : "bg-white/10"}`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-3xl font-bold mb-2">Chọn Dịch Vụ</h2>
                <p className="text-gray-400 mb-8">Vui lòng chọn loại không gian bạn muốn đặt.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {services.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setBookingData({ ...bookingData, service: s.title });
                        setStep(2);
                      }}
                      className={`flex items-center gap-4 p-6 rounded-2xl border transition-all text-left group ${bookingData.service === s.title ? "bg-hub-purple/20 border-hub-purple" : "glass border-white/5 hover:border-white/20"}`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${bookingData.service === s.title ? "bg-hub-purple text-white" : "bg-white/10 text-hub-purple group-hover:bg-hub-purple group-hover:text-white"}`}>
                        {s.icon}
                      </div>
                      <span className="font-bold">{s.title}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-3xl font-bold mb-2">Chọn Thời Gian</h2>
                <p className="text-gray-400 mb-8">Chọn ngày và khung giờ tổ chức sự kiện.</p>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Ngày tổ chức</label>
                    <input 
                      type="date" 
                      className="w-full p-4 rounded-xl glass border-white/5 focus:border-hub-blue outline-none transition-all"
                      onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Khung giờ</label>
                    <div className="grid grid-cols-2 gap-3">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setBookingData({ ...bookingData, time: slot })}
                          className={`p-4 rounded-xl border text-sm font-bold transition-all ${bookingData.time === slot ? "bg-hub-blue/20 border-hub-blue text-hub-blue" : "glass border-white/5 hover:border-white/20"}`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button onClick={() => setStep(1)} className="flex-1 py-4 glass rounded-xl font-bold">Quay lại</button>
                    <button 
                      disabled={!bookingData.date || !bookingData.time}
                      onClick={() => setStep(3)} 
                      className="flex-1 py-4 bg-hub-purple rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Tiếp theo
                    </button>
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
              >
                <h2 className="text-3xl font-bold mb-2">Thanh Toán</h2>
                <p className="text-gray-400 mb-8">Xác nhận thông tin và chọn phương thức thanh toán.</p>
                
                <div className="glass p-6 rounded-2xl border-white/5 mb-8">
                  <div className="flex justify-between mb-4 pb-4 border-b border-white/5">
                    <span className="text-gray-400 text-sm">Dịch vụ:</span>
                    <span className="font-bold">{bookingData.service || "Chưa chọn"}</span>
                  </div>
                  <div className="flex justify-between mb-4 pb-4 border-b border-white/5">
                    <span className="text-gray-400 text-sm">Ngày:</span>
                    <span className="font-bold">{bookingData.date || "Chưa chọn"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Khung giờ:</span>
                    <span className="font-bold">{bookingData.time || "Chưa chọn"}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <button className="flex flex-col items-center gap-2 p-4 glass rounded-xl border-white/5 hover:border-hub-blue transition-all">
                    <CreditCard className="w-6 h-6 text-hub-blue" />
                    <span className="text-[10px] font-bold uppercase">Thẻ</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 p-4 glass rounded-xl border-white/5 hover:border-hub-purple transition-all">
                    <QrCode className="w-6 h-6 text-hub-purple" />
                    <span className="text-[10px] font-bold uppercase">QR Code</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 p-4 glass rounded-xl border-white/5 hover:border-hub-magenta transition-all">
                    <Wallet className="w-6 h-6 text-hub-magenta" />
                    <span className="text-[10px] font-bold uppercase">Ví điện tử</span>
                  </button>
                </div>

                <button 
                  onClick={() => {
                    alert("Cảm ơn bạn đã đặt lịch tại The Hub! Chúng tôi sẽ liên hệ sớm nhất.");
                    onClose();
                  }}
                  className="w-full py-5 bg-gradient-to-r from-hub-purple to-hub-blue rounded-2xl font-bold text-lg glow-purple"
                >
                  Xác nhận thanh toán
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

const Navbar = ({ onOpenBooking }: { onOpenBooking: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "glass py-4" : "bg-transparent py-6"}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-hub-purple to-hub-blue rounded-lg flex items-center justify-center font-bold text-xl">H</div>
          <span className="text-2xl font-extrabold tracking-tighter uppercase">The Hub</span>
        </Link>
        <div className="hidden lg:flex items-center gap-6 font-medium text-[11px] uppercase tracking-widest">
          <a href="#about" className="hover:text-hub-blue transition-colors">Giới thiệu</a>
          <a href="#services" className="hover:text-hub-blue transition-colors">Dịch vụ</a>
          <a href="#suggestions" className="hover:text-hub-blue transition-colors">Gợi ý sự kiện</a>
          <a href="#pricing" className="hover:text-hub-blue transition-colors">Bảng giá</a>
          <a href="#terms" className="hover:text-hub-blue transition-colors">Điều khoản</a>
          <button 
            onClick={onOpenBooking}
            className="px-6 py-2 bg-white text-hub-black rounded-full font-bold hover:bg-hub-blue hover:text-white transition-all duration-300"
          >
            Đặt lịch ngay
          </button>
        </div>
      </div>
    </nav>
  );
};

const Hero = ({ onOpenBooking }: { onOpenBooking: () => void }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="spotlight" />
      
      {/* Cosmic Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.2, scale: Math.random() }}
            animate={{ 
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0.2, 0.5, 0.2] 
            }}
            transition={{ 
              duration: 5 + Math.random() * 5, 
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%` 
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1 rounded-full glass text-[10px] font-bold tracking-[0.3em] uppercase mb-6 text-hub-blue border-hub-blue/30">
            Cosmic Event Universe
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 tracking-tight leading-none">
            THE HUB – Vũ trụ kết nối <br />
            <span className="text-gradient-cosmic">vô tận giá trị</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10 font-light leading-relaxed">
            The Hub là hệ thống không gian sự kiện linh hoạt dành cho workshop, talkshow, networking, 
            đào tạo và các hoạt động cộng đồng sáng tạo. Trải nghiệm chuyên nghiệp với hệ thống 
            âm thanh, ánh sáng, LED và đội ngũ hỗ trợ từ A–Z.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onOpenBooking}
              className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-hub-purple to-hub-blue rounded-full font-bold text-lg hover:scale-105 transition-transform glow-purple"
            >
              Book không gian ngay
            </button>
            <a 
              href="#pricing"
              className="w-full sm:w-auto px-10 py-4 glass rounded-full font-bold text-lg hover:bg-white/10 transition-all border-white/20 flex items-center justify-center"
            >
              Xem bảng giá
            </a>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-px h-12 bg-gradient-to-b from-white to-transparent"
        />
      </div>
    </section>
  );
};

const QuickHighlights = () => {
  const highlights = [
    { icon: <Users className="w-6 h-6" />, title: "Sức chứa linh hoạt", desc: "Từ 20 - 100 khách tùy layout." },
    { icon: <Monitor className="w-6 h-6" />, title: "Công nghệ hiện đại", desc: "LED P2.5, âm thanh, ánh sáng stage." },
    { icon: <Zap className="w-6 h-6" />, title: "Hỗ trợ trọn gói", desc: "MC, Teabreak, Decor theo yêu cầu." },
    { icon: <Calendar className="w-6 h-6" />, title: "Booking nhanh", desc: "Xác nhận trong 30 phút." },
  ];

  return (
    <section className="py-12 border-y border-white/5 bg-white/2">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((h, i) => (
            <div key={i} className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-hub-blue group-hover:bg-hub-blue group-hover:text-white transition-all">
                {h.icon}
              </div>
              <div>
                <h4 className="font-bold text-sm mb-1">{h.title}</h4>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">{h.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const About = () => {
  const navigate = useNavigate();
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-hub-purple font-bold tracking-widest uppercase text-xs mb-4 block">Về chúng tôi</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
              Hành trình kiến tạo <br />
              <span className="text-gradient-cosmic">Vũ trụ sự kiện</span>
            </h2>
            <p className="text-gray-400 text-lg mb-6 leading-relaxed">
              The Hub không chỉ là một địa điểm cho thuê, chúng tôi là những người đồng hành cùng ý tưởng của bạn. 
              Được thành lập bởi đội ngũ đam mê sự kiện, chúng tôi hiểu rằng mỗi kết nối đều mang trong mình một hạt giống thành công.
            </p>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
              Với không gian được thiết kế theo phong cách "Cosmic Modern", The Hub mang lại cảm giác vô tận, 
              nơi ranh giới giữa thực tế và sáng tạo được xóa nhòa.
            </p>
            
            <div className="grid grid-cols-2 gap-8 mb-12">
              <div className="glass p-6 rounded-2xl border-white/5">
                <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-hub-magenta" /> Sứ mệnh
                </h4>
                <p className="text-xs text-gray-500">Kiến tạo không gian chuyên nghiệp, truyền cảm hứng và tối ưu chi phí cho cộng đồng.</p>
              </div>
              <div className="glass p-6 rounded-2xl border-white/5">
                <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-hub-blue" /> Tầm nhìn
                </h4>
                <p className="text-xs text-gray-500">Trở thành biểu tượng của sự kết nối sáng tạo cho Gen Z và Startup tại Việt Nam.</p>
              </div>
            </div>

            <button 
              onClick={() => navigate("/vechungtoi")}
              className="flex items-center gap-2 text-hub-blue font-bold group"
            >
              Tìm hiểu thêm <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-[3rem] overflow-hidden glass p-2 border-white/10">
              <img 
                src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=2069" 
                className="w-full h-full object-cover rounded-[2.5rem] opacity-80"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-hub-purple/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-hub-blue/20 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Services = ({ onOpenBooking }: { onOpenBooking: (service: string) => void }) => {
  const mainServices = [
    { icon: <Users />, title: "Workshop Space", desc: "Không gian tối ưu cho đào tạo, chia sẻ kỹ năng với đầy đủ trang thiết bị hỗ trợ giảng dạy.", link: "workshop-space" },
    { icon: <Globe />, title: "Networking Lounge", desc: "Khu vực mở hiện đại, lý tưởng cho các buổi giao lưu, kết nối và pitching dự án.", link: "networking-lounge" },
    { icon: <Mic2 />, title: "Talkshow Stage", desc: "Sân khấu mini chuyên nghiệp với hệ thống âm thanh, ánh sáng và màn hình LED P2.5.", link: "talkshow-stage" },
    { icon: <Monitor />, title: "Training Room", desc: "Phòng đào tạo tiêu chuẩn cho doanh nghiệp với không gian yên tĩnh và tập trung cao.", link: "training-room" },
    { icon: <Zap />, title: "Product Launch", desc: "Không gian bùng nổ cho các buổi ra mắt sản phẩm, livestream và truyền thông thương hiệu.", link: "product-launch" },
  ];

  return (
    <section id="services" className="py-24 bg-white/2">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Dịch Vụ Chuyên Nghiệp</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Chúng tôi mang đến những giải pháp không gian toàn diện, giúp sự kiện của bạn tỏa sáng rực rỡ.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {mainServices.map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              onClick={() => onOpenBooking(s.title)}
              className="glass p-8 rounded-3xl border-white/5 hover:border-hub-purple/50 transition-all group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-hub-purple/10 flex items-center justify-center mb-6 text-hub-purple group-hover:bg-hub-purple group-hover:text-white transition-all">
                {s.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">{s.desc}</p>
              <div className="flex items-center gap-2 text-hub-blue text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Đặt lịch ngay <ChevronRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const VenueLayouts = () => {
  const layouts = [
    { title: "U-Shape", capacity: "25-30", img: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=2070" },
    { title: "Classroom", capacity: "40-50", img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2070" },
    { title: "Theatre", capacity: "80-100", img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=2012" },
    { title: "Networking", capacity: "100+", img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=2069" },
  ];

  return (
    <section id="layouts" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Sơ Đồ Không Gian</h2>
          <p className="text-gray-400">Linh hoạt thay đổi theo nhu cầu sự kiện của bạn.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {layouts.map((l, i) => (
            <div key={i} className="group relative aspect-[4/5] rounded-3xl overflow-hidden glass p-1 border-white/5">
              <img src={l.img} className="w-full h-full object-cover rounded-[1.4rem] opacity-60 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-hub-black to-transparent flex flex-col justify-end p-8">
                <h4 className="text-xl font-bold mb-1">{l.title}</h4>
                <p className="text-xs text-hub-blue font-bold uppercase tracking-widest">Sức chứa: {l.capacity} khách</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Pricing = ({ onSelectPackage }: { onSelectPackage: (pkg: string) => void }) => {
  const tiers = [
    { name: "Cơ bản", price: "500k", unit: "giờ", features: ["Không gian tiêu chuẩn", "Wifi tốc độ cao", "Nước uống", "Hỗ trợ kỹ thuật"], color: "white" },
    { name: "Chuyên nghiệp", price: "1.2tr", unit: "giờ", features: ["Màn hình LED P2.5", "Âm thanh stage", "MC hỗ trợ", "Teabreak nhẹ"], color: "hub-purple", popular: true },
    { name: "Trọn gói", price: "8tr", unit: "ngày", features: ["Toàn bộ không gian", "Full thiết bị", "Decor theo yêu cầu", "Quay chụp sự kiện"], color: "hub-blue" },
  ];

  return (
    <section id="pricing" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Bảng Giá Linh Hoạt</h2>
          <p className="text-gray-400">Tối ưu chi phí cho mọi quy mô sự kiện.</p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          {tiers.map((t, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className={`glass p-10 rounded-[3rem] border-white/5 relative overflow-hidden ${t.popular ? "border-hub-purple/50 glow-purple" : ""}`}
            >
              {t.popular && <div className="absolute top-6 right-6 px-3 py-1 bg-hub-purple rounded-full text-[10px] font-bold uppercase tracking-widest">Phổ biến</div>}
              <h4 className="text-xl font-bold mb-6">{t.name}</h4>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-bold">{t.price}</span>
                <span className="text-gray-500 text-sm">/{t.unit}</span>
              </div>
              <ul className="space-y-4 mb-10">
                {t.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-gray-400">
                    <CheckCircle2 className="w-4 h-4 text-hub-blue" /> {f}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => onSelectPackage(t.name)}
                className={`w-full py-4 rounded-full font-bold transition-all ${t.popular ? "bg-hub-purple" : "glass hover:bg-white/10"}`}
              >
                Chọn gói này
              </button>
            </motion.div>
          ))}
        </div>
        
        {/* Detailed Pricing Table Suggestion */}
        <div className="mt-20 glass p-8 md:p-12 rounded-[2.5rem] border-white/5 overflow-x-auto">
          <h3 className="text-2xl font-bold mb-8 text-center">Chi Tiết Dịch Vụ Đi Kèm</h3>
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Dịch vụ</th>
                <th className="py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Cơ bản</th>
                <th className="py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Chuyên nghiệp</th>
                <th className="py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Trọn gói</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { label: "Màn hình LED P2.5", basic: "Không", pro: "Có", full: "Có" },
                { label: "Âm thanh Stage", basic: "Cơ bản", pro: "Chuyên nghiệp", full: "Full System" },
                { label: "MC / Host", basic: "Không", pro: "1 MC", full: "Team MC" },
                { label: "Teabreak", basic: "Nước lọc", pro: "Bánh & Trà", full: "Buffet nhẹ" },
                { label: "Thời gian", basic: "Theo giờ", pro: "Theo giờ", full: "Cả ngày" },
              ].map((row, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className="py-4 font-medium">{row.label}</td>
                  <td className="py-4 text-gray-500">{row.basic}</td>
                  <td className="py-4 text-hub-purple font-bold">{row.pro}</td>
                  <td className="py-4 text-hub-blue font-bold">{row.full}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

const BookingProcess = () => {
  const steps = [
    { title: "Liên hệ", desc: "Gửi yêu cầu qua form hoặc hotline." },
    { title: "Tư vấn", desc: "The Hub tư vấn layout và dịch vụ." },
    { title: "Đặt cọc", desc: "Xác nhận lịch và thanh toán cọc." },
    { title: "Sự kiện", desc: "Tận hưởng không gian và hỗ trợ." },
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Quy Trình Đặt Chỗ</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <div key={i} className="relative text-center group">
              <div className="w-16 h-16 rounded-full glass flex items-center justify-center mx-auto mb-6 text-xl font-bold border-white/5 group-hover:border-hub-blue transition-all">
                {i + 1}
              </div>
              <h4 className="font-bold mb-2">{s.title}</h4>
              <p className="text-xs text-gray-500">{s.desc}</p>
              {i < 3 && <div className="hidden lg:block absolute top-8 left-[calc(50%+4rem)] w-[calc(100%-8rem)] h-px bg-white/5" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Blog = () => {
  const navigate = useNavigate();
  const posts = [
    { title: "Top 5 không gian workshop tại Quận 1", date: "15/03/2026", img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2070" },
    { title: "Kinh nghiệm tổ chức networking cho Startup", date: "10/03/2026", img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=2069" },
    { title: "Tại sao ánh sáng quan trọng trong sự kiện?", date: "05/03/2026", img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=2012" },
  ];

  return (
    <section id="blog" className="py-24 bg-white/2">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl font-bold mb-4">Tin Tức & Sự Kiện</h2>
            <p className="text-gray-400">Cập nhật những hoạt động mới nhất từ cộng đồng The Hub.</p>
          </div>
          <button 
            onClick={() => navigate("/blog")}
            className="text-hub-blue font-bold flex items-center gap-2 hover:translate-x-2 transition-transform"
          >
            Xem tất cả <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((p, i) => (
            <div key={i} className="glass rounded-3xl overflow-hidden border-white/5 group cursor-pointer" onClick={() => navigate(`/blog/${i}`)}>
              <div className="aspect-video overflow-hidden">
                <img src={p.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
              </div>
              <div className="p-8">
                <span className="text-[10px] font-bold text-hub-purple uppercase tracking-widest mb-3 block">{p.date}</span>
                <h4 className="text-lg font-bold mb-4 group-hover:text-hub-blue transition-colors">{p.title}</h4>
                <span className="text-xs font-bold flex items-center gap-2">Đọc tiếp <ChevronRight className="w-4 h-4" /></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BookingForm = () => {
  return (
    <section id="booking" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto glass p-10 md:p-16 rounded-[3rem] border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-hub-purple/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Nhận Báo Giá Ngay</h2>
              <p className="text-gray-400">Để lại thông tin, chúng tôi sẽ liên hệ tư vấn trong vòng 15 phút.</p>
            </div>
            <form className="grid md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-4">Họ và tên</label>
                <input type="text" placeholder="Nguyễn Văn A" className="w-full px-6 py-4 rounded-2xl glass border-white/5 focus:border-hub-blue outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-4">Số điện thoại</label>
                <input type="tel" placeholder="090 123 4567" className="w-full px-6 py-4 rounded-2xl glass border-white/5 focus:border-hub-blue outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-4">Loại sự kiện</label>
                <select className="w-full px-6 py-4 rounded-2xl glass border-white/5 focus:border-hub-blue outline-none transition-all appearance-none">
                  <option>Workshop</option>
                  <option>Networking</option>
                  <option>Sinh nhật</option>
                  <option>Tiệc bia</option>
                  <option>Khác</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-4">Số lượng khách</label>
                <input type="number" placeholder="Ví dụ: 50" className="w-full px-6 py-4 rounded-2xl glass border-white/5 focus:border-hub-blue outline-none transition-all" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-4">Ghi chú thêm</label>
                <textarea placeholder="Yêu cầu đặc biệt của bạn..." rows={4} className="w-full px-6 py-4 rounded-2xl glass border-white/5 focus:border-hub-blue outline-none transition-all resize-none"></textarea>
              </div>
              <div className="md:col-span-2 mt-4">
                <button className="w-full py-5 bg-gradient-to-r from-hub-purple to-hub-blue rounded-2xl font-bold text-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-3">
                  Gửi yêu cầu tư vấn <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const EventSuggestions = ({ onOpenBooking }: { onOpenBooking: (service: string) => void }) => {
  const suggestions = [
    { 
      title: "Tổ chức Sinh nhật", 
      icon: <Star className="w-6 h-6" />, 
      desc: "Biến ngày sinh nhật thành một bữa tiệc vũ trụ lung linh. Chúng tôi hỗ trợ trang trí bóng bay, nến, hoa và hệ thống karaoke chất lượng cao.",
      link: "tochucsinhnhat"
    },
    { 
      title: "Tiệc Bia & Chill", 
      icon: <Music className="w-6 h-6" />, 
      desc: "Không gian lý tưởng cho các buổi 'Beer Night'. Quầy bar hiện đại, âm nhạc sôi động và không gian mở giúp mọi người xích lại gần nhau hơn.",
      link: "tiecbia"
    },
    { 
      title: "Họp mặt Startup", 
      icon: <Users className="w-6 h-6" />, 
      desc: "Nơi các Founder gặp gỡ, chia sẻ kinh nghiệm và tìm kiếm nhà đầu tư trong một không gian chuyên nghiệp nhưng không kém phần sáng tạo.",
      link: "startup-meetup"
    },
    { 
      title: "Workshop Thủ công", 
      icon: <Lightbulb className="w-6 h-6" />, 
      desc: "Không gian yên tĩnh, đầy đủ ánh sáng cho các buổi làm nến thơm, vẽ tranh hay làm đồ thủ công sáng tạo.",
      link: "workshop-thu-cong"
    }
  ];

  return (
    <section id="suggestions" className="py-24 bg-white/2">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Gợi Ý Tổ Chức Sự Kiện</h2>
          <p className="text-gray-400">Những ý tưởng bùng nổ cho sự kiện của bạn tại The Hub.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {suggestions.map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="glass p-8 rounded-3xl border-white/5 hover:border-hub-blue/50 transition-all group cursor-pointer"
              onClick={() => onOpenBooking(s.title)}
            >
              <div className="w-12 h-12 rounded-xl bg-hub-blue/10 flex items-center justify-center mb-6 text-hub-blue group-hover:bg-hub-blue group-hover:text-white transition-all">
                {s.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">{s.desc}</p>
              <span className="text-xs font-bold text-hub-blue flex items-center gap-2">
                Khám phá ngay <ChevronRight className="w-4 h-4" />
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TermsOfService = () => {
  const navigate = useNavigate();
  return (
    <section id="terms" className="py-24">
      <div className="container mx-auto px-6">
        <div className="glass p-10 md:p-16 rounded-[3rem] border-white/10">
          <h2 className="text-3xl font-bold mb-8 text-hub-blue">Điều Khoản Dịch Vụ</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-hub-purple" /> 1. Quy định đặt chỗ
                </h4>
                <p className="text-sm text-gray-400">Khách hàng cần đặt cọc tối thiểu 30% giá trị hợp đồng để giữ chỗ. Hủy lịch trước 48h sẽ được hoàn cọc 100%.</p>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-hub-purple" /> 2. Sử dụng thiết bị
                </h4>
                <p className="text-sm text-gray-400">The Hub cung cấp thiết bị tiêu chuẩn. Khách hàng có trách nhiệm bảo quản và bồi thường nếu xảy ra hư hỏng do lỗi chủ quan.</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-hub-purple" /> 3. Thời gian thuê
                </h4>
                <p className="text-sm text-gray-400">Thời gian thuê bao gồm cả thời gian setup và dọn dẹp. Vượt quá thời gian quy định sẽ tính phí phát sinh theo giờ.</p>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-hub-purple" /> 4. Vệ sinh & An ninh
                </h4>
                <p className="text-sm text-gray-400">Khách hàng cần tuân thủ các quy định về phòng cháy chữa cháy và giữ gìn vệ sinh chung trong suốt quá trình diễn ra sự kiện.</p>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-10 border-t border-white/5 text-center">
            <button 
              onClick={() => navigate("/dieukhoanchitiet")}
              className="text-hub-purple font-bold flex items-center gap-2 mx-auto hover:translate-x-2 transition-transform"
            >
              Xem toàn bộ điều khoản <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="pt-24 pb-12 bg-hub-black border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => navigate("/")}>
              <div className="w-10 h-10 bg-gradient-to-br from-hub-purple to-hub-blue rounded-lg flex items-center justify-center font-bold text-xl">H</div>
              <span className="text-2xl font-extrabold tracking-tighter uppercase">The Hub</span>
            </div>
            <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
              Hệ thống không gian sự kiện linh hoạt, hiện đại, all-in-one cho workshop, networking và startup events.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter, Globe].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-hub-purple transition-colors">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-gray-400">Liên hệ</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li className="flex items-center gap-3"><MapPin className="w-4 h-4 text-hub-blue" /> 123 Đường Sáng Tạo, Quận 1, TP.HCM</li>
              <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-hub-blue" /> +84 900 123 456</li>
              <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-hub-blue" /> hello@thehub.vn</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-gray-400">Chính sách</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><button onClick={() => navigate("/chinhsachdichvu")} className="hover:text-white transition-colors">Chính sách dịch vụ</button></li>
              <li><button onClick={() => navigate("/chinhsachhuylich")} className="hover:text-white transition-colors">Chính sách hủy lịch</button></li>
              <li><button onClick={() => navigate("/baomatthongtin")} className="hover:text-white transition-colors">Bảo mật thông tin</button></li>
            </ul>
          </div>
        </div>
        <div className="pt-12 border-t border-white/5 text-center text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em]">
          <p>© 2026 THE HUB – Where Every Connection Counts. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

const Home = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingInitialStep, setBookingInitialStep] = useState(1);
  const [bookingInitialData, setBookingInitialData] = useState({});

  const handleOpenBooking = (service?: string) => {
    setBookingInitialStep(service ? 2 : 1);
    setBookingInitialData({ service: service || "" });
    setIsBookingOpen(true);
  };

  const handleSelectPackage = (pkg: string) => {
    setBookingInitialStep(3);
    setBookingInitialData({ package: pkg });
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen selection:bg-hub-purple selection:text-white">
      <AnimatePresence>
        {isBookingOpen && (
          <BookingModal 
            isOpen={isBookingOpen} 
            onClose={() => setIsBookingOpen(false)} 
            initialStep={bookingInitialStep}
            initialData={bookingInitialData}
          />
        )}
      </AnimatePresence>

      <Navbar onOpenBooking={() => handleOpenBooking()} />
      <Hero onOpenBooking={() => handleOpenBooking()} />
      <QuickHighlights />
      <About />
      <Services onOpenBooking={handleOpenBooking} />
      <EventSuggestions onOpenBooking={handleOpenBooking} />
      <VenueLayouts />
      
      {/* Why Choose Us Section */}
      <section className="py-24 bg-nebula">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden glass p-1 animate-float" style={{ animationDelay: "0s" }}>
                  <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover rounded-[1.4rem]" referrerPolicy="no-referrer" />
                </div>
                <div className="aspect-square rounded-3xl overflow-hidden glass p-1 animate-float" style={{ animationDelay: "1s" }}>
                  <img src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=2012" className="w-full h-full object-cover rounded-[1.4rem]" referrerPolicy="no-referrer" />
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="aspect-square rounded-3xl overflow-hidden glass p-1 animate-float" style={{ animationDelay: "0.5s" }}>
                  <img src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover rounded-[1.4rem]" referrerPolicy="no-referrer" />
                </div>
                <div className="aspect-[4/5] rounded-3xl overflow-hidden glass p-1 animate-float" style={{ animationDelay: "1.5s" }}>
                  <img src="https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover rounded-[1.4rem]" referrerPolicy="no-referrer" />
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-10">Lý Do Chọn <br /><span className="text-hub-purple">The Hub?</span></h2>
              <div className="space-y-8">
                {[
                  { title: "Mô hình All-in-one", desc: "Tiết kiệm thời gian, không gian đẹp đúng gu Gen Z." },
                  { title: "Thiết bị xịn", desc: "Màn hình LED, âm thanh chuẩn, không cần thuê ngoài." },
                  { title: "Giá tối ưu", desc: "Chi phí hợp lý hơn khách sạn, linh hoạt theo giờ." },
                  { title: "Hỗ trợ tận tâm", desc: "Đội ngũ kỹ thuật hỗ trợ từ A–Z suốt sự kiện." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 group">
                    <div className="w-12 h-12 rounded-2xl bg-hub-purple/10 flex items-center justify-center flex-shrink-0 text-hub-purple group-hover:bg-hub-purple group-hover:text-white transition-all">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-1">{item.title}</h4>
                      <p className="text-gray-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Pricing onSelectPackage={handleSelectPackage} />

      {/* Client Types Section */}
      <section className="py-24 border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Khách Hàng Mục Tiêu</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {["Startup", "SMEs", "CLB Sinh Viên", "Diễn giả / Trainer", "KOLs / KOCs", "Freelancer sáng tạo", "Agency sự kiện", "Trung tâm đào tạo"].map((type, i) => (
              <div key={i} className="px-8 py-4 glass rounded-full font-bold border-white/5 hover:border-hub-blue/50 transition-all cursor-default text-sm">
                {type}
              </div>
            ))}
          </div>
        </div>
      </section>

      <BookingProcess />
      <Blog />
      <TermsOfService />

      {/* Testimonials */}
      <section className="py-24 bg-white/2">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Founder Startup", text: "Không gian cực kỳ chuyên nghiệp, ánh sáng đẹp, rất hợp workshop startup." },
              { name: "Community Lead", text: "Đội ngũ hỗ trợ nhanh, setup linh hoạt, khách mời rất thích trải nghiệm." },
              { name: "Trainer / Speaker", text: "Chi phí hợp lý hơn nhiều so với khách sạn nhưng vẫn premium." },
            ].map((t, i) => (
              <div key={i} className="glass p-10 rounded-[2.5rem] border-white/5 relative">
                <Star className="w-8 h-8 text-hub-gold/20 absolute top-6 right-6" />
                <p className="text-gray-400 italic mb-8 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-hub-purple to-hub-blue" />
                  <span className="font-bold text-sm uppercase tracking-widest">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BookingForm />
      <Footer />
    </div>
  );
};

const NotFound = () => {
  return (
    <div className="min-h-screen bg-hub-black flex items-center justify-center p-6 text-center overflow-hidden">
      <div className="relative">
        {/* Background Glow */}
        <div className="absolute -inset-20 bg-hub-purple/20 blur-[100px] rounded-full animate-pulse" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative glass p-12 md:p-20 rounded-[3rem] border-white/10 max-w-2xl backdrop-blur-3xl"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              y: [0, -10, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-32 h-32 bg-gradient-to-br from-hub-purple to-hub-blue rounded-[2rem] mx-auto mb-10 flex items-center justify-center text-5xl font-black shadow-2xl shadow-hub-purple/40"
          >
            404
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase leading-none">
            BẠN ĐI LẠC <br /> <span className="text-hub-purple">À?</span>
          </h1>
          
          <p className="text-gray-400 text-lg mb-12 leading-relaxed max-w-md mx-auto">
            Có vẻ như không gian này chưa được khai phá hoặc đã bị dịch chuyển sang một chiều không gian khác trong vũ trụ The Hub.
          </p>
          
          <Link 
            to="/" 
            className="inline-flex items-center gap-3 px-12 py-6 bg-hub-purple hover:bg-hub-purple/80 text-white rounded-full font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-hub-purple/30 group"
          >
            VỀ TRANG CHỦ Á 
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
}
