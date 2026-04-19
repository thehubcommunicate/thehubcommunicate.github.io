import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Zap, Users, Calendar, ArrowRight, ChevronRight, CheckCircle2, BookOpen, MessageSquare, Heart, Share2, Globe, MapPin, Send, Filter, Clock, Star, Play, Ticket, Info, Trophy, User, Plus, Loader2, QrCode } from "lucide-react";
import PageLayout from "../components/PageLayout";
import { useAuth } from "../components/AuthProvider";
import { subscribeToEvents, subscribeToBlogPosts, interactWithEvent, createBlogPost } from "../lib/firebase";

const Countdown = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft(null);
        return;
      }

      setTimeLeft({
        d: Math.floor(distance / (1000 * 60 * 60 * 24)),
        h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return null;

  return (
    <div className="flex gap-4">
      {[
        { val: timeLeft.d, label: "Ngày" },
        { val: timeLeft.h, label: "Giờ" },
        { val: timeLeft.m, label: "Phút" },
        { val: timeLeft.s, label: "Giây" },
      ].map((t, i) => (
        <div key={i} className="text-center">
          <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-xl font-black text-hub-blue border-hub-blue/30 shadow-[0_0_20px_rgba(56,189,248,0.2)]">
            {t.val}
          </div>
          <div className="text-[8px] font-black uppercase tracking-widest text-gray-500 mt-2">{t.label}</div>
        </div>
      ))}
    </div>
  );
};

const Events = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("events");
  const [events, setEvents] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [showUgcModal, setShowUgcModal] = useState(false);
  const [ugcLoading, setUgcLoading] = useState(false);
  const [ugcData, setUgcData] = useState({ title: "", category: "Kinh nghiệm", content: "", thumbnail: "" });
  const [eventFilter, setEventFilter] = useState("Tất cả");

  const categories = ["Tất cả", "Trải nghiệm giáo dục", "Ra mắt sản phẩm", "Hoạt động cộng đồng & Khác"];

  // Mock data for initial view/fallback
  const fallbackEvents = [
    {
      id: "edu-1",
      title: "Workshop: Giải mã Siêu âm Thai kỳ & Chăm sóc sức khỏe Mẹ bầu",
      description: "Học hỏi kiến thức y khoa chuyên sâu từ các bác sĩ đầu ngành. Hiểu rõ về quá trình phát triển của thai nhi.",
      category: "Trải nghiệm giáo dục",
      date: "20/04/2026",
      time: "09:00 - 12:00",
      location: "Phòng Seminar - The Hub",
      img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200",
      price: "Miễn phí",
      isHot: true,
      countdownDate: "2026-04-20T09:00:00",
      speaker: "BS. Nguyễn Văn A - BV Từ Dũ",
      highlights: "Kiến thức thực tế, hỏi đáp trực tiếp"
    },
    {
      id: "launch-1",
      title: "Fashion Show mini: Ra mắt BST SÓC Kids House Hè 2026",
      description: "Chiêm ngưỡng những thiết kế mới nhất dành cho bé trong không gian nghệ thuật được setup lộng lẫy.",
      category: "Ra mắt sản phẩm",
      date: "25/04/2026",
      time: "18:00 - 21:00",
      location: "Sảnh Trung tâm - The Hub",
      img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200",
      price: "Vé mời",
      highlights: "Check-in sang trọng, hệ thống ánh sáng đỉnh cao"
    },
    {
      id: "net-1",
      title: "Networking Night: Kết nối các chuyên gia Y tế & Sức khỏe",
      description: "Giao lưu, chia sẻ kinh nghiệm và tìm kiếm cơ hội hợp tác trong lĩnh vực y tế. Tiệc trà nhẹ miễn phí.",
      category: "Hoạt động cộng đồng & Khác",
      date: "28/04/2026",
      time: "19:00 - 22:00",
      location: "Canteen & Terrace - The Hub",
      img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1200",
      price: "50 HH",
      highlights: "Không gian mở, Networking tự do"
    },
    {
       id: "edu-2",
       title: "Chuỗi Talkshow Dinh dưỡng chuẩn Y khoa cho trẻ sơ sinh",
       description: "Cung cấp lộ trình dinh dưỡng khoa học giúp trẻ phát triển toàn diện trong 1000 ngày đầu đời.",
       category: "Trải nghiệm giáo dục",
       date: "05/05/2026",
       time: "14:00 - 16:30",
       location: "Container VIP - The Hub",
       img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200",
       price: "100 HH",
       speaker: "Chuyên gia Dinh dưỡng Phan B",
       highlights: "Thực đơn dinh dưỡng mẫu"
    }
  ];

  const displayEvents = events.length > 0 ? events : fallbackEvents;
  const filteredEvents = displayEvents.filter(e => {
    if (eventFilter === "Tất cả") return true;
    return e.category === eventFilter;
  });

  const featuredEvent = filteredEvents.find(e => e.isHot) || filteredEvents[0];
  const gridEvents = filteredEvents.filter(e => e.id !== featuredEvent?.id);

  useEffect(() => {
    const unsubEvents = subscribeToEvents(setEvents);
    const unsubBlogs = subscribeToBlogPosts(setBlogPosts);
    return () => {
      unsubEvents();
      unsubBlogs();
    };
  }, []);

  const handleInteract = async (eventId: string, type: 'interested' | 'join') => {
    if (!user) return alert("Vui lòng đăng nhập!");
    await interactWithEvent(eventId, user.uid, type);
  };

  const handlePostUgc = async () => {
    if (!user) return;
    if (!ugcData.title || !ugcData.content) return alert("Vui lòng điền đủ thông tin!");
    setUgcLoading(true);
    try {
      await createBlogPost(user.uid, user.displayName || "Anonymous", {
        ...ugcData,
        thumbnail: ugcData.thumbnail || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200"
      });
      setShowUgcModal(false);
      setUgcData({ title: "", category: "Kinh nghiệm", content: "", thumbnail: "" });
    } catch (e) {
      console.error(e);
    } finally {
      setUgcLoading(false);
    }
  };

  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleJoinConfirmed = async () => {
     if (!user) return;
     setIsProcessing(true);
     try {
        await interactWithEvent(selectedEvent.id, user.uid, 'join');
        // Logic for electronic invoice and Hub-Pass is simulated by showing the success state
        setShowSuccess(true);
        setTimeout(() => {
           setShowSuccess(false);
           setSelectedEvent(null);
           setActiveTab("events");
        }, 5000);
     } catch (e) {
        console.error(e);
     } finally {
        setIsProcessing(false);
     }
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-hub-purple/10 blur-[100px] rounded-full pointer-events-none" 
          />
          <h1 className="text-5xl md:text-8xl font-black mb-6 text-gradient-cosmic uppercase tracking-tighter italic">Showroom & Story</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed uppercase tracking-widest text-[10px] font-bold">
            “Kinh nghiệm là bản đồ, cộng đồng là đôi cánh. Tại The Hub, chúng tớ không chỉ làm sự kiện, chúng tớ kiến tạo những huyền thoại mới.”
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-8 glass w-fit mx-auto p-1.5 rounded-full border-white/5">
          <button 
            onClick={() => setActiveTab("events")}
            className={`px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === "events" ? "bg-hub-purple text-white shadow-lg shadow-hub-purple/30" : "text-gray-500 hover:text-white"}`}
          >
            ĐẤU TRƯỜNG SỰ KIỆN
          </button>
          <button 
            onClick={() => setActiveTab("blog")}
            className={`px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === "blog" ? "bg-hub-purple text-white shadow-lg shadow-hub-purple/30" : "text-gray-500 hover:text-white"}`}
          >
            TẠP CHÍ HUB-STORY
          </button>
        </div>

        {/* Category Filters */}
        <AnimatePresence>
          {activeTab === "events" && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex justify-center flex-wrap gap-3 mb-16"
            >
               {categories.map((cat) => (
                 <button
                   key={cat}
                   onClick={() => setEventFilter(cat)}
                   className={`px-6 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all border ${
                     eventFilter === cat 
                     ? "bg-hub-blue/20 border-hub-blue text-hub-blue shadow-[0_0_20px_rgba(56,189,248,0.2)]" 
                     : "border-white/5 text-gray-500 hover:text-white hover:border-white/10 glass"
                   }`}
                 >
                   {cat}
                 </button>
               ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {activeTab === "events" && (
            <motion.div 
              key="events"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="space-y-24"
            >
              {/* Featured Showcase - Bigger & Bolder */}
              {featuredEvent && (
                <section className="relative glass rounded-[4rem] overflow-hidden border-white/10 group min-h-[500px] flex items-center p-6 md:p-16">
                   <div className="absolute inset-0">
                      <img src={featuredEvent.img} className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-1000" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-gradient-to-r from-hub-black via-hub-black/80 to-transparent" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(168,85,247,0.15),transparent_50%)]" />
                   </div>
                   
                   <div className="relative z-10 max-w-3xl space-y-10">
                      <div className="flex flex-wrap items-center gap-4">
                         <span className="px-5 py-2 bg-hub-magenta text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-full shadow-[0_0_20px_rgba(217,70,239,0.4)] animate-pulse">Sự kiện tiêu điểm</span>
                         <div className="flex items-center gap-2 px-4 py-2 glass rounded-full border-white/10">
                            <Users className="w-4 h-4 text-hub-blue" />
                            <span className="text-gray-300 font-black uppercase tracking-widest text-[9px]">{featuredEvent.interestedCount || 0} Đã quan tâm</span>
                         </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic leading-[0.9] text-white">
                          {featuredEvent.title}
                        </h2>
                        <div className="flex flex-wrap gap-8 text-xs font-black uppercase tracking-[0.2em] text-hub-blue/80">
                           <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {featuredEvent.date}</span>
                           <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {featuredEvent.location}</span>
                        </div>
                      </div>

                      <p className="text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed font-medium italic border-l-4 border-hub-purple pl-8 py-2">
                        {featuredEvent.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-6 pt-4">
                         <button 
                            onClick={() => setSelectedEvent(featuredEvent)} 
                            className="px-12 py-6 bg-hub-purple text-white rounded-[2rem] font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-[0_0_40px_rgba(168,85,247,0.4)] active:scale-95"
                         >
                            Đăng ký ngay
                         </button>
                         <div className="flex items-center gap-4">
                            <div className="text-right">
                               <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Bắt đầu sau</div>
                               <div className="text-sm font-black text-white uppercase tracking-widest">
                                  {featuredEvent.countdownDate ? "Sắp khai mạc" : "Đang chờ"}
                               </div>
                            </div>
                            <Countdown targetDate={featuredEvent.countdownDate || "2026-12-31"} />
                         </div>
                      </div>
                   </div>

                   {/* Decorative Floating Element */}
                   <div className="hidden xl:block absolute right-20 bottom-20 w-64 h-64 glass rounded-full border-white/5 opacity-20 animate-spin-slow pointer-events-none" />
                </section>
              )}

              {/* Grid Events - Grid 3 cols desktop, 1 mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {gridEvents.map((event, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -12 }}
                    className="flex flex-col glass rounded-[3rem] overflow-hidden border-white/5 group border hover:border-hub-purple/40 transition-all bg-white/2"
                  >
                    {/* Image & Badge */}
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img 
                        src={event.img} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                        referrerPolicy="no-referrer" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-hub-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      {/* Badge/Tag */}
                      <div className="absolute top-6 left-6 flex flex-col gap-2">
                        <span className="px-4 py-2 glass backdrop-blur-md rounded-full text-[9px] font-black text-white border-white/20 uppercase tracking-[0.2em] shadow-lg">
                          {event.category || "Workshop"}
                        </span>
                        <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg ${
                           event.id.startsWith('edu') ? 'bg-hub-purple shadow-hub-purple/30' : 
                           event.id.startsWith('launch') ? 'bg-hub-magenta shadow-hub-magenta/30' :
                           'bg-hub-blue shadow-hub-blue/30'
                        }`}>
                          Sắp diễn ra
                        </span>
                      </div>
                      
                      <div className="absolute bottom-6 right-6 px-4 py-2 glass backdrop-blur-md rounded-xl text-[10px] font-black text-hub-blue border-hub-blue/30 uppercase tracking-widest">
                        {event.price}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-10 flex-1 flex flex-col">
                      <h3 className="text-2xl font-black mb-4 group-hover:text-hub-purple transition-colors leading-tight italic uppercase tracking-tighter">
                        {event.title}
                      </h3>
                      
                      {/* Time & Location with Icons */}
                      <div className="flex flex-col gap-3 mb-6">
                        <div className="flex items-center gap-3 text-xs font-black text-gray-400 uppercase tracking-widest">
                          <Clock className="w-4 h-4 text-hub-purple" />
                          <span>{event.date} • {event.time}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-black text-gray-400 uppercase tracking-widest">
                          <MapPin className="w-4 h-4 text-hub-blue" />
                          <span className="truncate">{event.location}</span>
                        </div>
                        {event.speaker && (
                           <div className="flex items-center gap-3 text-xs font-black text-hub-magenta uppercase tracking-widest mt-1">
                              <User className="w-4 h-4" />
                              <span className="truncate">{event.speaker}</span>
                           </div>
                        )}
                      </div>

                      {/* Teaser text (Teaser) */}
                      <div className="space-y-4 mb-8">
                         <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 italic font-medium">
                            {event.description}
                         </p>
                         {event.highlights && (
                            <div className="flex items-start gap-2 p-3 rounded-xl bg-white/5 border border-white/5">
                               <Star className="w-3 h-3 text-hub-gold shrink-0 mt-0.5" />
                               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{event.highlights}</span>
                            </div>
                         )}
                      </div>

                      <div className="mt-auto space-y-4">
                        <div className="flex items-center justify-between pb-4 border-b border-white/5">
                           <div className="flex -space-x-3">
                              {[1,2,3,4].map(j => (
                                <img key={j} src={`https://ui-avatars.com/api/?name=U${j}&background=random`} className="w-8 h-8 rounded-full border-2 border-hub-black shadow-lg" />
                              ))}
                              <div className="w-8 h-8 rounded-full bg-hub-purple/20 flex items-center justify-center text-[8px] font-black text-hub-purple border-2 border-hub-black">+12</div>
                           </div>
                           <span className="text-[9px] font-black uppercase tracking-widest text-gray-600">60/100 Seats</span>
                        </div>

                        {/* CTA Button */}
                        <button 
                          onClick={() => setSelectedEvent(event)} 
                          className="w-full py-5 bg-white/5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-hub-purple hover:text-white transition-all border border-white/10 group-hover:border-hub-purple/30 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] active:scale-95"
                        >
                          Đăng ký ngay - Nhận 20 HH
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "blog" && (
            <motion.div 
              key="blog"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="space-y-16"
            >
              {/* Blog Header & Filter */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                 <div className="text-left">
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-2">Editor's Choice</h2>
                    <p className="text-gray-500 text-xs font-bold tracking-widest uppercase">Thư viện sinh tồn cho giới Hub-Entrepreneur</p>
                 </div>
                 <div className="flex gap-4 items-center">
                    <button onClick={() => setShowUgcModal(true)} className="px-8 py-4 bg-hub-magenta text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg flex items-center gap-2">
                       <Plus className="w-4 h-4" /> Viết bài - Nhận 50 HH
                    </button>
                    <div className="flex gap-2 p-1 glass rounded-2xl border-white/5">
                        {["Kinh nghiệm", "Startup", "Cảm hứng"].map(c => (
                           <button key={c} className="px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">{c}</button>
                        ))}
                    </div>
                 </div>
              </div>

              {/* Featured Blog */}
              {blogPosts[0] && (
                 <div className="grid lg:grid-cols-2 gap-12 group">
                    <div className="aspect-[4/3] rounded-[3.5rem] overflow-hidden glass p-3 border-white/5 transform group-hover:rotate-1 transition-transform duration-700">
                       <img src={blogPosts[0].thumbnail} className="w-full h-full object-cover rounded-[3rem]" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex flex-col justify-center space-y-8">
                       <div className="flex items-center gap-3">
                          <span className="w-10 h-10 rounded-full bg-hub-purple/20 flex items-center justify-center text-hub-purple"><Trophy className="w-5 h-5" /></span>
                          <span className="text-xs font-black uppercase tracking-widest text-hub-purple">Bài viết tiêu biểu tháng 4</span>
                       </div>
                       <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic leading-tight group-hover:text-hub-blue transition-colors">
                          {blogPosts[0].title}
                       </h2>
                       <p className="text-gray-400 text-lg leading-relaxed line-clamp-4">
                          {blogPosts[0].content}
                       </p>
                       <div className="flex items-center gap-6">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-gray-800" />
                             <div className="text-left">
                                <div className="text-[10px] font-black text-white uppercase tracking-widest">{blogPosts[0].authorName}</div>
                                <div className="text-[8px] text-gray-500 font-bold uppercase">Mentor @ The Hub</div>
                             </div>
                          </div>
                          <span className="text-[10px] text-gray-600 font-black uppercase">{blogPosts[0].createdAt?.toDate ? blogPosts[0].createdAt.toDate().toLocaleDateString() : 'Vừa xong'}</span>
                       </div>
                       <button className="flex items-center gap-4 text-hub-blue font-black uppercase tracking-widest text-xs group/btn">
                          Khám phá tri thức <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-3 transition-transform" />
                       </button>

                       {/* Smart Suggestion UI */}
                       <div className="mt-8 p-6 glass rounded-2xl border-hub-blue/20 bg-hub-blue/5 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-hub-blue"><Zap className="w-5 h-5" /></div>
                             <div className="text-left">
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-white">Hub-Suggest: Smart Connection</h5>
                                <p className="text-[9px] text-gray-400 uppercase font-black">Workshop liên quan đến chủ đề này sắp diễn ra!</p>
                             </div>
                          </div>
                          <button onClick={() => setActiveTab("events")} className="px-4 py-2 bg-hub-blue text-white rounded-xl text-[8px] font-black uppercase tracking-widest">Đến sự kiện</button>
                       </div>
                    </div>
                 </div>
              )}

              {/* Magazine Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                 {blogPosts.slice(1).map((post, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -8 }}
                      className="flex flex-col group cursor-pointer glass rounded-[3rem] p-4 border-white/5 hover:border-hub-blue/30 transition-all"
                    >
                       <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden mb-6 relative">
                          <img 
                            src={post.thumbnail} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                            referrerPolicy="no-referrer" 
                          />
                          <div className="absolute top-4 left-4">
                            <span className="px-4 py-1.5 bg-hub-magenta/80 backdrop-blur-md text-[8px] font-black uppercase tracking-widest text-white rounded-full">{post.category}</span>
                          </div>
                       </div>
                       <div className="space-y-4 px-4 pb-4">
                          <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-gray-500">
                             <div className="flex items-center gap-2">
                                <Clock className="w-3 h-3" /> 5 Phút đọc
                             </div>
                             <span>{post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : 'Vừa xong'}</span>
                          </div>
                          <h3 className="text-xl font-black uppercase italic tracking-tighter leading-tight group-hover:text-hub-blue transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-[11px] text-gray-500 line-clamp-2 italic leading-relaxed">
                            {post.content}
                          </p>
                          <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                             <div className="w-6 h-6 rounded-full bg-hub-blue/20 flex items-center justify-center text-hub-blue">
                                <User className="w-3 h-3" />
                             </div>
                             <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{post.authorName}</span>
                          </div>
                       </div>
                    </motion.div>
                 ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* UGC Modal */}
      <AnimatePresence>
         {showUgcModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-hub-black/80 backdrop-blur-xl">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9, y: 20 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 className="w-full max-w-2xl glass p-10 rounded-[3rem] border-white/10 space-y-8"
               >
                  <div className="text-center">
                     <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Hub-Story Creator</h2>
                     <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Chia sẻ trải nghiệm - Nhận ngay 50 Hub-Coin</p>
                  </div>

                  <div className="space-y-6">
                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2 text-left">
                           <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-4">Tiêu đề bài viết</label>
                           <input 
                             type="text" 
                             value={ugcData.title}
                             onChange={e => setUgcData(prev => ({ ...prev, title: e.target.value }))}
                             placeholder="VD: Cách mình gọi vốn 1 tỷ..." 
                             className="w-full px-6 py-4 rounded-2xl glass border-white/10 outline-none focus:border-hub-blue transition-all" 
                           />
                        </div>
                        <div className="space-y-2 text-left">
                           <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-4">Chủ đề</label>
                           <select 
                             value={ugcData.category}
                             onChange={e => setUgcData(prev => ({ ...prev, category: e.target.value }))}
                             className="w-full px-6 py-4 rounded-2xl glass border-white/10 outline-none focus:border-hub-blue transition-all appearance-none"
                           >
                              <option className="bg-hub-black">Kinh nghiệm</option>
                              <option className="bg-hub-black">Startup</option>
                              <option className="bg-hub-black">Cảm hứng</option>
                           </select>
                        </div>
                     </div>

                     <div className="space-y-2 text-left">
                        <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-4">Thumbnail URL (Optional)</label>
                        <input 
                          type="text" 
                          value={ugcData.thumbnail}
                          onChange={e => setUgcData(prev => ({ ...prev, thumbnail: e.target.value }))}
                          placeholder="Link hình ảnh sắc nét..." 
                          className="w-full px-6 py-4 rounded-2xl glass border-white/10 outline-none focus:border-hub-blue transition-all" 
                        />
                     </div>

                     <div className="space-y-2 text-left">
                           <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-4">Nội dung câu chuyện</label>
                           <textarea 
                             rows={6} 
                             value={ugcData.content}
                             onChange={e => setUgcData(prev => ({ ...prev, content: e.target.value }))}
                             placeholder="Viết nên câu chuyện truyền kỳ của bạn..." 
                             className="w-full px-6 py-4 rounded-2xl glass border-white/10 outline-none focus:border-hub-blue transition-all resize-none"
                           ></textarea>
                        </div>
                  </div>

                  <div className="flex gap-4">
                     <button onClick={() => setShowUgcModal(false)} className="flex-1 py-4 glass rounded-2xl font-black uppercase tracking-widest text-[10px]">Hủy bỏ</button>
                     <button 
                       onClick={handlePostUgc}
                       disabled={ugcLoading}
                       className="flex-[2] py-4 bg-hub-magenta text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                     >
                        {ugcLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Phát hành & Nhận HH"}
                     </button>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

      {/* Ticket / Join Modal */}
      <AnimatePresence>
         {selectedEvent && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-hub-black/80 backdrop-blur-xl font-sans">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9, y: 30 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 className="w-full max-w-xl glass p-10 rounded-[3rem] border-white/10 relative overflow-hidden"
               >
                  {!showSuccess ? (
                     <div className="space-y-8">
                        <div className="text-center">
                           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-hub-blue mb-2 block">Xác nhận ghi danh</span>
                           <h3 className="text-3xl font-black uppercase italic tracking-tighter">{selectedEvent.title}</h3>
                        </div>

                        <div className="glass p-6 rounded-2xl border-white/5 space-y-4">
                           <div className="flex justify-between items-center text-xs uppercase font-black">
                              <span className="text-gray-500">Giá vé</span>
                              <span className="text-hub-magenta">{selectedEvent.price}</span>
                           </div>
                           <div className="flex justify-between items-center text-xs uppercase font-black">
                              <span className="text-gray-500">Phần thưởng</span>
                              <span className="text-hub-blue">+20 Hub-Coin</span>
                           </div>
                           <div className="pt-4 border-t border-white/5 text-[10px] text-gray-500 uppercase font-bold leading-relaxed">
                              Bằng việc nhấn xác nhận, bạn đồng ý với điều khoản tham gia sự kiện. Hub-Pass sẽ được gửi tức thì.
                           </div>
                        </div>

                        <div className="flex gap-4">
                           <button onClick={() => setSelectedEvent(null)} className="flex-1 py-4 glass rounded-2xl font-black uppercase tracking-widest text-[10px]">Hủy</button>
                           <button 
                             onClick={handleJoinConfirmed}
                             disabled={isProcessing}
                             className="flex-[2] py-4 bg-hub-blue text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                           >
                              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Xác nhận & Nhận Pass"}
                           </button>
                        </div>
                     </div>
                  ) : (
                     <div className="text-center space-y-8 py-6">
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(34,197,94,0.4)]">
                           <CheckCircle2 className="w-10 h-10 text-white" />
                        </div>
                        <div className="space-y-2">
                           <h3 className="text-3xl font-black uppercase italic tracking-tighter">Ghi danh thành công!</h3>
                           <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Hóa đơn điện tử & Hub-Pass đang được gửi tới bạn</p>
                        </div>
                        <div className="glass p-8 rounded-3xl border-hub-blue/30 bg-hub-blue/5">
                           <QrCode className="w-32 h-32 mx-auto text-white opacity-80 mb-4" />
                           <div className="text-[10px] text-hub-blue font-black uppercase tracking-widest">HUB-PASS: {Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest animate-pulse">Quay lại đấu trường sau giây lát...</p>
                     </div>
                  )}
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </PageLayout>
  );
};

export default Events;
