import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Zap, Users, MessageSquare, Heart, Share2, Search, MapPin, Globe, Star, User, ChevronRight, Send, Filter } from "lucide-react";
import PageLayout from "../components/PageLayout";

const Community = () => {
  const [activeTab, setActiveTab] = useState("feed");

  const feedPosts = [
    { 
      user: "Minh Quân", 
      role: "Designer", 
      content: "Mình đang tìm một bạn quay phim cho dự án MV ca nhạc sắp tới tại The Hub. Ai có hứng thú inbox mình nhé!", 
      time: "2 giờ trước", 
      likes: 24, 
      comments: 8,
      avatar: "https://ui-avatars.com/api/?name=Minh+Quan&background=7c3aed&color=fff"
    },
    { 
      user: "Thùy Linh", 
      role: "Coder", 
      content: "Sắp tới mình có buổi workshop về React Native tại The Creative Hall. Bạn nào quan tâm có thể đăng ký tham gia cùng mình nha.", 
      time: "5 giờ trước", 
      likes: 42, 
      comments: 15,
      avatar: "https://ui-avatars.com/api/?name=Thuy+Linh&background=38bdf8&color=fff"
    },
    { 
      user: "Hoàng Nam", 
      role: "Singer", 
      content: "Cần tìm một bạn đệm đàn guitar cho buổi tập tối nay tại The Nest. Ưu tiên các bạn sinh viên nha.", 
      time: "1 ngày trước", 
      likes: 18, 
      comments: 4,
      avatar: "https://ui-avatars.com/api/?name=Hoang+Nam&background=db2777&color=fff"
    },
  ];

  const members = [
    { name: "Anh Tuấn", skill: "Event Planner", rating: 4.9, projects: 12, avatar: "https://ui-avatars.com/api/?name=Anh+Tuan&background=7c3aed&color=fff" },
    { name: "Bảo Ngọc", skill: "Graphic Designer", rating: 4.8, projects: 8, avatar: "https://ui-avatars.com/api/?name=Bao+Ngoc&background=38bdf8&color=fff" },
    { name: "Đức Anh", skill: "Video Editor", rating: 4.7, projects: 15, avatar: "https://ui-avatars.com/api/?name=Duc+Anh&background=db2777&color=fff" },
    { name: "Phương Thảo", skill: "Content Creator", rating: 4.9, projects: 20, avatar: "https://ui-avatars.com/api/?name=Phuong+Thao&background=fbbf24&color=fff" },
  ];

  return (
    <PageLayout>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-6 text-gradient-cosmic uppercase tracking-tighter">Hub Connect</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Nơi kết nối những tâm hồn sáng tạo, tìm kiếm đối tác và cùng nhau tạo nên những dự án đột phá.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-12">
          <button 
            onClick={() => setActiveTab("feed")}
            className={`px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${activeTab === "feed" ? "bg-hub-purple shadow-lg shadow-hub-purple/30" : "glass hover:bg-white/10"}`}
          >
            Bảng tin Hub-Feed
          </button>
          <button 
            onClick={() => setActiveTab("members")}
            className={`px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${activeTab === "members" ? "bg-hub-purple shadow-lg shadow-hub-purple/30" : "glass hover:bg-white/10"}`}
          >
            Khám phá thành viên
          </button>
          <button 
            onClick={() => setActiveTab("map")}
            className={`px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${activeTab === "map" ? "bg-hub-purple shadow-lg shadow-hub-purple/30" : "glass hover:bg-white/10"}`}
          >
            Live Matching Map
          </button>
        </div>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === "feed" && (
              <motion.div 
                key="feed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Post Box */}
                <div className="glass p-8 rounded-[2.5rem] border-white/10 mb-12">
                  <div className="flex gap-4 mb-6">
                    <img src="https://ui-avatars.com/api/?name=User&background=7c3aed&color=fff" className="w-12 h-12 rounded-2xl" />
                    <textarea 
                      placeholder="Bạn đang tìm kiếm điều gì? Chia sẻ ngay với cộng đồng Hubers..." 
                      className="w-full bg-transparent border-none outline-none text-lg resize-none pt-2"
                      rows={2}
                    ></textarea>
                  </div>
                  <div className="flex justify-between items-center pt-6 border-t border-white/5">
                    <div className="flex gap-4">
                      <button className="text-gray-500 hover:text-hub-blue transition-colors"><Globe className="w-5 h-5" /></button>
                      <button className="text-gray-500 hover:text-hub-blue transition-colors"><MapPin className="w-5 h-5" /></button>
                      <button className="text-gray-500 hover:text-hub-blue transition-colors"><Users className="w-5 h-5" /></button>
                    </div>
                    <button className="px-8 py-2.5 bg-hub-blue rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all">Đăng tin</button>
                  </div>
                </div>

                {/* Feed Posts */}
                {feedPosts.map((post, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass p-8 rounded-[2.5rem] border-white/5 hover:border-white/10 transition-all"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-4">
                        <img src={post.avatar} className="w-12 h-12 rounded-2xl" />
                        <div>
                          <h4 className="font-bold text-white uppercase tracking-wider">{post.user}</h4>
                          <span className="text-[10px] font-bold text-hub-blue uppercase tracking-widest">{post.role}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{post.time}</span>
                    </div>
                    <p className="text-gray-300 text-lg leading-relaxed mb-8">{post.content}</p>
                    <div className="flex justify-between items-center pt-6 border-t border-white/5">
                      <div className="flex gap-8">
                        <button className="flex items-center gap-2 text-gray-500 hover:text-hub-magenta transition-colors group">
                          <Heart className="w-5 h-5 group-hover:fill-hub-magenta transition-all" /> <span className="text-xs font-bold">{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-500 hover:text-hub-blue transition-colors">
                          <MessageSquare className="w-5 h-5" /> <span className="text-xs font-bold">{post.comments}</span>
                        </button>
                      </div>
                      <button className="text-gray-500 hover:text-white transition-colors"><Share2 className="w-5 h-5" /></button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === "members" && (
              <motion.div 
                key="members"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex gap-4 mb-12">
                  <div className="relative flex-1">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input type="text" placeholder="Tìm kiếm theo tên, kỹ năng hoặc dự án..." className="w-full pl-16 pr-6 py-4 rounded-2xl glass border-white/5 focus:border-hub-blue outline-none transition-all" />
                  </div>
                  <button className="px-6 py-4 glass rounded-2xl hover:bg-white/10 transition-all"><Filter className="w-5 h-5" /></button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {members.map((member, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ y: -5 }}
                      className="glass p-8 rounded-[2.5rem] border-white/5 flex items-center gap-6 group"
                    >
                      <img src={member.avatar} className="w-20 h-20 rounded-3xl group-hover:rotate-6 transition-transform" />
                      <div className="flex-1">
                        <h4 className="text-xl font-bold mb-1">{member.name}</h4>
                        <p className="text-xs text-hub-blue font-bold uppercase tracking-widest mb-4">{member.skill}</p>
                        <div className="flex gap-6">
                          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            <Star className="w-3 h-3 text-hub-gold fill-hub-gold" /> {member.rating}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            <Zap className="w-3 h-3 text-hub-purple" /> {member.projects} dự án
                          </div>
                        </div>
                      </div>
                      <button className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-hub-purple transition-colors"><ChevronRight className="w-5 h-5" /></button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "map" && (
              <motion.div 
                key="map"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative aspect-video glass rounded-[3rem] border-white/10 overflow-hidden"
              >
                {/* Placeholder Map */}
                <div className="absolute inset-0 bg-hub-black/50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-hub-purple/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                      <MapPin className="w-10 h-10 text-hub-purple" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 uppercase tracking-widest">Live Matching Map</h3>
                    <p className="text-gray-500 text-sm">Đang quét các nhóm hoạt động tại The Hub...</p>
                  </div>
                </div>

                {/* Map Pins (Visual only) */}
                <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-hub-blue rounded-full shadow-[0_0_20px_rgba(56,189,248,0.8)] animate-bounce" />
                <div className="absolute top-1/2 left-2/3 w-4 h-4 bg-hub-purple rounded-full shadow-[0_0_20px_rgba(124,58,237,0.8)] animate-bounce delay-300" />
                <div className="absolute top-2/3 left-1/4 w-4 h-4 bg-hub-magenta rounded-full shadow-[0_0_20px_rgba(219,39,119,0.8)] animate-bounce delay-700" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageLayout>
  );
};

export default Community;
