import React from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Zap, Users, Lightbulb, Mic2, ArrowRight, ChevronRight, Globe, Layout, Cpu, Eye } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home = () => {
  const navigate = useNavigate();

  const highlights = [
    { icon: <Layout className="w-8 h-8" />, title: "Không gian thông minh", desc: "Hệ thống quản lý phòng tự động, tối ưu hóa ánh sáng và nhiệt độ." },
    { icon: <Cpu className="w-8 h-8" />, title: "Công nghệ AI Matching", desc: "Kết nối các thành viên có cùng sở thích và kỹ năng chuyên môn." },
    { icon: <Eye className="w-8 h-8" />, title: "Trải nghiệm AR", desc: "Xem trước layout sự kiện qua công nghệ thực tế tăng cường." },
  ];

  const events = [
    { title: "Workshop Sáng Tạo Gen Z", category: "Workshop", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200" },
    { title: "Startup Networking Night", category: "Networking", img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200" },
    { title: "Ra mắt sản phẩm Công nghệ", category: "Product Launch", img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1200" },
  ];

  return (
    <div className="min-h-screen bg-hub-black text-white selection:bg-hub-purple selection:text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background Placeholder */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-hub-black/60 z-10" />
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover opacity-60"
            poster="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1920"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-people-attending-a-conference-in-a-large-hall-4841-large.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="container mx-auto px-6 relative z-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1 rounded-full glass text-[10px] font-bold tracking-[0.3em] uppercase mb-6 text-hub-blue border-hub-blue/30 select-none">
              Flexible Event Space System
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight leading-[1.1] uppercase select-none">
              The Hub – Nơi mọi kết nối <br />
              <span className="text-gradient-cosmic">đều tạo nên giá trị</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10 font-light leading-relaxed select-none">
              Hệ thống không gian sự kiện đa năng dành cho Workshop, Networking, Training và Talkshow. 
              Kết nối cộng đồng sáng tạo âm nhạc & điện ảnh.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => navigate("/booking")}
                className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-hub-purple to-hub-blue rounded-full font-bold text-lg hover:scale-105 transition-transform glow-purple shadow-2xl shadow-hub-purple/40"
              >
                Đặt chỗ nhanh
              </button>
              <button 
                onClick={() => navigate("/space")}
                className="w-full sm:w-auto px-10 py-4 glass rounded-full font-bold text-lg hover:bg-white/10 transition-all border-white/20 flex items-center justify-center"
              >
                Khám phá không gian
              </button>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 z-20">
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-px h-12 bg-gradient-to-b from-white to-transparent"
          />
        </div>
      </section>

      {/* Quick About */}
      <section className="py-24 relative overflow-hidden bg-white/2">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-hub-purple font-bold tracking-widest uppercase text-xs mb-4 block">Về chúng tôi</span>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                Kết nối âm nhạc & điện ảnh <br />
                <span className="text-gradient-cosmic">trong không gian hiện đại</span>
              </h2>
              <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                The Hub không chỉ là nơi cho thuê không gian, mà là một hệ sinh thái kết nối những tâm hồn sáng tạo. 
                Chúng tôi tập trung vào việc tạo ra những điểm chạm giá trị giữa các nghệ sĩ, nhà làm phim và cộng đồng yêu nghệ thuật.
              </p>
              <button 
                onClick={() => navigate("/about")}
                className="px-8 py-3 glass rounded-full font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                Tìm hiểu thêm
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {highlights.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="glass p-10 rounded-[3rem] border-white/5 hover:border-hub-purple/50 transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-hub-purple/10 flex items-center justify-center mb-8 text-hub-purple group-hover:bg-hub-purple group-hover:text-white transition-all">
                  {h.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{h.title}</h3>
                <p className="text-gray-500 leading-relaxed">{h.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Slider (Simplified) */}
      <section className="py-24 bg-white/2 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-bold mb-4">Sự Kiện Tiêu Biểu</h2>
              <p className="text-gray-400">Những khoảnh khắc ấn tượng tại The Hub.</p>
            </div>
            <button 
              onClick={() => navigate("/events")}
              className="text-hub-blue font-bold flex items-center gap-2 hover:translate-x-2 transition-transform uppercase text-xs tracking-widest"
            >
              Xem tất cả <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-8 overflow-x-auto pb-12 no-scrollbar">
            {events.map((e, i) => (
              <motion.div 
                key={i}
                className="min-w-[300px] md:min-w-[400px] aspect-[4/5] rounded-[2.5rem] overflow-hidden relative group cursor-pointer"
                onClick={() => navigate("/events")}
              >
                <img src={e.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-hub-black to-transparent flex flex-col justify-end p-8">
                  <span className="text-[10px] font-bold text-hub-blue uppercase tracking-widest mb-2">{e.category}</span>
                  <h4 className="text-2xl font-bold mb-2">{e.title}</h4>
                  <div className="flex items-center gap-2 text-hub-purple font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Xem chi tiết <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
