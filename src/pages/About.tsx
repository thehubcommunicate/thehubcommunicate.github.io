import React from "react";
import { motion } from "motion/react";
import { Zap, Users, Globe, BookOpen, Target, Sparkles, Heart, Rocket } from "lucide-react";
import PageLayout from "../components/PageLayout";

const About = () => {
  const values = [
    { icon: <Target className="w-6 h-6" />, title: "Mục tiêu", desc: "Trở thành hệ sinh thái kết nối sáng tạo lớn nhất dành cho thế hệ trẻ đam mê nghệ thuật." },
    { icon: <Sparkles className="w-6 h-6" />, title: "Sáng tạo", desc: "Không ngừng đổi mới cách thức tương tác giữa con người và không gian làm việc." },
    { icon: <Heart className="w-6 h-6" />, title: "Cộng đồng", desc: "Nơi mỗi cá nhân đều tìm thấy những người đồng điệu để cùng nhau phát triển." },
    { icon: <Rocket className="w-6 h-6" />, title: "Tốc độ", desc: "Cung cấp các công cụ và dịch vụ giúp hiện thực hóa ý tưởng trong thời gian ngắn nhất." },
  ];

  return (
    <PageLayout>
      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <span className="text-hub-purple font-black uppercase tracking-[0.3em] text-[10px] block">Câu chuyện của chúng tôi</span>
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
              The Hub – Hơn cả một <br />
              <span className="text-gradient-cosmic">thuật toán kết nối</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed font-medium">
              Ra đời từ niềm tin rằng mọi ý tưởng vĩ đại đều bắt đầu bằng một tiếng "Chào!". 
              The Hub không chỉ xây dựng không gian, chúng tôi nuôi dưỡng những mối liên kết. 
              Chúng tôi là điểm giao thoa giữa Công nghệ – Nghệ thuật – Và những con người dám nghĩ dám làm.
            </p>
            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-3xl font-black text-white">5,000+</div>
                <div className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Thành viên</div>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div>
                <div className="text-3xl font-black text-white">200+</div>
                <div className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Sự kiện/Tháng</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="absolute -inset-10 bg-hub-purple/20 blur-[100px] rounded-full" />
            <div className="relative aspect-square rounded-[4rem] overflow-hidden border border-white/5 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200" 
                alt="The Hub Community" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-hub-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10 p-6 glass rounded-3xl border-white/10 max-w-xs">
                <p className="text-xs font-medium italic text-gray-300">
                  "Tại đây, tôi không chỉ tìm thấy chỗ ngồi, tôi tìm thấy đồng đội cho dự án phim ngắn đầu tay của mình."
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-hub-blue/20 flex items-center justify-center text-hub-blue"><Users className="w-4 h-4" /></div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Minh Đức, Film Director</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-10 rounded-[2.5rem] border-white/5 hover:border-hub-purple/30 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-hub-purple/10 flex items-center justify-center text-hub-purple mb-6 group-hover:scale-110 transition-transform">
                {v.icon}
              </div>
              <h3 className="text-xl font-black uppercase italic tracking-widest mb-4">{v.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default About;
