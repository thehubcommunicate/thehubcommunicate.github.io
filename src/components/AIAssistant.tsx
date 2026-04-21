import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Bot, Send, X, Minimize2, Maximize2, Sparkles, Zap, MessageSquare, CreditCard, ShoppingCart, Check, Loader2 } from "lucide-react";
import { askHubAIStream } from "../lib/gemini";
import { SERVICES_PACKAGES } from "../constants/services";

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "model"; text: string }[]>([
    { role: "model", text: "Chào Huber! Tôi là Hub-AI. Tôi có thể giúp bạn tìm phòng, lên ý tưởng sự kiện hoặc kết nối đồng đội. Bạn cần gì hôm nay?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-hub-ai', handleOpen);
    return () => window.removeEventListener('open-hub-ai', handleOpen);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    // Format history for Gemini
    // CRITICAL: Gemini history MUST start with 'user' role. 
    // We skip the first greeting message if it's 'model' and ensure correct structure.
    const history = messages
      .filter((m, index) => !(index === 0 && m.role === "model")) // Skip initial prompt if it's model
      .slice(-10)
      .map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

    // Start with an empty message for the model
    setMessages(prev => [...prev, { role: "model", text: "" }]);
    
    let fullResponse = "";
    
    try {
      const stream = askHubAIStream(userMessage, history);
      
      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = fullResponse;
          return newMessages;
        });
      }
    } catch (e) {
      console.error("Chat error:", e);
    } finally {
      setIsLoading(false);
    }

    // Recommendation logic after full response is received
    let recPackageId = null;
    try {
      const matches = fullResponse.match(/\{[\s\S]*?\}/g);
      if (matches) {
         for (const match of matches) {
           try {
              const data = JSON.parse(match);
              if (data.action === "recommend" && data.packageId) {
                 recPackageId = data.packageId;
              }
           } catch (e) {}
         }
      }
    } catch (e) {}

    // AUTO-NAVIGATE to checkout if recommendation found
    if (recPackageId) {
      setTimeout(() => {
        navigate(`/services?order=${recPackageId}`);
        window.dispatchEvent(new CustomEvent('ai-trigger-order', { detail: { packageId: recPackageId } }));
      }, 1500);
    }
  };

  const parseRecommendation = (text: string) => {
    try {
      const jsonMatch = text.match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
         const data = JSON.parse(jsonMatch[0]);
         if (data.action === "recommend" && data.packageId) {
            return SERVICES_PACKAGES.find(p => p.id === data.packageId);
         }
      }
    } catch (e) {}
    return null;
  };

  const lastModelMessage = [...messages].reverse().find(m => m.role === "model");
  const recommendation = lastModelMessage ? parseRecommendation(lastModelMessage.text) : null;

  const handleQuickPay = async () => {
    if (!recommendation) return;
    
    // Auto-trigger real UI
    navigate(`/services?order=${recommendation.id}`);
    window.dispatchEvent(new CustomEvent('ai-trigger-order', { detail: { packageId: recommendation.id } }));
    
    setIsProcessingOrder(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setOrderComplete(true);
    setIsProcessingOrder(false);
    
    setMessages(prev => [...prev, { 
      role: "model", 
      text: `🚀 Đã mở giao diện thanh toán cho gói "${recommendation.title}". Bạn chỉ cần chọn phương thức thanh toán là xong!`
    }]);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="w-[350px] sm:w-[400px] h-[500px] glass rounded-[2.5rem] border-white/10 shadow-2xl flex flex-col overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-hub-purple to-hub-blue flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest leading-none">Hub-AI</h3>
                  <span className="text-[10px] font-bold text-white/70 uppercase">Online & Ready</span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Chat Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar"
            >
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl text-xs font-medium leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-hub-blue text-white rounded-tr-none shadow-lg shadow-hub-blue/20' 
                      : 'glass border-white/5 rounded-tl-none'
                  }`}>
                    {/* Filter out JSON from display if cleaning failed during handleSend */}
                    {m.text.replace(/\{[\s\S]*?\}/g, "").trim()}
                  </div>

                  {/* If this message is a recommendation from AI, show the action button */}
                  {m.role === "model" && !isLoading && parseRecommendation(m.text) && !orderComplete && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 w-full max-w-[85%]"
                    >
                      <div className="glass p-4 rounded-2xl border-hub-purple/30 bg-hub-purple/5 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase text-hub-purple">Hub-AI Đề xuất</span>
                          <span className="text-[10px] font-bold text-white">{parseRecommendation(m.text)?.price}</span>
                        </div>
                        <button 
                          onClick={handleQuickPay}
                          disabled={isProcessingOrder}
                          className="w-full py-2.5 bg-hub-purple text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-lg shadow-hub-purple/20"
                        >
                          {isProcessingOrder ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>Thanh toán ngay <CreditCard className="w-3.5 h-3.5" /></>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="glass p-4 rounded-2xl rounded-tl-none flex gap-1">
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-hub-purple" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-hub-blue" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Suggestions */}
            {!isLoading && messages.length === 1 && (
              <div className="px-6 pb-2 flex flex-wrap gap-2">
                {[
                  "Gợi ý gói đặt chỗ phù hợp?",
                  "Tiệc sinh nhật 20 người hết bao nhiêu?",
                  "Sự kiện ra mắt cần những gì?",
                  "Workshop giáo dục chọn phòng nào?"
                ].map((s, i) => (
                  <button 
                    key={i}
                    onClick={() => { setInput(s); }}
                    className="text-[10px] font-bold px-3 py-1.5 glass border-white/10 rounded-full hover:bg-white/10 transition-colors uppercase tracking-wider"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-white/5">
              <div className="relative flex items-center bg-white/5 rounded-2xl p-1 px-4">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Hỏi Hub-AI bất cứ điều gì..."
                  className="flex-1 bg-transparent py-3 text-xs focus:outline-none font-medium"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="w-10 h-10 rounded-xl bg-hub-purple flex items-center justify-center text-white shadow-lg shadow-hub-purple/20 disabled:opacity-50 transition-all hover:scale-110"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-[2rem] bg-gradient-to-tr from-hub-purple via-hub-blue to-cyan-400 p-0.5 shadow-2xl glow-purple"
      >
        <div className="w-full h-full rounded-[1.95rem] bg-hub-black flex items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-hub-purple/20 to-hub-blue/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Bot className="w-8 h-8 text-white relative z-10" />
          <div className="absolute top-1 right-1">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
        </div>
      </motion.button>
    </div>
  );
};

export default AIAssistant;
