import React from "react";
import { useNavigate } from "react-router-dom";
import { Zap, ArrowLeft } from "lucide-react";
import PageLayout from "../components/PageLayout";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <PageLayout>
      <div className="container mx-auto px-6 py-24 text-center">
        <div className="w-24 h-24 bg-hub-purple/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
          <Zap className="w-12 h-12 text-hub-purple" />
        </div>
        <h1 className="text-6xl md:text-8xl font-black mb-6 text-gradient-cosmic uppercase tracking-tighter">404</h1>
        <h2 className="text-2xl font-bold mb-8 uppercase tracking-widest">Lạc vào vũ trụ khác?</h2>
        <p className="text-gray-500 max-w-md mx-auto mb-12 leading-relaxed">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển sang một không gian khác.
        </p>
        <button 
          onClick={() => navigate("/")}
          className="px-10 py-4 bg-white text-hub-black rounded-full font-bold hover:bg-hub-blue hover:text-white transition-all uppercase text-xs tracking-widest flex items-center gap-2 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" /> Quay về trang chủ
        </button>
      </div>
    </PageLayout>
  );
};

export default NotFound;
