import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Zap, Users, ArrowRight, ChevronRight, ChevronDown, Sparkles, MapPin, Play, Clock, Trophy, User, Plus, Loader2 } from "lucide-react";
import Footer from "../components/Footer";
import { useAuth } from "../components/AuthProvider";
import { signInWithGoogle } from "../lib/firebase";

const BackgroundVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    let rafId: number;
    const video = videoRef.current;
    if (!video) return;

    const fadeDuration = 500; // 0.5s

    const updateFade = () => {
      const currentTime = video.currentTime * 1000;
      const duration = video.duration * 1000;

      if (!duration) {
        rafId = requestAnimationFrame(updateFade);
        return;
      }

      let newOpacity = 1;
      if (currentTime < fadeDuration) {
        newOpacity = currentTime / fadeDuration;
      } else if (currentTime > duration - fadeDuration) {
        newOpacity = (duration - currentTime) / fadeDuration;
      }

      setOpacity(Math.max(0, Math.min(1, newOpacity)));
      rafId = requestAnimationFrame(updateFade);
    };

    const handleEnded = () => {
      setOpacity(0);
      setTimeout(() => {
        video.currentTime = 0;
        video.play();
      }, 100);
    };

    video.addEventListener('ended', handleEnded);
    rafId = requestAnimationFrame(updateFade);

    return () => {
      video.removeEventListener('ended', handleEnded);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      style={{ opacity }}
      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-100 ease-linear"
    >
      <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_065045_c44942da-53c6-4804-b734-f9e07fc22e08.mp4" type="video/mp4" />
    </video>
  );
};

