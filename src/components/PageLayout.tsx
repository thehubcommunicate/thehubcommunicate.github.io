import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AIAssistant from "./AIAssistant";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen selection:bg-hub-purple selection:text-white bg-hub-black text-white">
      <Navbar />
      <div className="pt-32 pb-20">
        {children}
      </div>
      <Footer />
      <AIAssistant />
    </div>
  );
};

export default PageLayout;
