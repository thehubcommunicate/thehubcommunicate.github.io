import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Zap, Users, Calendar, ArrowRight, ChevronRight, CheckCircle2, BookOpen, MessageSquare, Heart, Share2, Globe, MapPin, Send, Filter, Clock, Star, Play, Ticket, Layout, BarChart, PieChart, Activity, Settings, Search, User, Mail, Phone, Download, MoreVertical } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart as ReBarChart, Bar, Cell } from "recharts";
import PageLayout from "../components/PageLayout";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("analytics");

  const data = [
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
        <div className="flex justify-between items-center mb-16">
          <div>
            <h1 className="text-5xl font-black text-gradient-cosmic uppercase tracking-tighter">Admin Dashboard</h1>
            <p className="text-gray-400">Quản lý sự kiện và phân tích dữ liệu khách hàng.</p>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-3 glass rounded-2xl flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
              <Download className="w-4 h-4" /> Xuất báo cáo
            </button>
            <button className="px-6 py-3 bg-hub-purple rounded-2xl flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-hub-purple/30">
              <Settings className="w-4 h-4" /> Cài đặt
            </button>
          </div>
        </div>

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
          {/* Analytics Chart */}
          <div className="lg:col-span-2 glass p-10 rounded-[3rem] border-white/10">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-bold uppercase tracking-widest">Phân tích lượt truy cập</h3>
              <div className="flex gap-2">
                <button className="px-4 py-2 glass rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-hub-purple transition-all">Tuần</button>
                <button className="px-4 py-2 glass rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-hub-purple transition-all">Tháng</button>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
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

          {/* Guest List */}
          <div className="lg:col-span-1 glass p-10 rounded-[3rem] border-white/10">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-bold uppercase tracking-widest">Danh sách khách mời</h3>
              <button className="text-[10px] font-bold text-hub-blue uppercase tracking-widest hover:underline">Xem tất cả</button>
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
            <button className="w-full mt-10 py-4 glass rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              <Users className="w-4 h-4" /> Quản lý danh sách
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Admin;
