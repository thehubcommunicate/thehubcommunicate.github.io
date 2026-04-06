import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap, Facebook, Instagram, Twitter, Globe, MapPin, Phone, Mail, Send } from "lucide-react";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="pt-24 pb-12 bg-hub-black border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6 cursor-pointer group" onClick={() => navigate("/")}>
              <div className="w-10 h-10 bg-gradient-to-br from-hub-purple to-hub-blue rounded-xl flex items-center justify-center shadow-lg shadow-hub-purple/20 group-hover:rotate-12 transition-transform">
                <Zap className="w-6 h-6 text-white fill-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase">The Hub</span>
            </div>
            <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
              Hệ thống không gian sự kiện linh hoạt, hiện đại, all-in-one cho workshop, networking và startup events. Kết nối không gian, khơi nguồn sáng tạo.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter, Globe].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-hub-purple transition-colors">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-gray-400">Khám phá</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link to="/about" className="hover:text-white transition-colors">Về chúng tôi</Link></li>
              <li><Link to="/space" className="hover:text-white transition-colors">Không gian</Link></li>
              <li><Link to="/events" className="hover:text-white transition-colors">Sự kiện</Link></li>
              <li><Link to="/community" className="hover:text-white transition-colors">Cộng đồng</Link></li>
              <li><Link to="/booking" className="hover:text-white transition-colors">Đặt chỗ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-gray-400">Liên hệ</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li className="flex items-center gap-3"><MapPin className="w-4 h-4 text-hub-blue" /> 123 Đường Sáng Tạo, Quận 1, TP.HCM</li>
              <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-hub-blue" /> +84 900 123 456</li>
              <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-hub-blue" /> hello@thehub.vn</li>
            </ul>
          </div>
          <div className="col-span-1 md:col-span-4 lg:col-span-1">
            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-gray-400">Newsletter</h4>
            <p className="text-xs text-gray-600 mb-4 uppercase tracking-widest">Nhận tin tức mới nhất từ The Hub.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Email của bạn..." 
                className="w-full px-6 py-4 rounded-2xl glass border-white/5 focus:border-hub-blue outline-none transition-all pr-16"
              />
              <button className="absolute right-2 top-2 bottom-2 px-4 bg-hub-purple rounded-xl hover:bg-hub-blue transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="pt-12 border-t border-white/5 text-center text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em]">
          <p>© 2026 THE HUB – Flexible Event Space System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
