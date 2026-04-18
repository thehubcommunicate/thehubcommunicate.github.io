import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Bot, Sparkles, Minus, Maximize2 } from "lucide-react";
import { askHubAI } from "../lib/gemini";

interface Message {
  role: "user" | "model";
  text: string;
}

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", text: "Chào bạn! Mình là Hub-AI. Bạn cần hỗ trợ gì về không gian hay kết nối cộng đồng tại The Hub không?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    // Prepare history for API
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await askHubAI(userMessage, history);
    
    setMessages(prev => [...prev, { role: "model", text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              height: isMinimized ? "auto" : "500px" 
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`glass w-[350px] md:w-[400px] mb-4 overflow-hidden flex flex-col border-white/10 shadow-2xl rounded-[2rem] glow-purple`}
          >
            {/* Header */}
            <div className="p-5 flex justify-between items-center bg-gradient-to-r from-hub-purple/20 to-hub-blue/20 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-hub-purple flex items-center justify-center">
                  <Bot className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest leading-none mb-1">Hub-AI</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">AI Concierge Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            {!isMinimized && (
              <>
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar bg-hub-black/20"
                >
                  {messages.map((m, i) => (
                    <div 
                      key={i} 
                      className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div 
                        className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${
                          m.role === "user" 
                            ? "bg-hub-purple text-white rounded-tr-none" 
                            : "glass text-gray-200 rounded-tl-none border-white/5"
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="glass p-4 rounded-2xl rounded-tl-none border-white/5 flex gap-1">
                        <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 h-1 bg-hub-blue rounded-full" />
                        <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-1 bg-hub-purple rounded-full" />
                        <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-1 bg-hub-magenta rounded-full" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-4 bg-hub-black/30 border-t border-white/5">
                  <div className="relative">
                    <input 
                      type="text" 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Hỏi Hub-AI về sự kiện..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:border-hub-blue focus:outline-none pr-12 transition-all"
                    />
                    <button 
                      onClick={handleSend}
                      disabled={isLoading || !input.trim()}
                      className="absolute right-2 top-1.5 bottom-1.5 px-3 bg-hub-purple rounded-lg hover:bg-hub-blue transition-colors disabled:opacity-50"
                    >
                      <Send className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-gradient-to-r from-hub-purple to-hub-blue flex items-center justify-center shadow-2xl relative group overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-8 h-8 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="bot"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="relative"
            >
              <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-hub-gold animate-pulse" />
              <Bot className="w-8 h-8 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default AIAssistant;
