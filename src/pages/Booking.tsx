import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Zap, Users, Calendar, ArrowRight, ChevronRight, CheckCircle2, CreditCard, QrCode, Wallet, Layout, Palette, MessageSquare } from "lucide-react";
import PageLayout from "../components/PageLayout";

const Booking = () => {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    people: "10-20",
    layout: "Chữ U",
    vibe: "Neon Purple",
    decor: "Hiện đại",
  });

  const steps = [
    { id: 1, title: "Chọn lịch", icon: <Calendar /> },
    { id: 2, title: "Cấu hình", icon: <Layout /> },
    { id: 3, title: "Tùy chọn Decor", icon: <Palette /> },
    { id: 4, title: "Thanh toán", icon: <CreditCard /> },
  ];

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <PageLayout>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-6 text-gradient-cosmic uppercase tracking-tighter">Hệ thống đặt chỗ</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            4 bước đơn giản để sở hữu không gian sự kiện chuyên nghiệp và ấn tượng nhất.
          </p>
        </div>

        {/* Stepper */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="flex justify-between items-center relative">
            <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 -translate-y-1/2 z-0" />
            <div 
              className="absolute top-1/2 left-0 h-px bg-hub-purple -translate-y-1/2 z-0 transition-all duration-500" 
              style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            />
            {steps.map((s) => (
              <div key={s.id} className="relative z-10 flex flex-col items-center gap-4">
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${step >= s.id ? "bg-hub-purple text-white shadow-lg shadow-hub-purple/40" : "glass text-gray-500"}`}
                >
                  {step > s.id ? <CheckCircle2 className="w-6 h-6" /> : s.icon}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= s.id ? "text-white" : "text-gray-500"}`}>{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto glass p-10 md:p-16 rounded-[3rem] border-white/10 relative overflow-hidden mb-12">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-2">Chọn ngày & giờ</h2>
                  <p className="text-gray-400 text-sm">Xanh là trống, đỏ là đã kín.</p>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {[...Array(31)].map((_, i) => (
                    <button 
                      key={i}
                      className={`aspect-square rounded-xl flex items-center justify-center text-xs font-bold transition-all ${i % 7 === 0 || i % 5 === 0 ? "bg-red-500/20 text-red-500 cursor-not-allowed" : "glass hover:bg-hub-blue hover:text-white"}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-4 mt-8">
                  {["08:00", "10:00", "13:00", "15:00", "18:00", "20:00"].map((t) => (
                    <button key={t} className="py-3 glass rounded-xl text-xs font-bold hover:border-hub-blue transition-all">{t}</button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-2">Cấu hình sự kiện</h2>
                  <p className="text-gray-400 text-sm">Chọn số lượng người và kiểu sắp xếp bàn ghế.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Số lượng người</label>
                    <select className="w-full px-6 py-4 rounded-2xl glass border-white/5 focus:border-hub-blue outline-none transition-all appearance-none">
                      <option>Dưới 10 người</option>
                      <option>10 - 20 người</option>
                      <option>20 - 50 người</option>
                      <option>Trên 50 người</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Kiểu sắp xếp</label>
                    <select className="w-full px-6 py-4 rounded-2xl glass border-white/5 focus:border-hub-blue outline-none transition-all appearance-none">
                      <option>Chữ U</option>
                      <option>Rạp hát</option>
                      <option>Tiệc đứng</option>
                      <option>Lớp học</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-2">Tùy chọn Decor</h2>
                  <p className="text-gray-400 text-sm">Chọn "Vibe" màu sắc đèn LED và phong cách trang trí.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Màu sắc đèn LED (Vibe)</label>
                    <div className="grid grid-cols-4 gap-4">
                      {["#7c3aed", "#38bdf8", "#db2777", "#fbbf24"].map((c) => (
                        <button key={c} className="w-full aspect-square rounded-full border-2 border-white/10 hover:border-white transition-all" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Phong cách trang trí</label>
                    <select className="w-full px-6 py-4 rounded-2xl glass border-white/5 focus:border-hub-blue outline-none transition-all appearance-none">
                      <option>Hiện đại (Modern)</option>
                      <option>Tối giản (Minimalist)</option>
                      <option>Ấm cúng (Cozy)</option>
                      <option>Nghệ thuật (Artistic)</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-2">Xác nhận & Thanh toán</h2>
                  <p className="text-gray-400 text-sm">Kiểm tra lại thông tin và chọn phương thức thanh toán.</p>
                </div>
                <div className="glass p-8 rounded-3xl border-white/5 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Dịch vụ:</span>
                    <span className="font-bold">The Creative Hall</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Thời gian:</span>
                    <span className="font-bold">15/04/2026 | 13:00 - 17:00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Cấu hình:</span>
                    <span className="font-bold">40 người | Rạp hát</span>
                  </div>
                  <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                    <span className="text-xl font-bold">Tổng tiền:</span>
                    <span className="text-2xl font-black text-hub-blue">2,500,000đ</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <button className="py-4 glass rounded-2xl flex flex-col items-center gap-2 hover:bg-white/10 transition-all">
                    <CreditCard className="w-6 h-6 text-hub-purple" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Thẻ ATM</span>
                  </button>
                  <button className="py-4 glass rounded-2xl flex flex-col items-center gap-2 hover:bg-white/10 transition-all">
                    <QrCode className="w-6 h-6 text-hub-blue" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Momo/ZaloPay</span>
                  </button>
                  <button className="py-4 glass rounded-2xl flex flex-col items-center gap-2 hover:bg-white/10 transition-all">
                    <Wallet className="w-6 h-6 text-hub-magenta" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Hub-Coin</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 flex justify-between items-center">
            {step > 1 && (
              <button 
                onClick={prevStep}
                className="px-8 py-3 glass rounded-full font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                Quay lại
              </button>
            )}
            <div className="flex-1" />
            <button 
              onClick={step === 4 ? () => alert("Đặt chỗ thành công!") : nextStep}
              className="px-10 py-4 bg-gradient-to-r from-hub-purple to-hub-blue rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2"
            >
              {step === 4 ? "Xác nhận thanh toán" : "Tiếp theo"} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Booking;