const LogoMarquee = () => {
  const logos = [
    { name: "Vortex", color: "bg-blue-500" },
    { name: "Nimbus", color: "bg-purple-500" },
    { name: "Prysma", color: "bg-pink-500" },
    { name: "Cirrus", color: "bg-cyan-500" },
    { name: "Kynder", color: "bg-amber-500" },
    { name: "Halcyn", color: "bg-indigo-500" },
  ];

  return (
    <div className="absolute bottom-10 left-0 right-0 z-20">
      <div className="max-w-5xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="text-foreground/50 text-[10px] font-bold uppercase tracking-[0.3em] whitespace-nowrap hidden lg:block leading-loose">
          Mạng lưới kết nối <br /> sáng tạo & nghệ thuật
        </div>
        
        <div className="flex-1 overflow-hidden relative">
          <div className="flex gap-16 animate-marquee whitespace-nowrap">
            {[...logos, ...logos].map((logo, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl liquid-glass flex items-center justify-center font-bold text-lg select-none">
                  {logo.name[0]}
                </div>
                <span className="text-base font-semibold text-foreground tracking-tight group-hover:text-hub-blue transition-colors">
                  {logo.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeNav, setActiveNav] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-hub-black text-foreground selection:bg-hub-purple selection:text-white font-sans overflow-x-hidden">
      
      {/* Hero Section Container */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">
        
        {/* JS Controlled Background Video */}
        <div className="absolute inset-0 pointer-events-none">
           <BackgroundVideo />
        </div>

        {/* Blurred overlay shape */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[984px] h-[527px] opacity-90 bg-[#050505] blur-[82px] pointer-events-none z-0" />

        {/* Custom Hero Navbar */}
        <nav className="relative z-20 w-full py-5 px-8 flex flex-row items-center justify-between">
           <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
              <div className="w-8 h-8 bg-gradient-to-br from-hub-purple to-hub-blue rounded-lg flex items-center justify-center">
                 <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase font-general">The Hub</span>
           </div>

           <div className="hidden lg:flex items-center gap-10">
              {[
                { name: "Không gian", hasChevron: true, path: "/space" },
                { name: "Sự kiện", hasChevron: false, path: "/events" },
                { name: "Cộng đồng", hasChevron: false, path: "/community" },
                { name: "Thành viên", hasChevron: true, path: "/about" }
              ].map((item) => (
                <button 
                  key={item.name}
                  onClick={() => item.path && navigate(item.path)}
                  className="flex items-center gap-1.5 text-foreground/90 font-medium text-sm hover:text-white transition-colors group"
                >
                  {item.name}
                  {item.hasChevron && <ChevronDown className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />}
                </button>
              ))}
           </div>

           <div>
              {user ? (
                <button 
                  onClick={() => navigate("/dashboard")}
                  className="px-6 py-2.5 rounded-full liquid-glass text-sm font-semibold hover:bg-white/5 transition-all flex items-center gap-2"
                >
                  <img src={user.photoURL || ""} className="w-6 h-6 rounded-full" />
                  Tài khoản
                </button>
              ) : (
                <button 
                  onClick={handleLogin}
                  className="px-6 py-2.5 rounded-full liquid-glass text-sm font-semibold hover:bg-white/5 transition-all text-foreground/90"
                >
                  Đăng ký
                </button>
              )}
           </div>

           {/* Gradient Divider */}
           <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent mt-[3px]" />
        </nav>

        {/* Hero Main Content */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-6">
           <div className="text-center max-w-6xl w-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                 {/* Decorative Glow Backdrop for Title */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-hub-purple/10 via-hub-blue/10 to-hub-magenta/10 blur-[120px] pointer-events-none -z-10" />

                 <h1 className="font-general font-normal text-[80px] md:text-[180px] leading-[0.95] tracking-[-0.06em] select-none text-foreground flex flex-col lg:flex-row items-center justify-center uppercase">
                    <span className="drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">The Hub&nbsp;</span>
                    <motion.span 
                       animate={{ 
                         filter: ["hue-rotate(0deg)", "hue-rotate(20deg)", "hue-rotate(0deg)"] 
                       }}
                       transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                       className="relative inline-block bg-clip-text text-transparent bg-gradient-to-br from-hub-blue via-hub-purple via-hub-purple to-hub-magenta italic drop-shadow-[0_10px_40px_rgba(168,85,247,0.3)] px-4"
                    >
                       Connect
                       {/* Animated underline for "Connect" */}
                       <motion.div 
                         initial={{ scaleX: 0 }}
                         animate={{ scaleX: 1 }}
                         transition={{ delay: 1, duration: 1.5, ease: "circOut" }}
                         className="absolute -bottom-2 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-hub-purple to-transparent rounded-full opacity-50" 
                       />
                    </motion.span>
                 </h1>
                 
                 <div className="mt-12 flex flex-col items-center">
                    <p className="text-hero-sub text-lg md:text-xl leading-relaxed max-w-2xl mx-auto opacity-70 font-medium px-4 tracking-tight">
                       Nơi mọi kết nối đều tạo nên giá trị. <br className="hidden md:block" />
                       Hệ thống không gian sự kiện linh hoạt cho cộng đồng sáng tạo & nghệ thuật.
                    </p>
                    
                    <button 
                      onClick={() => navigate("/booking")}
                      className="mt-[35px] px-[32px] py-[22px] rounded-full liquid-glass font-bold text-sm uppercase tracking-[0.2em] hover:scale-105 transition-all group"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        Đặt chỗ ngay <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </button>
                 </div>
              </motion.div>
           </div>
        </div>

        {/* Bottom Logo Marquee */}
        <LogoMarquee />
      </section>

      {/* Rest of Content - Kept original styles but with new background */}
      <div className="bg-background">
        {/* Highlights */}
        <section className="py-32 relative overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12">
              {[
                { icon: <Zap className="w-8 h-8" />, title: "Workshop Container", desc: "Vật liệu tái chế, đèn Neon & vibe Startup rực rỡ." },
                { icon: <Users className="w-8 h-8" />, title: "Mạng lưới Kết nối", desc: "Hàng ngàn sinh viên & Mentor hội tụ mỗi ngày." },
                { icon: <Sparkles className="w-8 h-8" />, title: "AI Inspiration", desc: "Công cụ gợi ý ý tưởng sự kiện độc bá từ Hub-AI." },
              ].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="p-10 rounded-[3rem] liquid-glass group hover:bg-white/5 transition-all"
                >
                  <div className="w-16 h-16 rounded-2xl bg-hub-purple/10 flex items-center justify-center mb-8 text-hub-purple group-hover:bg-hub-purple group-hover:text-white transition-all">
                    {h.icon}
                  </div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4">{h.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{h.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Section */}
        <section className="py-24 bg-white/[0.02]">
           <div className="container mx-auto px-6 text-center">
              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-8">Nơi Ý Tưởng Trở Thành Hiện Thực</h2>
              <div className="max-w-4xl mx-auto space-y-8">
                 <p className="text-gray-400 text-lg leading-relaxed">
                    The Hub không chỉ là một địa điểm. Nó là một thực thể sống, nơi mỗi pallet gỗ, mỗi vách ngăn sắt đều mang trong mình hơi thở của sự sáng tạo. 
                    Chúng tôi kiến tạo không gian để bạn kiến tạo tương lai.
                 </p>
                 <div className="flex justify-center gap-6">
                    <button onClick={() => navigate("/events")} className="px-10 py-4 bg-hub-blue text-white rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform">Đấu trường Sự kiện</button>
                    <button onClick={() => navigate("/about")} className="px-10 py-4 liquid-glass rounded-full font-black uppercase tracking-widest text-xs">Về chúng tôi</button>
                 </div>
              </div>
           </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-32 relative">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-4">Bảng Giá Dịch Vụ</h2>
              <p className="text-gray-400 max-w-xl mx-auto font-medium">Lựa chọn gói giải pháp tối ưu cho sự kiện của bạn tại The Hub.</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { 
                  name: "Trải nghiệm giáo dục", 
                  price: "2.000.000", 
                  unit: "buổi", 
                  desc: "Cho workshop, talkshow giáo dục",
                  features: ["Âm thanh, máy chiếu", "Teabreak nhẹ", "Sắp xếp 20-40 người"],
                  color: "border-blue-500/20 shadow-blue-500/5"
                },
                { 
                  name: "Sự kiện Ra mắt", 
                  price: "1.500.000", 
                  unit: "giờ", 
                  desc: "Setup & vận hành Launch sản phẩm",
                  features: ["Hệ thống đèn Spotlight", "Wifi 6 High Speed", "Khu vực check-in"],
                  color: "border-purple-500/20 shadow-purple-500/5",
                  premium: true
                },
                { 
                  name: "Sự kiện Sinh nhật", 
                  price: "1.000.000", 
                  unit: "tiệc", 
                  desc: "Gói cơ bản cho tiệc cá nhân",
                  features: ["Dụng cụ tổ chức", "Hệ thống loa Bluetooth", "Trang trí chủ đề"],
                  color: "border-pink-500/20 shadow-pink-500/5"
                },
                { 
                  name: "Hoạt động chuyên sâu", 
                  price: "10.000.000", 
                  unit: "trọn gói", 
                  desc: "Premium Custom Event cao cấp",
                  features: ["Concept sáng tạo riêng", "Run-of-show chi tiết", "Full-service Team"],
                  color: "border-amber-500/20 shadow-amber-500/5"
                }
              ].map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-10 rounded-[2.5rem] liquid-glass border transition-all hover:scale-[1.02] flex flex-col ${p.color}`}
                >
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-2">{p.name}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-black">{p.price}</span>
                    <span className="text-gray-500 text-xs font-bold font-mono">đ/{p.unit}</span>
                  </div>
                  <p className="text-gray-400 text-xs mb-8 font-medium leading-relaxed">{p.desc}</p>
                  
                  <ul className="space-y-4 mb-10 flex-1">
                    {p.features.map((f, fi) => (
                      <li key={fi} className="flex items-center gap-3 text-xs font-medium text-gray-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button 
                    onClick={() => navigate("/booking")}
                    className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                      p.premium ? 'bg-hub-purple text-white shadow-lg shadow-hub-purple/20' : 'bg-white/5 text-white hover:bg-white/10'
                    }`}
                  >
                    Đăng ký ngay
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Booking Assistant Promo */}
        <section className="pb-32 relative">
          <div className="container mx-auto px-6">
            <div className="liquid-glass rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden group border border-white/5">
              <div className="absolute inset-0 bg-gradient-to-r from-hub-purple/10 to-hub-blue/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="w-20 h-20 rounded-3xl bg-hub-purple/20 flex items-center justify-center mx-auto mb-10 text-hub-purple animate-bounce">
                <Sparkles className="w-10 h-10" />
              </div>
              
              <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-6">Bạn chưa biết chọn gói nào?</h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed mb-12 font-medium">
                Hãy để <span className="text-white font-bold">Hub-AI</span> phân tích quy mô, mục tiêu và ngân sách của bạn để đưa ra gợi ý không gian & dịch vụ tối ưu nhất.
              </p>
              
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('open-hub-ai'))}
                className="px-12 py-6 rounded-full bg-white text-hub-black font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform flex items-center gap-3 mx-auto"
              >
                Nhận gợi ý từ Hub-AI <Zap className="w-4 h-4 fill-hub-black" />
              </button>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
