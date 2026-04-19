import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Zap, Users, Calendar, ArrowRight, ChevronRight, CheckCircle2, CreditCard, QrCode, Wallet, Layout, Palette, MessageSquare, User, Settings, Bell, History, Star, Heart, Share2, Globe, MapPin, Send, Filter, LogOut, Loader2, Lock, ShoppingBag, ShoppingCart, Coffee } from "lucide-react";
import PageLayout from "../components/PageLayout";
import { useAuth } from "../components/AuthProvider";
import { logout, db } from "../lib/firebase";
import { askHubAI } from "../lib/gemini";
import { Sparkles, Bot, Clock, TrendingUp } from "lucide-react";
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc, increment } from "firebase/firestore";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { user, profile, loading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const navigate = useNavigate();

  const handleRedeem = async (reward: any) => {
    if (!user || !profile) return;
    if ((profile?.hubCoins || 0) < reward.cost) {
      alert("Bạn không đủ Hub-Coin để đổi phần thưởng này!");
      return;
    }

    setIsRedeeming(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        hubCoins: increment(-reward.cost)
      });
      setRedeemSuccess(reward.title);
      setTimeout(() => setRedeemSuccess(null), 3000);
    } catch (error) {
      console.error("Redemption failed", error);
      alert("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsRedeeming(false);
    }
  };

  const getAiInsight = async () => {
    if (!profile) return;
    setIsAiLoading(true);
    const content = `User profile: Interests: ${profile.interests || 'N/A'}, Skills: ${profile.skills || 'N/A'}. Create a short, visionary prediction (1 sentence) for this member at The Hub.`;
    try {
      const insight = await askHubAI(content);
      setAiInsight(insight);
    } catch (e) {
      setAiInsight("Hub-AI đang phân tích các khả năng tương lai của bạn...");
    }
    setIsAiLoading(false);
  };

  useEffect(() => {
    if (profile && !aiInsight && !isAiLoading) {
      getAiInsight();
    }
  }, [profile]);

  const rewards = [
    { title: "Cà phê Free", cost: 50, icon: <Coffee />, desc: "1 ly cafe bất kỳ tại quầy bar" },
    { title: "Vị trí VIP", cost: 200, icon: <Star />, desc: "Chỗ ngồi ưu tiên tại workshop kế tiếp" },
    { title: "Gói WiFi Pro", cost: 100, icon: <Zap />, desc: "Băng thông dành riêng cho streamer" },
    { title: "Voucher 50%", cost: 500, icon: <CreditCard />, desc: "Giảm giá đặt phòng The Nest" },
  ];

  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, 'serviceOrders'), 
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      return () => unsubscribe();
    }
  }, [user]);

  if (loading) {
    return (
      <PageLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="w-12 h-12 text-hub-purple animate-spin" />
        </div>
      </PageLayout>
    );
  }

  if (!user) {
    return (
      <PageLayout>
        <div className="flex h-[60vh] flex-col items-center justify-center text-center px-6">
          <div className="w-20 h-20 bg-hub-purple/20 rounded-full flex items-center justify-center mb-6">
            <Lock className="w-10 h-10 text-hub-purple" />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-widest mb-4">Bạn chưa đăng nhập</h2>
          <p className="text-gray-500 max-w-md mx-auto mb-8">Vui lòng đăng nhập để xem thông tin cá nhân và quản lý lịch sử đặt chỗ của bạn.</p>
          <button 
            onClick={() => window.scrollTo(0, 0)}
            className="px-10 py-4 bg-hub-purple rounded-full font-bold text-xs uppercase tracking-widest"
          >
            Quay lại trang chủ
          </button>
        </div>
      </PageLayout>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

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
                  <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=7c3aed&color=fff`} className="w-24 h-24 rounded-3xl object-cover" />
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-hub-blue rounded-full flex items-center justify-center border-4 border-hub-black hover:scale-110 transition-transform">
                    <Settings className="w-4 h-4 text-white" />
                  </button>
                </div>
                <h3 className="text-xl font-bold mb-1 uppercase tracking-widest">{user.displayName}</h3>
                <div className="flex flex-col items-center gap-2 mb-6">
                  <span className="text-[10px] px-3 py-1 bg-hub-purple/20 text-hub-purple rounded-full font-bold uppercase tracking-widest border border-hub-purple/30">
                    HUB-ID: #{user.uid.slice(0, 8).toUpperCase()}
                  </span>
                  <p className="text-[10px] text-hub-blue font-bold uppercase tracking-widest">{profile?.role || 'Huber'} / Creative Arena</p>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                  <div className="text-center">
                    <div className="text-lg font-black text-white">0</div>
                    <div className="text-[8px] text-gray-500 uppercase tracking-widest">Dự án</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-black text-hub-purple">5.0</div>
                    <div className="text-[8px] text-gray-500 uppercase tracking-widest">Đánh giá</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-black text-hub-blue">{profile?.hubCoins || 0}</div>
                    <div className="text-[8px] text-gray-500 uppercase tracking-widest">Hub-Coin</div>
                    <button 
                      onClick={() => setActiveTab("rewards")}
                      className="text-[7px] text-hub-purple font-bold uppercase tracking-widest block mt-1 hover:underline cursor-pointer"
                    >
                      Đổi thưởng
                    </button>
                  </div>
                </div>
              </div>

              <div className="glass p-4 rounded-[2rem] border-white/5 space-y-2">
                {[
                  { id: "profile", icon: <User />, label: "Hồ sơ đấu sĩ" },
                  { id: "orders", icon: <ShoppingBag />, label: "Vật phẩm đã mua" },
                  { id: "rewards", icon: <Star />, label: "Kho phần thưởng" },
                  { id: "history", icon: <History />, label: "Nhật ký truyền kỳ" },
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
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all font-bold text-xs uppercase tracking-widest mt-4"
                  >
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
                  {/* Hub-AI Insights */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass p-8 rounded-[3rem] border-hub-blue/20 bg-hub-blue/5 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-hub-blue opacity-5 blur-3xl -mr-10 -mt-10" />
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-hub-blue/20 flex items-center justify-center text-hub-blue shadow-lg shadow-hub-blue/20">
                          <Bot className="w-7 h-7" />
                        </div>
                        <div>
                          <h3 className="text-xs font-black uppercase tracking-widest text-white leading-none">Hub-AI Insights</h3>
                          <span className="text-[9px] font-bold text-hub-blue uppercase tracking-widest mt-1 block">Dự đoán tương lai của bạn</span>
                        </div>
                      </div>
                      <button 
                        onClick={getAiInsight}
                        className="w-10 h-10 rounded-xl glass border-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-all hover:bg-white/5"
                      >
                        <History className="w-5 h-5 transition-transform hover:rotate-180" />
                      </button>
                    </div>
                    
                    <div className="min-h-[60px] flex items-center">
                      {isAiLoading ? (
                        <div className="flex gap-2">
                          <div className="w-2 h-2 rounded-full bg-hub-blue animate-bounce" />
                          <div className="w-2 h-2 rounded-full bg-hub-blue animate-bounce [animation-delay:-0.15s]" />
                          <div className="w-2 h-2 rounded-full bg-hub-blue animate-bounce [animation-delay:-0.3s]" />
                        </div>
                      ) : (
                        <p className="text-lg italic font-medium text-hub-blue leading-relaxed">
                          "{aiInsight || 'Đang phân tích tiềm năng của bạn tại The Hub...'}"
                        </p>
                      )}
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-6">
                       <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Tier: Elite Creator</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-hub-purple" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Tiếp theo: Workshop AR</span>
                       </div>
                    </div>
                  </motion.div>

                  <div className="glass p-10 rounded-[3rem] border-white/10">
                    <h2 className="text-3xl font-bold mb-8 uppercase tracking-tighter">Thông tin cá nhân</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-4">Họ và tên</label>
                        <input type="text" value={user.displayName || ""} disabled className="w-full px-6 py-4 rounded-2xl glass border-white/5 focus:border-hub-blue outline-none transition-all opacity-60" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-4">Email</label>
                        <input type="email" value={user.email || ""} disabled className="w-full px-6 py-4 rounded-2xl glass border-white/5 focus:border-hub-blue outline-none transition-all opacity-60" />
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

              {activeTab === "rewards" && (
                <motion.div 
                  key="rewards"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-end mb-8">
                    <div>
                      <h2 className="text-4xl font-black uppercase tracking-tighter text-gradient-cosmic">Chợ Đổi Thưởng</h2>
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Dùng Hub-Coin để đổi lấy đặc quyền</p>
                    </div>
                    <div className="glass px-6 py-3 rounded-2xl border-hub-purple/20 flex items-center gap-3">
                      <Wallet className="w-5 h-5 text-hub-purple" />
                      <span className="text-xl font-black">{profile?.hubCoins || 0} HH</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 relative">
                    {redeemSuccess && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute inset-x-0 -top-12 flex justify-center z-50 pointer-events-none"
                      >
                        <div className="bg-green-500 text-white px-6 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-lg">
                          Chúc mừng! Bạn đã đổi thành công: {redeemSuccess}
                        </div>
                      </motion.div>
                    )}
                    {rewards.map((reward, i) => (
                      <div key={i} className="glass p-6 rounded-[2rem] border-white/5 hover:border-hub-purple/30 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-12 h-12 rounded-2xl bg-hub-purple/10 flex items-center justify-center text-hub-purple group-hover:scale-110 transition-transform">
                            {reward.icon}
                          </div>
                          <span className="text-lg font-black text-hub-blue">{reward.cost} HH</span>
                        </div>
                        <h4 className="font-bold text-white uppercase tracking-wider mb-2">{reward.title}</h4>
                        <p className="text-xs text-gray-500 mb-6">{reward.desc}</p>
                        <button 
                          disabled={isRedeeming || (profile?.hubCoins || 0) < reward.cost}
                          onClick={() => handleRedeem(reward)}
                          className="w-full py-3 glass rounded-xl font-bold uppercase tracking-widest text-[9px] hover:bg-hub-purple transition-all disabled:opacity-50 disabled:hover:bg-transparent"
                        >
                          {isRedeeming ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Sở hữu ngay"}
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
              {activeTab === "orders" && (
                <motion.div 
                  key="orders"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-3xl font-bold mb-8 uppercase tracking-tighter">Đơn dịch vụ của tôi</h2>
                  {orders.length === 0 ? (
                    <div className="glass p-12 rounded-[2.5rem] border-white/5 text-center">
                      <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">Bạn chưa có đơn đặt hàng nào.</p>
                      <button 
                        onClick={() => navigate("/space")}
                        className="mt-6 text-hub-blue font-bold uppercase tracking-widest text-[10px] hover:underline"
                      >
                        Khám phá dịch vụ ngay
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="glass p-8 rounded-[2rem] border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-hub-blue/10 rounded-2xl flex items-center justify-center text-hub-blue">
                              <ShoppingCart className="w-6 h-6" />
                            </div>
                            <div>
                               <h4 className="font-bold text-white uppercase tracking-wider">{order.serviceName}</h4>
                               <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                                 Mã đơn: {order.id.slice(0, 8).toUpperCase()} | {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Đang xử lý'}
                               </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-black text-white">{order.price.toLocaleString()}đ</div>
                            <div className="flex items-center justify-end gap-2">
                               <div className={`w-2 h-2 rounded-full ${order.status === 'pending' ? 'bg-hub-gold' : 'bg-green-500'}`} />
                               <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">{order.status === 'pending' ? 'Chờ xác nhận' : 'Đã xác nhận'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
