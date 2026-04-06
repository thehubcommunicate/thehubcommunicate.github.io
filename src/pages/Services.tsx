import React from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Zap, Users, Lightbulb, Mic2, ArrowRight, ChevronRight, Globe, Layout, Cpu, Eye, Camera, Music, Coffee, Monitor, CheckCircle2 } from "lucide-react";
import PageLayout from "../components/PageLayout";

const Services = () => {
  const navigate = useNavigate();

  const areas = [
    { 
      id: "the-nest", 
      title: "The Nest", 
      desc: "Học nhóm / Họp nhỏ", 
      capacity: "5-10 người", 
      price: "150k/giờ", 
      features: ["Wi-Fi 6", "Bảng trắng", "Tivi 55 inch", "Trà đá miễn phí"],
      img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"
    },
    { 
      id: "the-creative-hall", 
      title: "The Creative Hall", 
      desc: "Workshop / Training", 
      capacity: "20-40 người", 
      price: "500k/giờ", 
      features: ["Máy chiếu 4K", "Âm thanh vòm", "Bàn ghế linh hoạt", "Hỗ trợ kỹ thuật"],
      img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200"
    },
    { 
      id: "the-grand-hub", 
      title: "The Grand Hub", 
      desc: "Sự kiện lớn", 
      capacity: "50-100 người", 
      price: "1.2tr/giờ", 
      features: ["Màn hình LED lớn", "Ánh sáng sân khấu", "Khu vực Teabreak", "Hệ thống Livestream"],
      img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1200"
    },
  ];

  const packages = [
    { title: "Gói Sinh nhật", price: "Từ 2.5tr", features: ["Trang trí theo chủ đề", "Hệ thống âm thanh", "Góc check-in", "Dọn dẹp sau tiệc"], color: "hub-purple" },
    { title: "Gói Ra mắt sản phẩm", price: "Từ 5tr", features: ["Màn hình LED lớn", "Hỗ trợ check-in khách", "MC chuyên nghiệp", "Khu vực Teabreak"], color: "hub-blue" },
    { title: "Gói Live Music", price: "Từ 4tr", features: ["Hệ thống âm thanh chuẩn", "Ánh sáng nghệ thuật", "Hỗ trợ thu âm", "Quầy bar phục vụ"], color: "hub-magenta" },
  ];

  const equipment = [
    { icon: <Camera />, name: "Máy quay 4K", price: "500k/buổi" },
    { icon: <Mic2 />, name: "Micro không dây", price: "100k/cái" },
    { icon: <Coffee />, name: "Phục vụ Teabreak", price: "50k/người" },
    { icon: <Monitor />, name: "Màn hình phụ", price: "200k/cái" },
  ];

  return (
    <PageLayout>
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-black mb-6 text-gradient-cosmic uppercase tracking-tighter">Không gian & Dịch vụ</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Hệ thống không gian đa năng, trang thiết bị hiện đại giúp sự kiện của bạn diễn ra suôn sẻ và ấn tượng nhất.
          </p>
        </div>

        {/* Areas */}
        <div className="space-y-24 mb-32">
          {areas.map((area, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`flex flex-col lg:flex-row gap-16 items-center ${i % 2 !== 0 ? "lg:flex-row-reverse" : ""}`}
            >
              <div className="lg:w-1/2 relative group">
                <div className="aspect-video rounded-[3rem] overflow-hidden glass p-2 border-white/10">
                  <img src={area.img} className="w-full h-full object-cover rounded-[2.5rem] group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                </div>
                <div className="absolute -bottom-6 -right-6 glass px-8 py-4 rounded-2xl border-white/10 shadow-2xl">
                  <span className="text-hub-blue font-black text-2xl">{area.price}</span>
                </div>
              </div>
              <div className="lg:w-1/2 space-y-8">
                <div>
                  <span className="text-hub-purple font-bold tracking-widest uppercase text-xs mb-4 block">{area.desc}</span>
                  <h2 className="text-4xl md:text-5xl font-bold mb-6">{area.title}</h2>
                  <p className="text-gray-400 text-lg leading-relaxed mb-8">
                    Không gian được thiết kế tối ưu cho {area.desc.toLowerCase()}, với sức chứa {area.capacity}. 
                    Đầy đủ tiện nghi và hỗ trợ kỹ thuật xuyên suốt.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {area.features.map((f, j) => (
                      <div key={j} className="flex items-center gap-3 text-sm text-gray-300">
                        <CheckCircle2 className="w-5 h-5 text-hub-blue" /> {f}
                      </div>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => navigate("/booking")}
                  className="px-10 py-4 bg-white text-hub-black rounded-full font-bold hover:bg-hub-blue hover:text-white transition-all uppercase text-xs tracking-widest"
                >
                  Đặt phòng ngay
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Packages */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 uppercase tracking-tight">Gói Dịch Vụ Đặc Biệt</h2>
            <p className="text-gray-400">Giải pháp trọn gói cho những sự kiện quan trọng của bạn.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((p, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="glass p-10 rounded-[3rem] border-white/5 relative overflow-hidden group"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-${p.color}/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-${p.color}/20 transition-colors`} />
                <h4 className="text-2xl font-bold mb-6">{p.title}</h4>
                <div className="text-3xl font-black text-hub-blue mb-8">{p.price}</div>
                <ul className="space-y-4 mb-10">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-gray-400">
                      <CheckCircle2 className="w-4 h-4 text-hub-purple" /> {f}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => navigate("/booking")}
                  className="w-full py-4 glass rounded-full font-bold hover:bg-white/10 transition-all uppercase text-[10px] tracking-widest"
                >
                  Nhận báo giá combo
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Equipment */}
        <section className="py-24 glass rounded-[4rem] border-white/5 px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 uppercase tracking-tight">Thiết Bị Thuê Thêm</h2>
            <p className="text-gray-400">Hỗ trợ tối đa cho các hoạt động sáng tạo và ghi hình.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {equipment.map((e, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mx-auto mb-6 text-hub-blue group-hover:bg-hub-blue group-hover:text-white transition-all">
                  {e.icon}
                </div>
                <h4 className="font-bold mb-2 uppercase text-xs tracking-widest">{e.name}</h4>
                <p className="text-hub-purple font-bold text-sm">{e.price}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Services;
