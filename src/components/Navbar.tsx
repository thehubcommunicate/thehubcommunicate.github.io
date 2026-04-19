import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Zap, User, Calendar, Users, Globe, BookOpen, Layout, LogOut } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { signInWithGoogle, logout } from "../lib/firebase";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAuthAction = async () => {
    if (user) {
      setShowUserMenu(!showUserMenu);
    } else {
      try {
        await signInWithGoogle();
      } catch (error: any) {
        // Errors are now thrown as Error objects with descriptive messages from firebase.ts
        alert(error.message || "Đã có lỗi xảy ra khi đăng nhập. Vui lòng kiểm tra console hoặc thử lại.");
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    navigate("/");
  };

  const menuItems = [
    { name: "Trang chủ", path: "/", type: "scroll", id: "home" },
    { name: "Không gian", path: "/space", type: "link" },
    { name: "Dịch vụ", path: "/services", type: "link" },
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

        <div className="flex items-center gap-4 relative">
          <div className="relative">
            <button 
              onClick={handleAuthAction}
              className="flex items-center gap-2 px-5 py-2 glass rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              {user ? (
                <>
                  <img src={user.photoURL || ""} alt="" className="w-5 h-5 rounded-full" />
                  <span className="max-w-[100px] truncate">{user.displayName}</span>
                </>
              ) : (
                <>
                  <User className="w-4 h-4" /> Đăng nhập
                </>
              )}
            </button>
            
            <AnimatePresence>
              {showUserMenu && user && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-56 glass p-4 rounded-3xl border-white/10 shadow-2xl z-[60]"
                >
                  <div className="px-4 py-3 border-b border-white/5 mb-2">
                    <div className="text-[9px] font-black text-hub-blue uppercase tracking-widest mb-1 flex justify-between items-center">
                      Cỗ máy tơ hồng 
                      <span className="text-hub-purple">{profile?.hubCoins || 0} HH</span>
                    </div>
                    <div className="text-[8px] text-gray-500 font-bold">#{user.uid.slice(0, 8).toUpperCase()}</div>
                  </div>
                  <button 
                    onClick={() => { navigate("/dashboard"); setShowUserMenu(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-white/5 rounded-xl text-[10px] uppercase tracking-wider transition-colors flex items-center gap-3"
                  >
                    <Layout className="w-4 h-4 text-hub-blue" /> Đấu trường sáng tạo
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-500/10 rounded-xl text-[10px] uppercase tracking-wider transition-colors flex items-center gap-3 text-red-400"
                  >
                    <LogOut className="w-4 h-4" /> Đăng xuất
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
