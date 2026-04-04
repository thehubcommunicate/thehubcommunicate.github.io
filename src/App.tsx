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
import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "glass py-4" : "bg-transparent py-6"}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-hub-purple to-hub-blue rounded-lg flex items-center justify-center font-bold text-xl">H</div>
          <span className="text-2xl font-extrabold tracking-tighter uppercase">The Hub</span>
        </Link>
        <div className="hidden lg:flex items-center gap-6 font-medium text-[11px] uppercase tracking-widest">
          <button onClick={() => scrollToSection("home")} className="hover:text-hub-blue transition-colors">Trang chủ</button>
          <button onClick={() => navigate("/about")} className="hover:text-hub-blue transition-colors">Về chúng tôi</button>
          <button onClick={() => scrollToSection("services")} className="hover:text-hub-blue transition-colors">Dịch vụ</button>
          <button onClick={() => navigate("/projects")} className="hover:text-hub-blue transition-colors">Dự án</button>
          <button onClick={() => navigate("/pricing")} className="hover:text-hub-blue transition-colors">Bảng giá</button>
          <button onClick={() => navigate("/blog")} className="hover:text-hub-blue transition-colors">Blog</button>
          <button 
            onClick={() => navigate("/contact")}
            className="px-6 py-2 bg-white text-hub-black rounded-full font-bold hover:bg-hub-blue hover:text-white transition-all duration-300"
          >
            Liên hệ ngay
          </button>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  const navigate = useNavigate();
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
            Creative Communication Hub
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 tracking-tight leading-none">
            Kết nối đúng người – <br />
            <span className="text-gradient-cosmic">Đúng thời điểm</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10 font-light leading-relaxed">
            THE HUB giúp thương hiệu xây dựng kết nối thật với khách hàng thông qua storytelling, 
            chiến dịch social media, KOL/KOC và hoạt động cộng đồng.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => {
                const element = document.getElementById("services");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-hub-purple to-hub-blue rounded-full font-bold text-lg hover:scale-105 transition-transform glow-purple"
            >
              Khám phá dịch vụ
            </button>
            <button 
              onClick={() => navigate("/projects")}
              className="w-full sm:w-auto px-10 py-4 glass rounded-full font-bold text-lg hover:bg-white/10 transition-all border-white/20 flex items-center justify-center"
            >
              Xem dự án
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
    { icon: <Zap className="w-6 h-6" />, title: "50+ Chiến dịch", desc: "Đã triển khai thành công." },
    { icon: <Users className="w-6 h-6" />, title: "20+ Đối tác", desc: "Tin tưởng đồng hành." },
    { icon: <Globe className="w-6 h-6" />, title: "1M+ Tiếp cận", desc: "Lượt tương tác thực tế." },
    { icon: <Heart className="w-6 h-6" />, title: "95% Hài lòng", desc: "Tỉ lệ khách hàng quay lại." },
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
              Kiến tạo kết nối <br />
              <span className="text-gradient-cosmic">Thật trong kỷ nguyên số</span>
            </h2>
            <p className="text-gray-400 text-lg mb-6 leading-relaxed">
              THE HUB là Creative Agency chuyên biệt về Gen Z và các giải pháp truyền thông tích hợp. 
              Chúng tôi không chỉ làm marketing, chúng tôi xây dựng những cộng đồng bền vững xung quanh thương hiệu.
            </p>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
              Với sự am hiểu sâu sắc về hành vi khách hàng hiện đại, chúng tôi biến những thông điệp khô khan 
              thành những câu chuyện truyền cảm hứng, thúc đẩy hành động và tạo ra giá trị thực.
            </p>
            
            <div className="grid grid-cols-2 gap-8 mb-12">
              <div className="glass p-6 rounded-2xl border-white/5">
                <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-hub-magenta" /> Sứ mệnh
                </h4>
                <p className="text-xs text-gray-500">Giúp thương hiệu nói tiếng nói của khách hàng, tạo ra những kết nối có ý nghĩa và bền vững.</p>
              </div>
              <div className="glass p-6 rounded-2xl border-white/5">
                <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-hub-blue" /> Tầm nhìn
                </h4>
                <p className="text-xs text-gray-500">Trở thành đối tác chiến lược hàng đầu cho các thương hiệu muốn chinh phục thế hệ khách hàng mới.</p>
              </div>
            </div>

            <button 
              onClick={() => navigate("/about")}
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
                src="https://images.unsplash.com/photo-1522071823991-b9671f9d7f1f?auto=format&fit=crop&q=80&w=2070" 
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
  const navigate = useNavigate();
  const mainServices = [
    { id: "social-media", icon: <Globe />, title: "Social Media Campaign", desc: "Xây dựng chiến dịch đa nền tảng tập trung vào reach, engagement và lead generation." },
    { id: "brand-storytelling", icon: <Mic2 />, title: "Brand Storytelling", desc: "Xây dựng câu chuyện thương hiệu chạm cảm xúc và dễ lan truyền." },
    { id: "community-activation", icon: <Users />, title: "Community Activation", desc: "Tạo thử thách cộng đồng, minigame, UGC challenge và chiến dịch lan tỏa." },
    { id: "event-communication", icon: <Zap />, title: "Event Communication", desc: "Truyền thông trước – trong – sau sự kiện, online lẫn offline." },
    { id: "influencer-connection", icon: <Star />, title: "Influencer Connection", desc: "Kết nối KOL/KOC phù hợp insight khách hàng và giá trị thương hiệu." },
    { id: "digital-production", icon: <Monitor />, title: "Digital Content Production", desc: "Sản xuất video short-form, social post, key visual và landing page." },
  ];

  return (
    <section id="services" className="py-24 bg-white/2">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Dịch Vụ Chuyên Nghiệp</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Chúng tôi cung cấp các giải pháp truyền thông sáng tạo, giúp thương hiệu của bạn bứt phá trong kỷ nguyên số.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mainServices.map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="glass p-8 rounded-3xl border-white/5 hover:border-hub-purple/50 transition-all group cursor-pointer"
              onClick={() => navigate(`/dichvu/${s.id}`)}
            >
              <div className="w-12 h-12 rounded-xl bg-hub-purple/10 flex items-center justify-center mb-6 text-hub-purple group-hover:bg-hub-purple group-hover:text-white transition-all">
                {s.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">{s.desc}</p>
              <div className="flex items-center gap-2 text-hub-blue text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Xem chi tiết <ChevronRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AgencyProjects = () => {
  const navigate = useNavigate();
  const projects = [
    { 
      id: "gen-z-connect", 
      title: "Gen Z Connect", 
      category: "Social Media", 
      img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2070",
      desc: "Chiến dịch kết nối thương hiệu thời trang với thế hệ Z thông qua TikTok Challenge."
    },
    { 
      id: "local-brand-revival", 
      title: "Local Brand Revival", 
      category: "Branding", 
      img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=2070",
      desc: "Tái định vị thương hiệu cà phê truyền thống, tăng 200% doanh thu trong 3 tháng."
    },
    { 
      id: "education-launch", 
      title: "Education Launch", 
      category: "Integrated Campaign", 
      img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=2070",
      desc: "Chiến dịch ra mắt ứng dụng học tập mới với sự tham gia của 50+ Influencers."
    },
  ];

  return (
    <section id="projects" className="py-24">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl font-bold mb-4">Dự Án Tiêu Biểu</h2>
            <p className="text-gray-400">Những chiến dịch truyền thông bùng nổ mà chúng tôi đã thực hiện.</p>
          </div>
          <button 
            onClick={() => navigate("/projects")}
            className="text-hub-blue font-bold flex items-center gap-2 hover:translate-x-2 transition-transform"
          >
            Xem tất cả <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((p, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -10 }}
              className="group relative aspect-[4/5] rounded-3xl overflow-hidden glass p-1 border-white/5 cursor-pointer"
              onClick={() => navigate(`/projects/${p.id}`)}
            >
              <img src={p.img} className="w-full h-full object-cover rounded-[1.4rem] opacity-60 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-hub-black to-transparent flex flex-col justify-end p-8">
                <span className="text-[10px] font-bold text-hub-blue uppercase tracking-widest mb-2">{p.category}</span>
                <h4 className="text-xl font-bold mb-2">{p.title}</h4>
                <p className="text-xs text-gray-400 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Pricing = () => {
  const navigate = useNavigate();
  const tiers = [
    { name: "Starter", price: "15tr", unit: "tháng", features: ["Quản lý 1 nền tảng", "15 bài đăng/tháng", "Báo cáo cơ bản", "Hỗ trợ email"], color: "white" },
    { name: "Growth", price: "35tr", unit: "tháng", features: ["Quản lý 3 nền tảng", "30 bài đăng/tháng", "Sản xuất 4 video ngắn", "Báo cáo chuyên sâu", "Hỗ trợ 24/7"], color: "hub-purple", popular: true },
    { name: "Premium", price: "70tr", unit: "tháng", features: ["Quản lý đa nền tảng", "Content không giới hạn", "Chiến dịch KOL/KOC", "Sản xuất video chuyên nghiệp", "Chiến lược dài hạn"], color: "hub-blue" },
  ];

  return (
    <section id="pricing" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Bảng Giá Dịch Vụ</h2>
          <p className="text-gray-400">Giải pháp tối ưu cho mọi ngân sách marketing.</p>
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
                onClick={() => navigate("/contact")}
                className={`w-full py-4 rounded-full font-bold transition-all ${t.popular ? "bg-hub-purple" : "glass hover:bg-white/10"}`}
              >
                Nhận tư vấn
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BookingProcess = () => {
  const steps = [
    { title: "Nhận Brief", desc: "Tiếp nhận yêu cầu và mục tiêu từ khách hàng." },
    { title: "Proposal", desc: "Đề xuất chiến lược và ý tưởng sáng tạo." },
    { title: "Hợp đồng", desc: "Thống nhất ngân sách và ký kết hợp tác." },
    { title: "Triển khai", desc: "Thực thi chiến dịch và báo cáo định kỳ." },
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Quy Trình Triển Khai</h2>
          <p className="text-gray-400">Quy trình làm việc chuyên nghiệp, minh bạch và hiệu quả.</p>
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

const Testimonials = () => {
  const reviews = [
    { name: "Anh Tuấn", role: "Marketing Manager, Brand X", content: "THE HUB thực sự hiểu Gen Z. Chiến dịch TikTok vừa rồi đã vượt xa mong đợi của chúng tôi về cả lượt tiếp cận và tỉ lệ chuyển đổi." },
    { name: "Chị Lan", role: "Founder, Local Brand Y", content: "Sự sáng tạo và tận tâm của đội ngũ THE HUB đã giúp thương hiệu của tôi có một diện mạo hoàn toàn mới, trẻ trung và hiện đại hơn." },
    { name: "Anh Minh", role: "CEO, EduTech Startup Z", content: "Quy trình làm việc chuyên nghiệp, Proposal sắc bén và thực thi đúng cam kết. Rất hài lòng khi đồng hành cùng THE HUB." },
  ];

  return (
    <section className="py-24 bg-hub-purple/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Khách Hàng Nói Gì?</h2>
          <p className="text-gray-400">Sự thành công của khách hàng là niềm tự hào của chúng tôi.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="glass p-8 rounded-3xl border-white/5 relative"
            >
              <div className="text-hub-purple mb-6">
                {[...Array(5)].map((_, j) => (
                  <span key={j} className="text-xl">★</span>
                ))}
              </div>
              <p className="text-gray-300 italic mb-8 leading-relaxed">"{r.content}"</p>
              <div>
                <h4 className="font-bold text-white">{r.name}</h4>
                <p className="text-xs text-gray-500 uppercase tracking-widest">{r.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Blog = () => {
  const navigate = useNavigate();
  const posts = [
    { title: "Gen Z Marketing Trends 2026: Những điều cần biết", date: "20/03/2026", img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2070" },
    { title: "Storytelling Framework: Kể chuyện thương hiệu hiệu quả", date: "18/03/2026", img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=2069" },
    { title: "Social Media KPI Guide: Đo lường thành công", date: "15/03/2026", img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=2012" },
  ];

  return (
    <section id="blog" className="py-24 bg-white/2">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl font-bold mb-4">Vũ Trụ Tin Tức</h2>
            <p className="text-gray-400">Cập nhật những xu hướng và kiến thức marketing mới nhất từ THE HUB.</p>
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
              <h2 className="text-4xl font-bold mb-4">Nhận Đề Xuất Chiến Dịch</h2>
              <p className="text-gray-400">Để lại thông tin, chúng tôi sẽ liên hệ tư vấn giải pháp tối ưu nhất cho thương hiệu của bạn.</p>
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
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-4">Dịch vụ quan tâm</label>
                <select className="w-full px-6 py-4 rounded-2xl glass border-white/5 focus:border-hub-blue outline-none transition-all appearance-none">
                  <option>Social Media Campaign</option>
                  <option>Brand Storytelling</option>
                  <option>Community Activation</option>
                  <option>Event Communication</option>
                  <option>Influencer Connection</option>
                  <option>Digital Content Production</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-4">Ngân sách dự kiến</label>
                <select className="w-full px-6 py-4 rounded-2xl glass border-white/5 focus:border-hub-blue outline-none transition-all appearance-none">
                  <option>Dưới 50 triệu</option>
                  <option>50 - 100 triệu</option>
                  <option>100 - 300 triệu</option>
                  <option>Trên 300 triệu</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-4">Mục tiêu chiến dịch</label>
                <textarea placeholder="Chia sẻ thêm về mục tiêu hoặc yêu cầu đặc biệt của bạn..." rows={4} className="w-full px-6 py-4 rounded-2xl glass border-white/5 focus:border-hub-blue outline-none transition-all resize-none"></textarea>
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

const TermsOfService = () => {
  const navigate = useNavigate();
  return (
    <section id="terms" className="py-24">
      <div className="container mx-auto px-6">
        <div className="glass p-10 md:p-16 rounded-[3rem] border-white/10">
          <h2 className="text-3xl font-bold mb-8 text-hub-blue">Điều Khoản Dịch Vụ Agency</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-hub-purple" /> 1. Quy trình làm việc
                </h4>
                <p className="text-sm text-gray-400">Mọi dự án đều bắt đầu bằng việc thống nhất Proposal và ký kết hợp đồng. Chúng tôi cam kết tuân thủ đúng deadline đã đề ra.</p>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-hub-purple" /> 2. Bản quyền sáng tạo
                </h4>
                <p className="text-sm text-gray-400">Quyền sở hữu trí tuệ của các sản phẩm sáng tạo sẽ được chuyển giao cho khách hàng sau khi hoàn tất thanh toán 100% giá trị hợp đồng.</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-hub-purple" /> 3. Chính sách thanh toán
                </h4>
                <p className="text-sm text-gray-400">Thanh toán thường được chia làm 2-3 đợt tùy theo quy mô dự án. Đợt 1 (tạm ứng) là điều kiện để bắt đầu triển khai công việc.</p>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-hub-purple" /> 4. Bảo mật thông tin
                </h4>
                <p className="text-sm text-gray-400">THE HUB cam kết bảo mật tuyệt đối mọi thông tin kinh doanh và dữ liệu chiến dịch của khách hàng theo thỏa thuận NDA.</p>
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
              Creative Communication Agency chuyên biệt cho thế hệ Gen Z. Chúng tôi kết nối thương hiệu với khách hàng thông qua những câu chuyện sáng tạo và chiến dịch bứt phá.
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
              <li><button onClick={() => navigate("/chinhsachhuylich")} className="hover:text-white transition-colors">Chính sách hủy dự án</button></li>
              <li><button onClick={() => navigate("/baomatthongtin")} className="hover:text-white transition-colors">Bảo mật thông tin</button></li>
            </ul>
          </div>
        </div>
        <div className="pt-12 border-t border-white/5 text-center text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em]">
          <p>© 2026 THE HUB – Creative Communication Agency. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// --- Sub-Pages Components ---

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen selection:bg-hub-purple selection:text-white">
      <Navbar />
      <div className="pt-32 pb-20">
        {children}
      </div>
      <Footer />
    </div>
  );
};

const ProjectsPage = () => {
  const navigate = useNavigate();
  const projects = [
    { 
      id: "gen-z-connect", 
      title: "Gen Z Connect", 
      category: "Social Media", 
      img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2070",
      desc: "Chiến dịch kết nối thương hiệu thời trang với thế hệ Z thông qua TikTok Challenge."
    },
    { 
      id: "local-brand-revival", 
      title: "Local Brand Revival", 
      category: "Branding", 
      img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=2070",
      desc: "Tái định vị thương hiệu cà phê truyền thống, tăng 200% doanh thu trong 3 tháng."
    },
    { 
      id: "education-launch", 
      title: "Education Launch", 
      category: "Integrated Campaign", 
      img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=2070",
      desc: "Chiến dịch ra mắt ứng dụng học tập mới với sự tham gia của 50+ Influencers."
    },
  ];

  return (
    <PageLayout>
      <div className="container mx-auto px-6">
        <h1 className="text-5xl md:text-7xl font-black mb-12 text-center text-gradient-cosmic">DỰ ÁN CỦA CHÚNG TÔI</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((p, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="glass rounded-[2.5rem] overflow-hidden border-white/5 group cursor-pointer"
              onClick={() => navigate(`/projects/${p.id}`)}
            >
              <div className="aspect-[4/5] overflow-hidden relative">
                <img src={p.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-hub-black/80 to-transparent flex flex-col justify-end p-8">
                  <span className="text-[10px] font-bold text-hub-blue uppercase tracking-widest mb-2">{p.category}</span>
                  <h3 className="text-2xl font-bold mb-4">{p.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-6 line-clamp-3">{p.desc}</p>
                  <div className="flex items-center gap-2 text-hub-purple font-bold text-xs uppercase tracking-widest">
                    Xem chi tiết <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const projects: Record<string, any> = {
    "gen-z-connect": {
      title: "Gen Z Connect",
      category: "Social Media Campaign",
      client: "Fashion Brand X",
      challenge: "Thương hiệu thời trang truyền thống muốn tiếp cận Gen Z nhưng gặp khó khăn trong việc tạo ra nội dung phù hợp.",
      strategy: "Triển khai TikTok Challenge kết hợp với 20 KOCs mảng thời trang, tạo ra trào lưu mix-match đồ cũ.",
      results: ["10M+ views trên hashtag", "50k+ video tham gia", "Doanh thu tăng 35% trong tháng"],
      img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2070"
    },
    "local-brand-revival": {
      title: "Local Brand Revival",
      category: "Branding & Identity",
      client: "Coffee Heritage",
      challenge: "Thương hiệu cà phê 20 năm tuổi đang dần bị lãng quên bởi giới trẻ.",
      strategy: "Tái định vị hình ảnh thương hiệu theo phong cách 'Modern Vintage', cải tạo không gian quán và menu.",
      results: ["Lượng khách trẻ tăng 150%", "Được nhắc tên trên 10+ trang tin lớn", "Mở thêm 2 chi nhánh mới"],
      img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=2070"
    },
    "education-launch": {
      title: "Education Launch",
      category: "Integrated Marketing",
      client: "EduTech App Y",
      challenge: "Ra mắt ứng dụng học tập trong thị trường đã bão hòa.",
      strategy: "Chiến dịch 'Học không áp lực' với chuỗi livestream cùng các thủ khoa và Influencers giáo dục.",
      results: ["100k+ lượt tải trong tuần đầu", "Top 1 App Store mảng Giáo dục", "Tỉ lệ giữ chân người dùng 40%"],
      img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=2070"
    }
  };

  const project = projects[id || ""] || projects["gen-z-connect"];

  return (
    <PageLayout>
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative aspect-video rounded-[3rem] overflow-hidden glass p-2 border-white/10 mb-12"
          >
            <img src={project.img} className="w-full h-full object-cover rounded-[2.5rem]" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-hub-black/80 to-transparent flex flex-col justify-end p-12">
              <span className="text-hub-blue font-bold uppercase tracking-widest mb-4">{project.category}</span>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">{project.title}</h1>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <section>
                <h2 className="text-3xl font-bold mb-6">Thách thức</h2>
                <p className="text-gray-400 text-lg leading-relaxed">{project.challenge}</p>
              </section>

              <section>
                <h2 className="text-3xl font-bold mb-6">Chiến lược</h2>
                <p className="text-gray-400 text-lg leading-relaxed">{project.strategy}</p>
              </section>

              <section className="glass p-10 rounded-[2.5rem] border-white/5">
                <h2 className="text-2xl font-bold mb-6">Kết quả (KPI)</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {project.results.map((r: string, i: number) => (
                    <div key={i} className="flex items-center gap-4 text-gray-300">
                      <div className="w-10 h-10 rounded-full bg-hub-purple/20 flex items-center justify-center text-hub-purple shrink-0">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <span className="font-bold">{r}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-32 space-y-6">
                <div className="glass p-8 rounded-[2.5rem] border-white/10">
                  <h3 className="text-xl font-bold mb-6">Thông tin dự án</h3>
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-widest block mb-1">Khách hàng</span>
                      <span className="font-bold">{project.client}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-widest block mb-1">Dịch vụ</span>
                      <span className="font-bold">{project.category}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate("/contact")}
                    className="w-full mt-10 py-4 bg-gradient-to-r from-hub-purple to-hub-blue rounded-2xl font-bold hover:scale-105 transition-transform"
                  >
                    Làm chiến dịch tương tự
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

const PricingPage = () => {
  const navigate = useNavigate();
  return (
    <PageLayout>
      <div className="container mx-auto px-6">
        <h1 className="text-5xl md:text-7xl font-black mb-12 text-center text-gradient-cosmic">BẢNG GIÁ DỊCH VỤ</h1>
        <Pricing />
        <div className="mt-20 max-w-4xl mx-auto glass p-10 md:p-16 rounded-[3rem] border-white/10">
          <h2 className="text-3xl font-bold mb-8 text-center">Tại sao nên chọn gói dịch vụ của THE HUB?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-bold text-hub-blue">Tối ưu chi phí</h4>
              <p className="text-sm text-gray-400">Chúng tôi cung cấp các gói dịch vụ linh hoạt, giúp bạn tiết kiệm đến 30% so với việc thuê lẻ từng dịch vụ.</p>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-hub-purple">Chuyên môn cao</h4>
              <p className="text-sm text-gray-400">Đội ngũ chuyên gia giàu kinh nghiệm luôn sẵn sàng tư vấn và triển khai chiến dịch hiệu quả nhất.</p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <button 
              onClick={() => navigate("/contact")}
              className="px-10 py-4 bg-white text-hub-black rounded-full font-bold hover:bg-hub-blue hover:text-white transition-all"
            >
              Liên hệ để nhận báo giá chi tiết
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-start max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-5xl md:text-7xl font-black mb-8 text-gradient-cosmic">LIÊN HỆ VỚI CHÚNG TÔI</h1>
            <p className="text-gray-400 text-lg mb-12 leading-relaxed">
              Bạn đã sẵn sàng để bứt phá? Hãy để lại thông tin, THE HUB sẽ liên hệ tư vấn giải pháp truyền thông tối ưu nhất cho thương hiệu của bạn.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center text-hub-blue group-hover:bg-hub-blue group-hover:text-white transition-all">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-500 uppercase tracking-widest mb-1">Địa chỉ</h4>
                  <p className="font-bold">123 Đường Sáng Tạo, Quận 1, TP.HCM</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center text-hub-purple group-hover:bg-hub-purple group-hover:text-white transition-all">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-500 uppercase tracking-widest mb-1">Hotline</h4>
                  <p className="font-bold">+84 900 123 456</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center text-hub-magenta group-hover:bg-hub-magenta group-hover:text-white transition-all">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-500 uppercase tracking-widest mb-1">Email</h4>
                  <p className="font-bold">hello@thehub.vn</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-10 md:p-12 rounded-[3rem] border-white/10 relative overflow-hidden"
          >
            {submitted ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Gửi thành công!</h3>
                <p className="text-gray-400">Cảm ơn bạn đã liên hệ. Đội ngũ THE HUB sẽ phản hồi trong vòng 15 phút.</p>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-4">Họ và tên</label>
                    <input required type="text" placeholder="Nguyễn Văn A" className="w-full px-6 py-4 rounded-2xl glass border-white/5 focus:border-hub-blue outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-4">Số điện thoại</label>
                    <input required type="tel" placeholder="090 123 4567" className="w-full px-6 py-4 rounded-2xl glass border-white/5 focus:border-hub-blue outline-none transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-4">Email</label>
                  <input required type="email" placeholder="email@example.com" className="w-full px-6 py-4 rounded-2xl glass border-white/5 focus:border-hub-blue outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-4">Dịch vụ quan tâm</label>
                  <select className="w-full px-6 py-4 rounded-2xl glass border-white/5 focus:border-hub-blue outline-none transition-all appearance-none">
                    <option>Social Media Campaign</option>
                    <option>Brand Storytelling</option>
                    <option>Community Activation</option>
                    <option>Event Communication</option>
                    <option>Influencer Connection</option>
                    <option>Digital Content Production</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-4">Lời nhắn</label>
                  <textarea placeholder="Chia sẻ thêm về nhu cầu của bạn..." rows={4} className="w-full px-6 py-4 rounded-2xl glass border-white/5 focus:border-hub-blue outline-none transition-all resize-none"></textarea>
                </div>
                <button className="w-full py-5 bg-gradient-to-r from-hub-purple to-hub-blue rounded-2xl font-bold text-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-3 shadow-xl shadow-hub-purple/20">
                  Gửi yêu cầu tư vấn <Send className="w-5 h-5" />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
};

const AboutPage = () => (
  <PageLayout>
    <div className="container mx-auto px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-5xl md:text-7xl font-black mb-12 text-gradient-cosmic">HÀNH TRÌNH THE HUB</h1>
        
        <div className="glass p-10 md:p-16 rounded-[3rem] border-white/10 space-y-12 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-4">
              <div className="w-2 h-10 bg-hub-purple rounded-full" />
              Chúng tôi là ai?
            </h2>
            <p className="mb-6">
              THE HUB là một Creative Agency trẻ, năng động, được thành lập với sứ mệnh thu hẹp khoảng cách giữa thương hiệu và thế hệ người tiêu dùng mới – Gen Z. Chúng tôi không chỉ cung cấp các dịch vụ marketing truyền thống, chúng tôi kiến tạo những trải nghiệm thương hiệu độc đáo và có ý nghĩa.
            </p>
            <p>
              Tại THE HUB, chúng tôi tin rằng truyền thông hiệu quả nhất là khi nó dựa trên sự thấu hiểu thật sự. Chúng tôi dành hàng nghìn giờ để nghiên cứu hành vi, ngôn ngữ và xu hướng của giới trẻ để đảm bảo mỗi chiến dịch đều "chạm" đúng điểm rơi của cảm xúc.
            </p>
          </section>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-3xl border-white/5 bg-hub-purple/5">
              <h3 className="text-xl font-bold text-white mb-4">Giá trị cốt lõi</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-hub-blue shrink-0" /> <strong>Thấu hiểu thật:</strong> Luôn đặt mình vào vị trí khách hàng để hiểu họ thực sự cần gì.</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-hub-blue shrink-0" /> <strong>Sáng tạo bứt phá:</strong> Không đi theo lối mòn, luôn tìm kiếm những cách tiếp cận mới mẻ.</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-hub-blue shrink-0" /> <strong>Hiệu quả thực:</strong> Mọi ý tưởng đều phải hướng tới kết quả kinh doanh cuối cùng.</li>
              </ul>
            </div>
            <div className="glass p-8 rounded-3xl border-white/5 bg-hub-blue/5">
              <h3 className="text-xl font-bold text-white mb-4">Đội ngũ của chúng tôi</h3>
              <p className="text-sm">
                Đội ngũ của THE HUB là sự kết hợp giữa những chuyên gia marketing dày dặn kinh nghiệm và những "native Gen Z" đầy sáng tạo. Sự giao thoa này giúp chúng tôi vừa có cái nhìn chiến lược sâu sắc, vừa có sự nhạy bén với những xu hướng mới nhất trên mạng xã hội.
              </p>
            </div>
          </div>

          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Cam kết của chúng tôi</h2>
            <p>
              Chúng tôi cam kết đồng hành cùng thương hiệu trong mọi giai đoạn của chiến dịch. Sự thành công của khách hàng chính là thước đo giá trị lớn nhất của THE HUB. Chúng tôi không chỉ là một agency, chúng tôi là đối tác chiến lược, là người bạn đồng hành tin cậy trên con đường chinh phục khách hàng của bạn.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  </PageLayout>
);

const BlogListPage = () => (
  <PageLayout>
    <div className="container mx-auto px-6">
      <h1 className="text-5xl md:text-7xl font-black mb-12 text-center text-gradient-cosmic">VŨ TRỤ TIN TỨC</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {[
          { 
            title: "Gen Z Marketing Trends 2026: Những điều cần biết", 
            desc: "Khám phá những xu hướng mới nhất đang định hình hành vi tiêu dùng của thế hệ Z trong năm 2026.",
            date: "20/03/2026",
            tag: "Xu hướng"
          },
          { 
            title: "Storytelling Framework: Kể chuyện thương hiệu hiệu quả", 
            desc: "Làm thế nào để xây dựng một câu chuyện thương hiệu có sức lan tỏa mạnh mẽ trên mạng xã hội?",
            date: "18/03/2026",
            tag: "Kiến thức"
          },
          { 
            title: "Social Media KPI Guide: Đo lường thành công", 
            desc: "Hướng dẫn chi tiết cách thiết lập và đo lường các chỉ số KPI quan trọng cho chiến dịch social media.",
            date: "15/03/2026",
            tag: "Kỹ thuật"
          },
          { 
            title: "Sức mạnh của Community Activation trong Marketing", 
            desc: "Tại sao việc kích hoạt cộng đồng lại trở thành yếu tố sống còn cho các thương hiệu hiện đại?",
            date: "12/03/2026",
            tag: "Chiến lược"
          },
          { 
            title: "Influencer Marketing: Chọn đúng người, đúng thời điểm", 
            desc: "Bí quyết lựa chọn KOL/KOC phù hợp để tối ưu hóa hiệu quả truyền thông và ngân sách.",
            date: "10/03/2026",
            tag: "Kinh nghiệm"
          },
          { 
            title: "Sản xuất Video ngắn: Từ ý tưởng đến triệu view", 
            desc: "Quy trình sản xuất video short-form chuyên nghiệp giúp thương hiệu bùng nổ trên TikTok và Reels.",
            date: "08/03/2026",
            tag: "Production"
          }
        ].map((post, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="glass rounded-[2.5rem] overflow-hidden border-white/5 group cursor-pointer"
          >
            <div className="aspect-video bg-white/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-hub-purple/20 to-hub-blue/20 group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-6 left-6 px-3 py-1 bg-hub-purple rounded-full text-[10px] font-bold uppercase tracking-widest">{post.tag}</div>
            </div>
            <div className="p-8">
              <div className="text-xs text-gray-500 mb-3 font-bold">{post.date}</div>
              <h3 className="text-xl font-bold mb-4 group-hover:text-hub-blue transition-colors">{post.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6 line-clamp-3">{post.desc}</p>
              <div className="flex items-center gap-2 text-hub-purple font-bold text-xs uppercase tracking-widest">
                Đọc chi tiết <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </PageLayout>
);

const PolicyPage = ({ title, content }: { title: string, content: React.ReactNode }) => (
  <PageLayout>
    <div className="container mx-auto px-6">
      <div className="max-w-3xl mx-auto glass p-12 md:p-20 rounded-[3rem] border-white/10">
        <h1 className="text-4xl font-black mb-10 text-hub-blue uppercase tracking-tighter">{title}</h1>
        <div className="prose prose-invert max-w-none text-gray-400 space-y-6 leading-relaxed">
          {content}
        </div>
      </div>
    </div>
  </PageLayout>
);

const ServiceDetailPage = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();

  const details: Record<string, any> = {
    "social-media": {
      title: "Social Media Campaign",
      desc: "Xây dựng chiến dịch social media đa nền tảng tập trung vào reach, engagement và lead generation.",
      features: ["Research insight khách hàng", "Xây dựng Concept sáng tạo", "Content Pillar & Calendar", "Production & Design", "KPI Tracking & Report"],
      longDesc: "Chúng tôi không chỉ đăng bài, chúng tôi xây dựng những cuộc hội thoại. Bằng cách nghiên cứu kỹ lưỡng insight của Gen Z và các cộng đồng mục tiêu, THE HUB tạo ra những nội dung có khả năng viral tự nhiên và chuyển đổi cao."
    },
    "brand-storytelling": {
      title: "Brand Storytelling",
      desc: "Xây dựng câu chuyện thương hiệu chạm cảm xúc và dễ lan truyền.",
      features: ["Brand Voice & Personality", "Slogan & Tagline Direction", "Key Message Development", "Storytelling Campaign"],
      longDesc: "Mọi thương hiệu đều có một câu chuyện, nhưng không phải ai cũng biết cách kể nó. Chúng tôi giúp bạn tìm ra 'linh hồn' của thương hiệu và truyền tải nó qua những thông điệp nhất quán, giàu cảm xúc."
    },
    "community-activation": {
      title: "Community Activation",
      desc: "Tạo thử thách cộng đồng, minigame, UGC challenge và chiến dịch lan tỏa.",
      features: ["Hashtag Challenge", "Minigame & Contest", "UGC (User Generated Content)", "Community Management"],
      longDesc: "Sức mạnh của cộng đồng là vô hạn. Chúng tôi thiết kế những hoạt động tương tác giúp khách hàng trở thành những người đại sứ tự nguyện cho thương hiệu của bạn."
    },
    "event-communication": {
      title: "Event Communication",
      desc: "Truyền thông trước – trong – sau sự kiện, online lẫn offline.",
      features: ["Pre-event Teasing", "Live Coverage", "Post-event Recap", "Media Relations"],
      longDesc: "Sự kiện của bạn xứng đáng được biết đến rộng rãi. Chúng tôi đảm bảo sức nóng của sự kiện được duy trì xuyên suốt từ lúc bắt đầu đến khi kết thúc."
    },
    "influencer-connection": {
      title: "Influencer Connection",
      desc: "Kết nối KOL/KOC phù hợp insight khách hàng.",
      features: ["Influencer Matching", "Campaign Briefing", "Content Quality Control", "Performance Measurement"],
      longDesc: "Không chỉ là booking, chúng tôi tìm kiếm những gương mặt thực sự phù hợp với giá trị cốt lõi của thương hiệu để tạo ra những nội dung chân thực nhất."
    },
    "digital-production": {
      title: "Digital Content Production",
      desc: "Sản xuất video, social post, key visual, landing page content.",
      features: ["Short-form Video (TikTok/Reels)", "Graphic Design", "Key Visual Development", "Landing Page Copywriting"],
      longDesc: "Nội dung số chất lượng cao là chìa khóa để giữ chân khách hàng. Chúng tôi sở hữu đội ngũ production sáng tạo, nhạy bén với các xu hướng mới nhất."
    }
  };

  const content = details[id || ""] || details["social-media"];

  return (
    <PageLayout>
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative aspect-video rounded-[3rem] overflow-hidden glass p-2 border-white/10 mb-12"
          >
            <div className="w-full h-full bg-gradient-to-br from-hub-purple/20 to-hub-blue/20 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-12 h-12 text-hub-blue" />
                </div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">{content.title}</h1>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
              <section>
                <h2 className="text-3xl font-bold mb-6">Giải pháp của chúng tôi</h2>
                <p className="text-gray-400 text-lg leading-relaxed">{content.desc}</p>
              </section>

              <section className="glass p-10 rounded-[2.5rem] border-white/5">
                <h2 className="text-2xl font-bold mb-6">Tại sao chọn THE HUB?</h2>
                <p className="text-gray-400 leading-relaxed mb-6">{content.longDesc}</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {content.features.map((f: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                      <CheckCircle2 className="w-5 h-5 text-hub-purple" /> {f}
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-32 space-y-6">
                <div className="glass p-8 rounded-[2.5rem] border-white/10 glow-purple">
                  <h3 className="text-xl font-bold mb-4">Nhận Proposal</h3>
                  <p className="text-sm text-gray-400 mb-8">Để lại thông tin để nhận tư vấn chi tiết và đề xuất chiến dịch phù hợp nhất.</p>
                  <button 
                    onClick={() => navigate("/contact")}
                    className="w-full py-4 bg-hub-purple rounded-2xl font-bold hover:scale-105 transition-transform"
                  >
                    Bắt đầu ngay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

// --- Main App ---

const Home = () => {
  return (
    <div className="min-h-screen selection:bg-hub-purple selection:text-white">
      <Navbar />
      <Hero />
      <QuickHighlights />
      <About />
      <Services />
      <AgencyProjects />
      <Pricing />
      <BookingProcess />
      <Blog />
      <Testimonials />
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
        <Route path="/about" element={<AboutPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/:id" element={<BlogListPage />} />
        <Route path="/dichvu/:id" element={<ServiceDetailPage />} />
        <Route path="/dieukhoanchitiet" element={<PolicyPage 
          title="Điều khoản chi tiết" 
          content={
            <>
              <p>Chào mừng bạn đến với The Hub. Khi sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ các quy định nghiêm ngặt sau đây để đảm bảo một môi trường sự kiện văn minh và chuyên nghiệp.</p>
              <h3 className="text-white font-bold text-xl mt-8 mb-4">1. Quy định về tiếng ồn và thời gian</h3>
              <p>Mọi sự kiện phải kết thúc đúng giờ đã đăng ký. Chúng tôi cho phép tối đa 15 phút dọn dẹp sau giờ thuê. Sau thời gian này, phí phát sinh sẽ được tính theo block 30 phút. Đối với các sự kiện có âm nhạc lớn, vui lòng tuân thủ giới hạn decibel của chúng tôi để không ảnh hưởng đến khu vực xung quanh.</p>
              <h3 className="text-white font-bold text-xl mt-8 mb-4">2. Bảo quản tài sản</h3>
              <p>Hệ thống màn hình LED P2.5 là tài sản cực kỳ giá trị. Khách hàng không được tự ý kết nối các thiết bị lạ vào hệ thống điều khiển khi chưa có sự giám sát của kỹ thuật viên The Hub. Mọi hư hỏng do việc tự ý thao tác sẽ phải bồi thường theo giá trị thay mới của linh kiện chính hãng.</p>
              <h3 className="text-white font-bold text-xl mt-8 mb-4">3. An toàn cháy nổ</h3>
              <p>Tuyệt đối không sử dụng pháo hoa, nến hở (trừ nến sinh nhật nhỏ có giám sát) hoặc các chất dễ cháy nổ trong không gian kín. Chúng tôi có quyền dừng sự kiện ngay lập tức nếu phát hiện các hành vi đe dọa an toàn chung mà không hoàn lại tiền.</p>
            </>
          } 
        />} />
        <Route path="/chinhsachdichvu" element={<PolicyPage 
          title="Chính sách dịch vụ" 
          content={
            <>
              <p>The Hub cam kết mang đến trải nghiệm không gian sự kiện All-in-one hoàn hảo nhất. Chính sách này quy định rõ quyền lợi và trách nhiệm của chúng tôi đối với khách hàng.</p>
              <h3 className="text-white font-bold text-xl mt-8 mb-4">Dịch vụ bao gồm</h3>
              <p>Mỗi gói thuê đều bao gồm: Wifi tốc độ cao (băng thông riêng cho sự kiện), nước uống tinh khiết tại quầy, hỗ trợ kỹ thuật trực tiếp trong suốt thời gian diễn ra và hệ thống máy lạnh trung tâm luôn duy trì ở mức 22-24 độ C.</p>
              <h3 className="text-white font-bold text-xl mt-8 mb-4">Hỗ trợ trang trí</h3>
              <p>Chúng tôi cho phép khách hàng tự decor không gian nhưng không được khoan đục vào tường hoặc sàn nhà. Vui lòng sử dụng băng keo chuyên dụng không để lại vết bẩn. The Hub cũng cung cấp dịch vụ decor trọn gói nếu khách hàng có nhu cầu.</p>
            </>
          } 
        />} />
        <Route path="/chinhsachhuylich" element={<PolicyPage 
          title="Chính sách hủy lịch" 
          content={
            <>
              <p>Chúng tôi hiểu rằng kế hoạch có thể thay đổi. Tuy nhiên, để đảm bảo vận hành, The Hub áp dụng chính sách hoàn hủy như sau:</p>
              <ul className="list-disc pl-6 space-y-4">
                <li><strong>Trước 7 ngày:</strong> Hoàn trả 100% tiền cọc hoặc hỗ trợ dời lịch miễn phí 01 lần.</li>
                <li><strong>Từ 3 đến 7 ngày:</strong> Hoàn trả 50% tiền cọc hoặc phí dời lịch là 20% giá trị hợp đồng.</li>
                <li><strong>Dưới 48 giờ:</strong> Không hoàn trả tiền cọc.</li>
              </ul>
              <p className="mt-8 italic">Lưu ý: Đối với các ngày lễ tết, chính sách hủy lịch sẽ được thỏa thuận riêng trong hợp đồng chính thức.</p>
            </>
          } 
        />} />
        <Route path="/baomatthongtin" element={<PolicyPage 
          title="Bảo mật thông tin" 
          content={
            <>
              <p>Sự riêng tư của bạn là ưu tiên hàng đầu của chúng tôi. The Hub cam kết bảo vệ mọi thông tin cá nhân và dữ liệu sự kiện của khách hàng.</p>
              <h3 className="text-white font-bold text-xl mt-8 mb-4">Dữ liệu thu thập</h3>
              <p>Chúng tôi chỉ thu thập thông tin cần thiết cho việc đặt chỗ: Tên, Số điện thoại, Email và thông tin công ty (nếu cần xuất hóa đơn). Chúng tôi tuyệt đối không bán hoặc chia sẻ dữ liệu này cho bên thứ ba vì mục đích quảng cáo.</p>
              <h3 className="text-white font-bold text-xl mt-8 mb-4">Hình ảnh sự kiện</h3>
              <p>The Hub có thể xin phép chụp ảnh không gian sự kiện để làm tư liệu truyền thông. Tuy nhiên, nếu sự kiện của bạn mang tính chất bảo mật hoặc nội bộ, chúng tôi sẽ tuân thủ yêu cầu không quay phim/chụp ảnh của bạn một cách tuyệt đối.</p>
            </>
          } 
        />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
}
