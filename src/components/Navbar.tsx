import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Zap, User, Calendar, Users, Globe, BookOpen, Layout } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { name: "Trang chủ", path: "/", type: "scroll", id: "home" },
    { name: "Không gian", path: "/space", type: "link" },
    { name: "Sự kiện", path: "/events", type: "link" },
    { name: "Cộng đồng", path: "/community", type: "link" },
    { name: "Đặt chỗ", path: "/booking", type: "link" },
  ];

  const scrollToSection = (id: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? "glass py-3 shadow-2xl shadow-hub-purple/10" : "bg-transparent py-6"}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 bg-gradient-to-br from-hub-purple to-hub-blue rounded-xl flex items-center justify-center shadow-lg shadow-hub-purple/20 group-hover:rotate-12 transition-transform">
            <Zap className="w-6 h-6 text-white fill-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase">The Hub</span>
        </Link>

        <div className="hidden lg:flex items-center gap-8 font-medium text-[11px] uppercase tracking-[0.2em]">
          {menuItems.map((item) => (
            item.type === "scroll" ? (
              <button 
                key={item.name} 
                onClick={() => scrollToSection(item.id!)} 
                className="hover:text-hub-blue transition-colors relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-hub-blue transition-all group-hover:w-full" />
              </button>
            ) : (
              <Link 
                key={item.name} 
                to={item.path} 
                className="hover:text-hub-blue transition-colors relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-hub-blue transition-all group-hover:w-full" />
              </Link>
            )
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/dashboard")}
            className="hidden md:flex items-center gap-2 px-5 py-2 glass rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            <User className="w-4 h-4" /> Đăng nhập
          </button>
          <button 
            onClick={() => navigate("/booking")}
            className="px-6 py-2.5 bg-gradient-to-r from-hub-purple to-hub-blue text-white rounded-full font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-hub-purple/30"
          >
            Đặt chỗ nhanh
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
