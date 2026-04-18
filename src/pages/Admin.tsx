import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Zap, Users, Calendar, ArrowRight, ChevronRight, CheckCircle2, BookOpen, MessageSquare, Heart, Share2, Globe, MapPin, Send, Filter, Clock, Star, Play, Ticket, Layout, BarChart, PieChart, Activity, Settings, Search, User, Mail, Phone, Download, MoreVertical, Plus, FileText, Trash2, Database, Loader2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart as ReBarChart, Bar, Cell } from "recharts";
import PageLayout from "../components/PageLayout";
import { db } from "../lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from "firebase/firestore";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("analytics");
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeedData = async () => {
     setIsSeeding(true);
     try {
        // Seed Events
        const eventsRef = collection(db, "events");
        const events = [
           {
              title: "Talkshow: Tương lai Âm nhạc số",
              description: "Buổi chia sẻ về xu hướng âm nhạc trong kỷ nguyên AI với các chuyên gia hàng đầu. Khám phá cách AI thay đổi quá trình sáng tạo và phát hành âm nhạc.",
              date: "2026-04-25",
              time: "18:00 - 20:00",
              location: "The Grand Hub",
              price: "200.000đ",
              img: "https://images.unsplash.com/photo-1514525253361-bee8718a747c?auto=format&fit=crop&q=80&w=1200",
              videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
              countdownDate: "2026-04-25T18:00:00",
              interestedCount: 156,
              attendeeCount: 45,
              isHot: true,
              createdAt: serverTimestamp()
           },
           {
              title: "Workshop: Kỹ năng Networking cho Startup",
              description: "Học cách kết nối và xây dựng mối quan hệ hiệu quả cho Startup & Freelancer. Thực hành networking thực chiến ngay tại buổi talk.",
              date: "2026-05-01",
              time: "14:00 - 17:00",
              location: "The Nest",
              price: "Miễn phí",
              img: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=1200",
              interestedCount: 89,
              attendeeCount: 20,
              isHot: false,
              createdAt: serverTimestamp()
           }
        ];

        for (const e of events) {
           await addDoc(eventsRef, e);
        }

        // Seed Blogs
        const blogsRef = collection(db, "blogPosts");
        const blogs = [
           {
              title: "5 Tips tổ chức Workshop ấn tượng cho sinh viên",
              content: "Làm thế nào để thu hút khách tham dự và tạo ra giá trị thực sự cho buổi workshop của bạn? Đầu tiên, hãy xác định mục tiêu rõ ràng. Thứ hai, chọn không gian linh hoạt như The Hub. Thứ ba, tích hợp các hoạt động tương tác thay vì chỉ nghe thuyết trình...",
              category: "Kinh nghiệm",
              thumbnail: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200",
              authorId: "admin",
              authorName: "Hub Mentor",
              createdAt: serverTimestamp()
           },
           {
              title: "Làm sao để gọi vốn 1 tỷ đầu tiên?",
              content: "Khởi nghiệp không chỉ cần ý tưởng, mà cần sự chuẩn bị kỹ lưỡng về tài chính. Bài viết này chia sẻ kinh nghiệm thực tế từ các Founder đã thành công trong việc thuyết phục nhà đầu tư thiên thần...",
              category: "Startup",
              thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200",
              authorId: "admin",
              authorName: "CEO The Hub",
              createdAt: serverTimestamp()
           }
        ];

        for (const b of blogs) {
           await addDoc(blogsRef, b);
        }

        alert("Seed data successfully!");
     } catch (e) {
        console.error(e);
     } finally {
        setIsSeeding(false);
     }
  };

  const analyticsData = [
    { name: "Thứ 2", views: 400, bookings: 24 },
    { name: "Thứ 3", views: 300, bookings: 13 },
    { name: "Thứ 4", views: 200, bookings: 98 },
    { name: "Thứ 5", views: 278, bookings: 39 },
    { name: "Thứ 6", views: 189, bookings: 48 },
    { name: "Thứ 7", views: 239, bookings: 38 },
    { name: "Chủ nhật", views: 349, bookings: 43 },
  ];

  const guestList = [
    { name: "Nguyễn Văn A", email: "a.nv@gmail.com", phone: "0901234567", status: "Đã check-in", ticket: "VIP" },
    { name: "Trần Thị B", email: "b.tt@gmail.com", phone: "0901234568", status: "Chưa tới", ticket: "Standard" },
    { name: "Lê Văn C", email: "c.lv@gmail.com", phone: "0901234569", status: "Đã check-in", ticket: "Standard" },
    { name: "Phạm Thị D", email: "d.pt@gmail.com", phone: "0901234570", status: "Hủy vé", ticket: "VIP" },
  ];

  return (
    <PageLayout>
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <div>
            <h1 className="text-5xl font-black text-gradient-cosmic uppercase tracking-tighter italic">Admin HQ</h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Trung tâm điều phối tối cao The Hub.</p>
          </div>
          <div className="flex gap-2 p-1 glass rounded-2xl border-white/5">
             {["analytics", "content", "settings"].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === tab ? "bg-hub-purple text-white" : "text-gray-500 hover:text-white"}`}
                >
                   {tab}
                </button>
             ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "analytics" && (
            <motion.div 
               key="analytics"
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
            >
               <div className="grid lg:grid-cols-4 gap-8 mb-12">
                  {[
                    { label: "Tổng lượt xem", value: "12,450", change: "+12%", icon: <Globe className="text-hub-blue" /> },
                    { label: "Vé đã bán", value: "850", change: "+5%", icon: <Ticket className="text-hub-purple" /> },
                    { label: "Doanh thu", value: "125tr", change: "+8%", icon: <Zap className="text-hub-magenta" /> },
                    { label: "Tỉ lệ chuyển đổi", value: "6.8%", change: "+2%", icon: <Activity className="text-hub-gold" /> },
                  ].map((stat, i) => (
                    <div key={i} className="glass p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-white/10 transition-colors" />
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center">{stat.icon}</div>
                        <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">{stat.change}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">{stat.label}</p>
                      <h3 className="text-3xl font-black text-white">{stat.value}</h3>
                    </div>
                  ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 glass p-10 rounded-[3rem] border-white/10">
                    <div className="flex justify-between items-center mb-10">
                      <h3 className="text-xl font-bold uppercase tracking-widest text-hub-blue">Lưu lượng truy cập</h3>
                      <div className="flex gap-2">
                         <button onClick={handleSeedData} disabled={isSeeding} className="px-6 py-2 bg-hub-magenta rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all">
                            {isSeeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />} Seed Sample Data
                         </button>
                      </div>
                    </div>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analyticsData}>
                          <defs>
                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: "#020617", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1rem" }}
                            itemStyle={{ color: "#fff", fontSize: "12px" }}
                          />
                          <Area type="monotone" dataKey="views" stroke="#7c3aed" fillOpacity={1} fill="url(#colorViews)" strokeWidth={3} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="lg:col-span-1 glass p-10 rounded-[3rem] border-white/10">
                    <div className="flex justify-between items-center mb-10">
                      <h3 className="text-xl font-bold uppercase tracking-widest">Khách tham chiến</h3>
                    </div>
                    <div className="space-y-6">
                      {guestList.map((guest, i) => (
                        <div key={i} className="flex items-center justify-between group">
                          <div className="flex items-center gap-4">
                            <img src={`https://ui-avatars.com/api/?name=${guest.name}&background=random&color=fff`} className="w-10 h-10 rounded-xl" />
                            <div>
                              <h4 className="text-sm font-bold text-white leading-none mb-1">{guest.name}</h4>
                              <p className="text-[10px] text-gray-500 uppercase tracking-widest">{guest.ticket}</p>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${guest.status === "Đã check-in" ? "bg-green-500/20 text-green-500" : guest.status === "Hủy vé" ? "bg-red-500/20 text-red-500" : "bg-gray-500/20 text-gray-500"}`}>
                            {guest.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
            </motion.div>
          )}

          {activeTab === "content" && (
             <motion.div 
               key="content"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="grid md:grid-cols-2 gap-8"
             >
                <div className="glass p-10 rounded-[3rem] border-white/10 space-y-8">
                   <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-black uppercase italic tracking-tighter">Event Arena</h3>
                      <button className="p-4 bg-hub-blue rounded-2xl text-white hover:scale-110 transition-all"><Plus className="w-5 h-5" /></button>
                   </div>
                   <div className="space-y-4">
                      {[1, 2].map(i => (
                         <div key={i} className="glass p-4 rounded-2xl border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-gray-800 rounded-xl" />
                               <div>
                                  <div className="text-sm font-bold uppercase">Sự kiện #{i}</div>
                                  <div className="text-[8px] text-gray-500 uppercase font-black">25/04/2026 @ The Grand Hub</div>
                               </div>
                            </div>
                            <div className="flex gap-2">
                               <button className="p-2 glass rounded-lg text-gray-500 hover:text-white"><Settings className="w-4 h-4" /></button>
                               <button className="p-2 glass rounded-lg text-red-500/50 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>

                <div className="glass p-10 rounded-[3rem] border-white/10 space-y-8">
                   <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-black uppercase italic tracking-tighter">Hub-Story Magazine</h3>
                      <button className="p-4 bg-hub-purple rounded-2xl text-white hover:scale-110 transition-all"><Plus className="w-5 h-5" /></button>
                   </div>
                   <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                         <div key={i} className="glass p-4 rounded-2xl border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-gray-800 rounded-xl" />
                               <div>
                                  <div className="text-sm font-bold uppercase">Blog Post #{i}</div>
                                  <div className="text-[8px] text-gray-500 uppercase font-black">By Hub Mentor | Magazine</div>
                               </div>
                            </div>
                            <div className="flex gap-2">
                               <button className="p-2 glass rounded-lg text-gray-500 hover:text-white"><Settings className="w-4 h-4" /></button>
                               <button className="p-2 glass rounded-lg text-red-500/50 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
};

export default Admin;
