import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Zap, Users, Calendar, ArrowRight, ChevronRight, CheckCircle2, BookOpen, MessageSquare, Heart, Share2, Globe, MapPin, Send, Filter, Clock, Star, Play, Ticket } from "lucide-react";
import PageLayout from "../components/PageLayout";

const Events = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("events");

  const upcomingEvents = [
    { 
      title: "Talkshow: Tương lai Âm nhạc số", 
      date: "15/04/2026", 
      time: "18:00 - 20:00", 
      location: "The Grand Hub", 
      price: "200k", 
      img: "https://images.unsplash.com/photo-1514525253361-bee8718a747c?auto=format&fit=crop&q=80&w=1200",
      desc: "Buổi chia sẻ về xu hướng âm nhạc trong kỷ nguyên AI với các chuyên gia hàng đầu."
    },
    { 
      title: "Chiếu phim ngắn: Sài Gòn Đêm", 
      date: "18/04/2026", 
      time: "19:30 - 21:30", 
      location: "The Creative Hall", 
      price: "150k", 
      img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1200",
      desc: "Buổi công chiếu và giao lưu với đoàn làm phim về dự án phim ngắn độc lập."
    },
    { 
      title: "Workshop: Kỹ năng Networking", 
      date: "20/04/2026", 
      time: "14:00 - 17:00", 
      location: "The Nest", 
      price: "Miễn phí", 
      img: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=1200",
      desc: "Học cách kết nối và xây dựng mối quan hệ hiệu quả cho Startup & Freelancer."
    },
  ];

  const blogPosts = [
    { 
      title: "5 Tips tổ chức Workshop ấn tượng cho sinh viên", 
      category: "Kinh nghiệm", 
      date: "10/04/2026", 
      img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200",
      desc: "Làm thế nào để thu hút khách tham dự và tạo ra giá trị thực sự cho buổi workshop của bạn?"
    },
    { 
      title: "Khởi nghiệp sáng tạo: Bắt đầu từ đâu?", 
      category: "Startup", 
      date: "08/04/2026", 
      img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200",
      desc: "Những bước đi đầu tiên cho các bạn trẻ muốn dấn thân vào con đường khởi nghiệp sáng tạo."
    },
    { 
      title: "Tại sao không gian làm việc ảnh hưởng đến sáng tạo?", 
      category: "Cảm hứng", 
      date: "05/04/2026", 
      img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200",
      desc: "Khám phá mối liên hệ giữa môi trường xung quanh và khả năng tư duy đột phá của con người."
    },
  ];

  return (
    <PageLayout>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-6 text-gradient-cosmic uppercase tracking-tighter">Sự kiện & Blog</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Cập nhật những hoạt động mới nhất và những kiến thức bổ ích từ cộng đồng The Hub.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-16">
          <button 
            onClick={() => setActiveTab("events")}
            className={`px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${activeTab === "events" ? "bg-hub-purple shadow-lg shadow-hub-purple/30" : "glass hover:bg-white/10"}`}
          >
            Lịch sự kiện sắp tới
          </button>
          <button 
            onClick={() => setActiveTab("blog")}
            className={`px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${activeTab === "blog" ? "bg-hub-purple shadow-lg shadow-hub-purple/30" : "glass hover:bg-white/10"}`}
          >
            Blog Sáng tạo
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "events" && (
            <motion.div 
              key="events"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              {upcomingEvents.map((event, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -10 }}
                  className="glass rounded-[2.5rem] overflow-hidden border-white/5 group"
                >
                  <div className="aspect-video overflow-hidden relative">
                    <img src={event.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                    <div className="absolute top-4 right-4 px-4 py-2 glass rounded-xl text-xs font-bold text-hub-blue border-hub-blue/30">{event.price}</div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {event.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {event.time}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-4 group-hover:text-hub-blue transition-colors leading-tight">{event.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-8 line-clamp-2">{event.desc}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-8">
                      <MapPin className="w-4 h-4 text-hub-purple" /> {event.location}
                    </div>
                    <button className="w-full py-4 bg-gradient-to-r from-hub-purple to-hub-blue rounded-2xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all flex items-center justify-center gap-2">
                      <Ticket className="w-4 h-4" /> Mua vé / Đăng ký
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === "blog" && (
            <motion.div 
              key="blog"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              {blogPosts.map((post, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -10 }}
                  className="glass rounded-[2.5rem] overflow-hidden border-white/5 group"
                >
                  <div className="aspect-video overflow-hidden relative">
                    <img src={post.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                    <div className="absolute top-4 left-4 px-4 py-2 glass rounded-xl text-[10px] font-bold text-hub-purple border-hub-purple/30 uppercase tracking-widest">{post.category}</div>
                  </div>
                  <div className="p-8">
                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-3 block">{post.date}</span>
                    <h3 className="text-xl font-bold mb-4 group-hover:text-hub-blue transition-colors leading-tight">{post.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-8 line-clamp-3">{post.desc}</p>
                    <button className="flex items-center gap-2 text-hub-blue font-bold text-xs uppercase tracking-widest group">
                      Đọc tiếp <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
};

export default Events;
