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

  const featuredEvent = events.find(e => e.isHot) || events[0];

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
        <div className="flex justify-center gap-2 mb-16 glass w-fit mx-auto p-1.5 rounded-full border-white/5">
          <button 
            onClick={() => setActiveTab("events")}
            className={`px-8 py-3 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all ${activeTab === "events" ? "bg-hub-purple text-white shadow-lg" : "text-gray-500 hover:text-white"}`}
          >
            Đấu trường Sự kiện
          </button>
          <button 
            onClick={() => setActiveTab("blog")}
            className={`px-8 py-3 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all ${activeTab === "blog" ? "bg-hub-purple text-white shadow-lg" : "text-gray-500 hover:text-white"}`}
          >
            Tạp chí Hub-Story
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "events" && (
            <motion.div 
              key="events"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="space-y-20"
            >
              {/* Featured Showcase */}
              {featuredEvent && (
                <section className="relative glass rounded-[4rem] overflow-hidden border-white/10 group min-h-[600px] flex items-center p-12">
                   <div className="absolute inset-0">
                      <img src={featuredEvent.img} className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-gradient-to-r from-hub-black via-hub-black/60 to-transparent" />
                   </div>
                   
                   <div className="relative z-10 max-w-2xl space-y-8">
                      <div className="flex items-center gap-4">
                         <span className="px-4 py-1.5 bg-hub-magenta text-white text-[10px] font-black uppercase tracking-widest rounded-full animate-pulse">Sự kiện tiêu điểm</span>
                         <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Tiềm năng: {featuredEvent.interestedCount || 0} Interested</span>
                      </div>
                      
                      <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none">{featuredEvent.title}</h2>
                      <p className="text-gray-300 text-lg max-w-xl leading-relaxed italic border-l-4 border-hub-blue pl-6">{featuredEvent.description}</p>
                      
                      <div className="space-y-4">
                         <div className="text-[10px] font-black uppercase tracking-widest text-hub-blue">Trận đánh bắt đầu sau:</div>
                         <Countdown targetDate={featuredEvent.countdownDate || "2026-12-31"} />
                      </div>

                      <div className="flex gap-4 pt-8">
                         <button onClick={() => setSelectedEvent(featuredEvent)} className="px-10 py-5 bg-hub-blue text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-[0_0_30px_rgba(56,189,248,0.3)]">Ghi danh ngay ({featuredEvent.attendeeCount || 0})</button>
                         <button onClick={() => handleInteract(featuredEvent.id, 'interested')} className="px-10 py-5 glass rounded-2xl font-black uppercase tracking-widest text-xs border-white/20 hover:bg-white/10 transition-all">Quan tâm ({featuredEvent.interestedCount || 0})</button>
                      </div>
                   </div>

                   {/* Preview Window */}
                   <div className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 w-80 h-[450px] glass rounded-[2.5rem] border-white/20 overflow-hidden flex-col">
                      <div className="flex-1 bg-hub-black relative overflow-hidden group/vid">
                         <img src={featuredEvent.img} className="w-full h-full object-cover opacity-60" />
                         <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md group-hover/vid:scale-110 transition-transform">
                               <Play className="w-6 h-6 text-white fill-white" />
                            </div>
                         </div>
                         <div className="absolute bottom-4 left-4 right-4 text-center">
                            <span className="text-[8px] font-black uppercase tracking-widest text-white/60">Xem trước Highlights</span>
                         </div>
                      </div>
                      <div className="p-6 space-y-4">
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-hub-blue">Live Q&A Section</h4>
                         <div className="space-y-3">
                            <div className="glass p-3 rounded-xl border-white/5 text-[9px] text-gray-400">
                               “Diễn giả sẽ nói sâu về AI marketing không ạ?”
                            </div>
                            <div className="glass p-3 rounded-xl border-white/5 text-[9px] text-gray-400">
                               “Có giới hạn slot cho sinh viên năm 1 không?”
                            </div>
                         </div>
                         <button className="w-full py-3 glass rounded-xl border-white/5 text-[8px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all">Đặt câu hỏi</button>
                      </div>
                   </div>
                </section>
              )}

              {/* Grid Events */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.filter(e => !e.isHot).map((event, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -10 }}
                    className="glass rounded-[2.5rem] overflow-hidden border-white/5 group border hover:border-hub-blue/30 transition-all"
                  >
                    <div className="aspect-video overflow-hidden relative">
                      <img src={event.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                      <div className="absolute top-4 right-4 px-4 py-2 glass rounded-xl text-[10px] font-black text-hub-blue border-hub-blue/30 uppercase tracking-widest">{event.price}</div>
                    </div>
                    <div className="p-8">
                      <div className="flex items-center gap-4 text-[9px] font-black text-gray-500 uppercase tracking-widest mb-4">
                        <span className="flex items-center gap-1 text-hub-purple"><Calendar className="w-3 h-3" /> {event.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {event.time}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-4 group-hover:text-hub-blue transition-colors leading-tight italic uppercase tracking-tight">{event.title}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed mb-8 line-clamp-2">{event.description}</p>
                      <div className="flex items-center justify-between mb-8">
                         <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            <MapPin className="w-4 h-4 text-hub-purple" /> {event.location}
                         </div>
                         <div className="flex -space-x-2">
                            {[1,2,3].map(j => <img key={j} src={`https://ui-avatars.com/api/?name=User${j}&background=random`} className="w-6 h-6 rounded-full border-2 border-hub-black" />)}
                         </div>
                      </div>
                      <button onClick={() => setSelectedEvent(event)} className="w-full py-4 glass rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-hub-blue transition-all border-white/10 group-hover:border-hub-blue/30">
                        Đặt chỗ - Nhận 20 Hub-Coin
                      </button>
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
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                 {blogPosts.slice(1).map((post, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ y: -5 }}
                      className="flex flex-col group cursor-pointer"
                    >
                       <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden glass p-2 border-white/5 mb-6">
                          <img src={post.thumbnail} className="w-full h-full object-cover rounded-[2rem] group-hover:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" />
                       </div>
                       <div className="space-y-4 px-2">
                          <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                             <span className="text-hub-purple">{post.category}</span>
                             <span className="text-gray-600">5 Phút đọc</span>
                          </div>
                          <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none group-hover:text-hub-blue transition-colors line-clamp-2">{post.title}</h3>
                          <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                             <User className="w-3 h-3 text-gray-600" />
                             <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{post.authorName}</span>
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
