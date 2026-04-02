import { motion, AnimatePresence } from "motion/react";
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
  Music
} from "lucide-react";
import { useState, useEffect } from "react";

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "glass py-4" : "bg-transparent py-6"}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-hub-purple to-hub-blue rounded-lg flex items-center justify-center font-bold text-xl">H</div>
          <span className="text-2xl font-extrabold tracking-tighter uppercase">The Hub</span>
        </div>
        <div className="hidden lg:flex items-center gap-6 font-medium text-[11px] uppercase tracking-widest">
          <a href="#about" className="hover:text-hub-blue transition-colors">Giới thiệu</a>
          <a href="#services" className="hover:text-hub-blue transition-colors">Dịch vụ</a>
          <a href="#venue" className="hover:text-hub-blue transition-colors">Không gian</a>
          <a href="#pricing" className="hover:text-hub-blue transition-colors">Bảng giá</a>
          <a href="#blog" className="hover:text-hub-blue transition-colors">Blog</a>
          <a href="#contact" className="px-6 py-2 bg-white text-hub-black rounded-full font-bold hover:bg-hub-blue hover:text-white transition-all duration-300">Đặt lịch ngay</a>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-mesh pt-20">
      <div className="spotlight" />
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1 rounded-full glass text-[10px] font-bold tracking-[0.3em] uppercase mb-6 text-hub-blue border-hub-blue/30">
            Where Every Connection Counts
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 tracking-tight leading-none">
            THE HUB – Nơi mọi kết nối <br />
            <span className="text-gradient-purple-blue">đều tạo nên giá trị</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10 font-light leading-relaxed">
            The Hub là hệ thống không gian sự kiện linh hoạt dành cho workshop, talkshow, networking, 
            đào tạo và các hoạt động cộng đồng sáng tạo. Trải nghiệm chuyên nghiệp với hệ thống 
            âm thanh, ánh sáng, LED và đội ngũ hỗ trợ từ A–Z.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-hub-purple to-hub-blue rounded-full font-bold text-lg hover:scale-105 transition-transform glow-purple">
              Book không gian ngay
            </button>
            <button className="w-full sm:w-auto px-10 py-4 glass rounded-full font-bold text-lg hover:bg-white/10 transition-all border-white/20">
              Xem bảng giá
            </button>
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
    { icon: <Layout className="w-5 h-5" />, text: "Không gian 10–50 khách" },
    { icon: <Zap className="w-5 h-5" />, text: "Âm thanh, LED hiện đại" },
    { icon: <Settings className="w-5 h-5" />, text: "Hỗ trợ kỹ thuật 24/7" },
    { icon: <Coffee className="w-5 h-5" />, text: "Pantry & Teabreak xịn" },
    { icon: <Clock className="w-5 h-5" />, text: "Đặt lịch online nhanh" },
  ];

  return (
    <div className="py-12 border-y border-white/5 bg-white/2">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {highlights.map((h, i) => (
            <div key={i} className="flex items-center gap-3 text-gray-400 hover:text-hub-blue transition-colors">
              <div className="text-hub-purple">{h.icon}</div>
              <span className="text-sm font-medium tracking-wide">{h.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const About = () => {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-hub-purple font-bold tracking-widest uppercase text-xs mb-4 block">Câu chuyện thương hiệu</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
              Từ "Trạm sạc ý tưởng" <br />
              đến <span className="text-hub-blue">Hệ sinh thái sự kiện</span>
            </h2>
            <p className="text-gray-400 text-lg mb-6 leading-relaxed">
              Chán ngắt với những phòng họp khô cứng và quán cà phê ồn ào, The Hub ra đời như một “trạm sạc ý tưởng” 
              dành cho startup, sinh viên, doanh nghiệp trẻ và cộng đồng sáng tạo.
            </p>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
              Đây không chỉ là nơi thuê địa điểm, mà là một hệ sinh thái hỗ trợ sự kiện trọn gói giúp mọi ý tưởng 
              có điểm tựa để tỏa sáng.
            </p>
            
            <div className="grid grid-cols-2 gap-8 mb-12">
              <div>
                <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-hub-magenta" /> Sứ mệnh
                </h4>
                <p className="text-sm text-gray-500">Cung cấp không gian chuyên nghiệp, linh hoạt và tối ưu chi phí.</p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-hub-blue" /> Tầm nhìn
                </h4>
                <p className="text-sm text-gray-500">Hệ thống Event Space số 1 dành cho startup & Gen Z tại Việt Nam.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {["Chuyên nghiệp", "Linh hoạt", "Sáng tạo", "Tận tâm", "Kết nối"].map((v, i) => (
                <span key={i} className="px-4 py-1 rounded-full glass text-[10px] font-bold uppercase tracking-widest border-white/5">
                  {v}
                </span>
              ))}
            </div>
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

const Services = () => {
  const mainServices = [
    { icon: <Users />, title: "Workshop Space", desc: "Không gian tối ưu cho đào tạo, chia sẻ kỹ năng, lớp học ngắn hạn." },
    { icon: <Globe />, title: "Networking Lounge", desc: "Không gian mở cho gặp gỡ cộng đồng, startup pitching, kết nối đối tác." },
    { icon: <Mic2 />, title: "Talkshow Stage", desc: "Sân khấu mini với LED, micro, ánh sáng phù hợp talkshow." },
    { icon: <Monitor />, title: "Training Room", desc: "Phòng đào tạo chuyên nghiệp cho doanh nghiệp và SMEs." },
    { icon: <Zap />, title: "Product Launch", desc: "Setup cho ra mắt sản phẩm, truyền thông, livestream, media." },
  ];

  const extraServices = [
    { icon: <Coffee />, text: "Teabreak & Catering" },
    { icon: <Layout />, text: "Decor Concept" },
    { icon: <Settings />, text: "Hỗ trợ kỹ thuật" },
    { icon: <Printer />, text: "In ấn Standee/Backdrop" },
    { icon: <Camera />, text: "Quay chụp sự kiện" },
    { icon: <Users />, text: "MC / Lễ tân / Điều phối" },
  ];

  return (
    <section id="services" className="py-24 bg-white/2">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Dịch Vụ Trọn Gói</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Mọi thứ bạn cần để tổ chức một sự kiện thành công đều có tại The Hub.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {mainServices.map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="glass p-8 rounded-3xl border-white/5 hover:border-hub-purple/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-hub-purple/10 flex items-center justify-center mb-6 text-hub-purple group-hover:bg-hub-purple group-hover:text-white transition-all">
                {s.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="glass p-10 rounded-[3rem] border-white/5">
          <h4 className="text-center font-bold uppercase tracking-widest text-sm mb-10 text-hub-blue">Dịch vụ đi kèm</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {extraServices.map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-3 group cursor-default">
                <div className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-400 group-hover:text-hub-magenta transition-colors">
                  {s.icon}
                </div>
                <span className="text-[11px] font-bold uppercase tracking-tighter text-gray-500 group-hover:text-white transition-colors">{s.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const VenueLayouts = () => {
  const layouts = [
    { name: "U-shape", desc: "Đào tạo, họp nhóm", img: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=2070" },
    { name: "Classroom", desc: "Workshop, lớp học", img: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=2069" },
    { name: "Theatre", desc: "Talkshow, diễn giả", img: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=2070" },
    { name: "Networking", desc: "Kết nối doanh nghiệp", img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=2069" },
  ];

  const amenities = ["Màn hình LED / Máy chiếu", "Âm thanh tiêu chuẩn", "Micro không dây", "Wi-Fi tốc độ cao", "Check-in desk", "Pantry trà cà phê", "Đèn đổi màu concept", "Khu chụp ảnh branding"];

  return (
    <section id="venue" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Không Gian & Setup</h2>
          <p className="text-gray-400">Linh hoạt thay đổi layout trong 10 phút phù hợp với mọi concept.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {layouts.map((l, i) => (
            <div key={i} className="group relative aspect-[4/5] rounded-3xl overflow-hidden glass">
              <img src={l.img} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-hub-black via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <h4 className="text-xl font-bold">{l.name}</h4>
                <p className="text-xs text-hub-blue font-medium">{l.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {amenities.map((a, i) => (
            <div key={i} className="px-6 py-3 glass rounded-2xl flex items-center gap-3 border-white/5">
              <CheckCircle2 className="w-4 h-4 text-hub-purple" />
              <span className="text-sm font-medium text-gray-300">{a}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Pricing = () => {
  const plans = [
    { 
      name: "Gói Cơ Bản", 
      price: "300.000", 
      period: "/giờ",
      features: ["Phòng workshop nhỏ", "Máy chiếu sắc nét", "Âm thanh cơ bản", "Wi-Fi tốc độ cao", "Hỗ trợ setup"],
      color: "border-white/10"
    },
    { 
      name: "Gói Sự Kiện", 
      price: "600.000", 
      period: "/giờ",
      features: ["Sảnh workshop lớn", "LED / Âm thanh nâng cao", "Check-in desk chuyên nghiệp", "Hỗ trợ kỹ thuật trực tiếp", "Ưu tiên đặt lịch"],
      color: "border-hub-purple/50 glow-purple bg-hub-purple/5",
      popular: true
    },
    { 
      name: "Gói Combo Cả Ngày", 
      price: "1.500.000", 
      period: "/giờ quy đổi",
      features: ["Thuê trọn gói cả ngày", "Teabreak cao cấp", "Decor theo concept", "Hỗ trợ Media (Quay/Chụp)", "Branding toàn diện"],
      color: "border-hub-blue/50 glow-blue bg-hub-blue/5"
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-mesh">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Bảng Giá Linh Hoạt</h2>
          <p className="text-gray-400">Tối ưu chi phí cho mọi quy mô sự kiện.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div key={i} className={`glass p-10 rounded-[3rem] border-2 relative flex flex-col ${plan.color}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-hub-purple rounded-full text-[10px] font-bold uppercase tracking-widest">
                  Phổ biến nhất
                </div>
              )}
              <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                <span className="text-gray-400 font-medium">VNĐ{plan.period}</span>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-gray-400">
                    <CheckCircle2 className="w-4 h-4 text-hub-blue" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button className={`w-full py-4 rounded-2xl font-bold transition-all ${plan.popular ? "bg-hub-purple hover:bg-hub-purple/80" : "glass hover:bg-white/10"}`}>
                Nhận báo giá ngay
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-16 flex flex-wrap justify-center gap-8 text-xs font-bold uppercase tracking-widest text-gray-500">
          <span className="flex items-center gap-2"><Zap className="w-4 h-4" /> Giảm giờ thấp điểm T2–T6</span>
          <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Combo CLB sinh viên</span>
          <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Gói đào tạo định kỳ</span>
        </div>
      </div>
    </section>
  );
};

const BookingProcess = () => {
  const steps = [
    { title: "Chọn loại sự kiện", desc: "Workshop, Talkshow hay Networking?" },
    { title: "Chọn layout & ngày giờ", desc: "Linh hoạt theo lịch trình của bạn." },
    { title: "Nhận báo giá tự động", desc: "Minh bạch và nhanh chóng trong 5p." },
    { title: "Đặt cọc & Setup", desc: "Đội ngũ chuyên nghiệp chuẩn bị sẵn sàng." },
  ];

  return (
    <section className="py-24 bg-white/2">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Quy Trình Booking</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-white/5 -translate-y-1/2 z-0" />
          {steps.map((s, i) => (
            <div key={i} className="relative z-10 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-hub-purple flex items-center justify-center font-bold mb-6 glow-purple">
                {i + 1}
              </div>
              <h4 className="font-bold mb-2">{s.title}</h4>
              <p className="text-xs text-gray-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Blog = () => {
  const posts = [
    { title: "Cách tổ chức workshop chuyên nghiệp", category: "Kinh nghiệm", img: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=2070" },
    { title: "Checklist tổ chức talkshow thành công", category: "Checklist", img: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=2070" },
    { title: "Xu hướng micro-event 2026", category: "Xu hướng", img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2070" },
  ];

  return (
    <section id="blog" className="py-24">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl font-bold">Blog & Kiến Thức</h2>
          <button className="text-hub-blue font-bold flex items-center gap-2 hover:translate-x-2 transition-transform">
            Xem tất cả <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((p, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-video rounded-3xl overflow-hidden mb-6 glass">
                <img src={p.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-hub-purple mb-2 block">{p.category}</span>
              <h4 className="text-xl font-bold group-hover:text-hub-blue transition-colors">{p.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BookingForm = () => {
  return (
    <section id="contact" className="py-24 bg-mesh">
      <div className="container mx-auto px-6">
        <div className="glass p-10 md:p-16 rounded-[4rem] border-white/10 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Nhận Báo Giá Trong 5 Phút</h2>
            <p className="text-gray-400">Để lại thông tin, đội ngũ The Hub sẽ liên hệ tư vấn ngay.</p>
          </div>
          <form className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-2">Họ tên</label>
              <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-hub-purple outline-none transition-all" placeholder="Nguyễn Văn A" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-2">Số điện thoại</label>
              <input type="tel" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-hub-purple outline-none transition-all" placeholder="090 123 4567" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-2">Loại sự kiện</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-hub-purple outline-none transition-all appearance-none">
                <option className="bg-hub-black">Workshop</option>
                <option className="bg-hub-black">Talkshow</option>
                <option className="bg-hub-black">Networking</option>
                <option className="bg-hub-black">Khác</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-2">Số lượng khách</label>
              <input type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-hub-purple outline-none transition-all" placeholder="VD: 30" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-2">Yêu cầu setup</label>
              <textarea className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-hub-purple outline-none transition-all h-32" placeholder="Mô tả thêm về yêu cầu của bạn..."></textarea>
            </div>
            <div className="md:col-span-2">
              <button className="w-full py-5 bg-gradient-to-r from-hub-purple to-hub-blue rounded-2xl font-bold text-lg hover:scale-[1.02] transition-transform glow-purple flex items-center justify-center gap-3">
                Gửi yêu cầu ngay <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="pt-24 pb-12 bg-hub-black border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
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
              <li><a href="#" className="hover:text-white transition-colors">Chính sách dịch vụ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Chính sách hủy lịch</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Bảo mật thông tin</a></li>
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

export default function App() {
  return (
    <div className="min-h-screen selection:bg-hub-purple selection:text-white">
      <Navbar />
      <Hero />
      <QuickHighlights />
      <About />
      <Services />
      <VenueLayouts />
      
      {/* Why Choose Us Section */}
      <section className="py-24 bg-mesh">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden glass p-1">
                  <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover rounded-[1.4rem]" referrerPolicy="no-referrer" />
                </div>
                <div className="aspect-square rounded-3xl overflow-hidden glass p-1">
                  <img src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=2012" className="w-full h-full object-cover rounded-[1.4rem]" referrerPolicy="no-referrer" />
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="aspect-square rounded-3xl overflow-hidden glass p-1">
                  <img src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover rounded-[1.4rem]" referrerPolicy="no-referrer" />
                </div>
                <div className="aspect-[4/5] rounded-3xl overflow-hidden glass p-1">
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

      <Pricing />

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
}
