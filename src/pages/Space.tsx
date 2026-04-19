import React from "react";
import { motion } from "motion/react";
import { Zap, Layout, Cpu, Eye, ArrowRight, ChevronRight, Container, Recycle, Layers, Lightbulb, Box, Maximize } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageLayout from "../components/PageLayout";

const Space = () => {
  const sections = [
    {
      id: "container",
      title: "Workshop Container & Tái chế sáng tạo",
      tag: "Vibe / Industrial",
      icon: <Container className="w-8 h-8" />,
      content: "Thay vì xây dựng kiên cố tốn kém, chúng tôi sử dụng các vật liệu thô nhưng được biến tấu đầy nghệ thuật.",
      details: [
        { title: "Bàn ghế Pallet & Thùng phi", desc: "Tận dụng các pallet gỗ hoặc thùng phi kim loại sơn màu Neon (xanh dương, hồng rực). Vừa rẻ, vừa tạo cảm giác 'bụi bặm', năng động đúng chất Startup." },
        { title: "Vách ngăn di động", desc: "Sử dụng các tấm lưới sắt hoặc kệ gỗ thưa để ngăn cách không gian. Sinh viên có thể dùng kẹp để treo ý tưởng, bản vẽ hoặc ảnh sự kiện lên đó." }
      ],
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1200",
      accent: "from-hub-blue to-cyan-400"
    },
    {
      id: "flexible",
      title: "Không gian Chuyển đổi đa năng",
      tag: "Layout / Dynamic",
      icon: <Maximize className="w-8 h-8" />,
      content: "Sinh viên cần sự linh hoạt, nên không gian sự kiện phải thay đổi được diện mạo trong 5 phút.",
      details: [
        { title: "Nội thất thông minh", desc: "Bàn có bánh xe và ghế xếp chồng. Khi không có sự kiện, đó là nơi ngồi học. Khi có Workshop, chỉ cần đẩy bàn vào sát tường là có ngay một sân khấu trống." },
        { title: "Sàn 'vô cực' Bê tông mài", desc: "Sàn bê tông mài bền, rẻ và cực kỳ sang trọng. Chúng tôi sơn lên sàn những câu Quote truyền cảm hứng bằng màu phản quang." }
      ],
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=1200",
      accent: "from-hub-purple to-hub-magenta"
    },
    {
      id: "lighting",
      title: "Điểm nhấn Low-cost High-tech",
      tag: "Tech / Atmosphere",
      icon: <Lightbulb className="w-8 h-8" />,
      content: "Vì chi phí thấp nên không thể trang trí quá nhiều đồ decor, chúng tôi dùng Ánh sáng để làm 'linh hồn'.",
      details: [
        { title: "Hệ thống Neon & Led dây", desc: "Đèn Led đổi màu để thay đổi 'mood' của phòng. Ánh sáng chính là thứ rẻ nhất giúp biến một căn phòng trống thành không gian nghệ thuật." },
        { title: "Góc AR Check-in", desc: "Chỉ cần một bức tường trắng. Khi sinh viên quét app, các hình ảnh 3D về dự án, về tương lai sẽ hiện lên trên điện thoại họ." }
      ],
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200",
      accent: "from-amber-400 to-orange-600"
    }
  ];

  return (
    <PageLayout>
      <div className="container mx-auto px-6 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mb-24"
        >
          <span className="text-hub-blue font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Triết lý thiết kế</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-8 italic">
            Không gian <span className="text-gradient-cosmic">Xưởng Đóng Tàu</span> Sáng Tạo
          </h1>
          <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl font-medium">
            Tại The Hub, chúng tôi không xây dựng những bức tường. Chúng tôi xây dựng những <span className="text-white">điểm chạm</span>. 
            Nơi rác thải trở thành nghệ thuật, và một căn phòng có thể biến thành bất cứ điều gì bạn khao khát.
          </p>
        </motion.div>

        <div className="space-y-32">
          {sections.map((section, idx) => (
            <motion.div 
              key={section.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`flex flex-col ${idx % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-16 items-center`}
            >
              <div className="flex-1 space-y-8">
                <div className="space-y-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${section.accent} flex items-center justify-center text-white shadow-xl shadow-white/5`}>
                    {section.icon}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic">{section.tag}</span>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight italic">{section.title}</h2>
                  <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest leading-relaxed">
                    {section.content}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-8">
                  {section.details.map((detail, dIdx) => (
                    <div key={dIdx} className="glass p-6 rounded-3xl border-white/5 hover:border-white/10 transition-colors">
                      <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${section.accent}`} />
                        {detail.title}
                      </h4>
                      <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                        {detail.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 relative group w-full lg:w-auto">
                <div className={`absolute -inset-4 bg-gradient-to-br ${section.accent} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />
                <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-white/10">
                  <img 
                    src={section.image} 
                    alt={section.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-hub-black/80 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="glass p-4 rounded-2xl border-white/10 flex items-center justify-between">
                       <span className="text-[10px] font-black uppercase tracking-widest italic opacity-50">Visual Perspective</span>
                       <Zap className="w-4 h-4 text-white opacity-20" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-40 glass p-12 md:p-20 rounded-[4rem] border-white/5 text-center relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-hub-purple/10 via-transparent to-hub-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-8 relative z-10">
            Sẵn sàng để <span className="text-gradient-cosmic">khởi tạo</span>?
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10 relative z-10 font-bold uppercase text-[11px] tracking-widest leading-relaxed">
            Đừng chỉ dừng lại ở viễn cảnh. Hãy trực tiếp trải nghiệm không gian "Workshop Container" độc bản tại cơ sở The Hub Arena.
          </p>
          <button 
            onClick={() => window.location.href='/booking'}
            className="relative z-10 px-12 py-5 bg-white text-hub-black rounded-full font-black uppercase tracking-widest text-xs hover:bg-hub-blue hover:text-white transition-all shadow-2xl shadow-white/10"
          >
            Ghi danh & Giữ chỗ ngay
          </button>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default Space;
