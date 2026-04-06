import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Zap, Users, Calendar, ArrowRight, ChevronRight, CheckCircle2, CreditCard, QrCode, Wallet, Layout, Palette, MessageSquare, User, Settings, Bell, History, Star, Heart, Share2, Globe, MapPin, Send, Filter, LogOut } from "lucide-react";
import PageLayout from "../components/PageLayout";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const activities = [
    { type: "Sự kiện", title: "Workshop Sáng Tạo Gen Z", date: "15/04/2026", status: "Sắp diễn ra", amount: "-500k" },
    { type: "Thanh toán", title: "Thuê phòng The Nest", date: "10/04/2026", status: "Hoàn tất", amount: "-300k" },
    { type: "Kết nối", title: "Tìm đối tác quay phim", date: "08/04/2026", status: "Thành công", amount: "+50 Hub-Coin" },
    { type: "Thanh toán", title: "Gói Ra mắt sản phẩm", date: "01/04/2026", status: "Hoàn tất", amount: "-5tr" },
  ];

  const notifications = [
    { title: "Lời mời kết nối mới", content: "Anh Tuấn muốn kết nối với bạn cho dự án MV ca nhạc.", time: "2 giờ trước", unread: true },
    { title: "Nhắc lịch sự kiện", content: "Workshop Sáng Tạo Gen Z sẽ diễn ra vào ngày mai.", time: "5 giờ trước", unread: true },
    { title: "Cập nhật Hub-Coin", content: "Bạn vừa nhận được 50 Hub-Coin từ hoạt động kết nối.", time: "1 ngày trước", unread: false },
  ];

  return (
    <PageLayout>
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-8">
              <div className="glass p-8 rounded-[2.5rem] border-white/10 text-center">
                <div className="relative inline-block mb-6">
                  <img src="https://ui-avatars.com/api/?name=User&background=7c3aed&color=fff" className="w-24 h-24 rounded-3xl" />
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-hub-blue rounded-full flex items-center justify-center border-4 border-hub-black hover:scale-110 transition-transform">
                    <Settings className="w-4 h-4 text-white" />
                  </button>
                </div>
                <h3 className="text-xl font-bold mb-1 uppercase tracking-widest">Minh Quân</h3>
                <p className="text-xs text-hub-blue font-bold uppercase tracking-widest mb-6">Designer / Hub-ID: 12345</p>
                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                  <div className="text-center">
                    <div className="text-lg font-black text-white">12</div>
                    <div className="text-[8px] text-gray-500 uppercase tracking-widest">Dự án</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-black text-hub-purple">4.9</div>
                    <div className="text-[8px] text-gray-500 uppercase tracking-widest">Đánh giá</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-black text-hub-blue">500</div>
                    <div className="text-[8px] text-gray-500 uppercase tracking-widest">Hub-Coin</div>
                  </div>
                </div>
              </div>

              <div className="glass p-4 rounded-[2rem] border-white/5 space-y-2">
                {[
                  { id: "profile", icon: <User />, label: "Thông tin cá nhân" },
                  { id: "history", icon: <History />, label: "Lịch sử hoạt động" },
                  { id: "wallet", icon: <Wallet />, label: "Ví Hub-Coin" },
                  { id: "notifications", icon: <Bell />, label: "Thông báo" },
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest ${activeTab === item.id ? "bg-hub-purple text-white shadow-lg shadow-hub-purple/30" : "text-gray-500 hover:bg-white/5"}`}
                  >
                    <span className="w-5 h-5">{item.icon}</span> {item.label}
                  </button>
                ))}
                <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all font-bold text-xs uppercase tracking-widest mt-4">
                  <LogOut className="w-5 h-5" /> Đăng xuất
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === "profile" && (
                <motion.div 
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="glass p-10 rounded-[3rem] border-white/10">
                    <h2 className="text-3xl font-bold mb-8 uppercase tracking-tighter">Thông tin cá nhân</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-4">Họ và tên</label>
                        <input type="text" defaultValue="Nguyễn Minh Quân" className="w-full px-6 py-4 rounded-2xl glass border-white/5 focus:border-hub-blue outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-4">Email</label>
                        <input type="email" defaultValue="quan.nm@gmail.com" className="w-full px-6 py-4 rounded-2xl glass border-white/5 focus:border-hub-blue outline-none transition-all" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-4">Tiểu sử ngắn</label>
                        <textarea rows={3} defaultValue="Designer đam mê âm nhạc và điện ảnh. Đang tìm kiếm những dự án sáng tạo đột phá tại The Hub." className="w-full px-6 py-4 rounded-2xl glass border-white/5 focus:border-hub-blue outline-none transition-all resize-none"></textarea>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-4">Kỹ năng chuyên môn</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {["UI/UX Design", "Graphic Design", "Motion Graphics", "Photography"].map((s) => (
                            <span key={s} className="px-4 py-2 glass rounded-full text-[10px] font-bold uppercase tracking-widest text-hub-blue border-hub-blue/30">{s}</span>
                          ))}
                          <button className="px-4 py-2 glass rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-500 border-white/10 hover:border-white transition-all">+ Thêm</button>
                        </div>
                      </div>
                    </div>
                    <button className="mt-12 px-10 py-4 bg-hub-purple rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-hub-purple/30">Lưu thay đổi</button>
                  </div>
                </motion.div>
              )}

              {activeTab === "history" && (
                <motion.div 
                  key="history"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-3xl font-bold mb-8 uppercase tracking-tighter">Lịch sử hoạt động</h2>
                  {activities.map((act, i) => (
                    <div key={i} className="glass p-8 rounded-[2.5rem] border-white/5 flex items-center justify-between group hover:border-white/10 transition-all">
                      <div className="flex items-center gap-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${act.type === "Sự kiện" ? "bg-hub-purple/10 text-hub-purple" : act.type === "Kết nối" ? "bg-hub-blue/10 text-hub-blue" : "bg-hub-magenta/10 text-hub-magenta"}`}>
                          {act.type === "Sự kiện" ? <Calendar className="w-6 h-6" /> : act.type === "Kết nối" ? <Users className="w-6 h-6" /> : <CreditCard className="w-6 h-6" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-white uppercase tracking-wider">{act.title}</h4>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest">{act.type} | {act.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-black ${act.amount.startsWith("+") ? "text-green-500" : "text-red-500"}`}>{act.amount}</div>
                        <div className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">{act.status}</div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === "wallet" && (
                <motion.div 
                  key="wallet"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="glass p-12 rounded-[3rem] border-white/10 bg-gradient-to-br from-hub-purple/20 to-hub-blue/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-12">
                        <div>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Số dư hiện tại</p>
                          <h2 className="text-5xl font-black text-white">500 <span className="text-2xl text-hub-blue">Hub-Coin</span></h2>
                        </div>
                        <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center">
                          <Wallet className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <button className="px-8 py-3 bg-white text-hub-black rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-hub-blue hover:text-white transition-all">Nạp thêm</button>
                        <button className="px-8 py-3 glass rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">Đổi quà</button>
                      </div>
                    </div>
                  </div>

                  <div className="glass p-10 rounded-[3rem] border-white/10">
                    <h3 className="text-xl font-bold mb-8 uppercase tracking-widest">Cách tích lũy Hub-Coin</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="glass p-6 rounded-2xl border-white/5">
                        <h4 className="font-bold text-sm mb-2 text-hub-blue">Kết nối thành công</h4>
                        <p className="text-xs text-gray-500">Nhận 50 Hub-Coin khi bạn kết nối thành công với một đối tác mới tại Hub Connect.</p>
                      </div>
                      <div className="glass p-6 rounded-2xl border-white/5">
                        <h4 className="font-bold text-sm mb-2 text-hub-purple">Tham gia sự kiện</h4>
                        <p className="text-xs text-gray-500">Nhận 20 Hub-Coin cho mỗi sự kiện bạn tham gia tại The Hub.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "notifications" && (
                <motion.div 
                  key="notifications"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold uppercase tracking-tighter">Thông báo</h2>
                    <button className="text-[10px] font-bold text-hub-blue uppercase tracking-widest hover:underline">Đánh dấu tất cả đã đọc</button>
                  </div>
                  {notifications.map((notif, i) => (
                    <div key={i} className={`glass p-8 rounded-[2.5rem] border-white/5 relative group hover:border-white/10 transition-all ${notif.unread ? "border-l-4 border-l-hub-blue" : ""}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-white uppercase tracking-wider">{notif.title}</h4>
                        <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{notif.time}</span>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">{notif.content}</p>
                      {notif.unread && <div className="absolute top-4 right-4 w-2 h-2 bg-hub-blue rounded-full" />}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
