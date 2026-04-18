import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Zap, Users, MessageSquare, Heart, Share2, Search, MapPin, Globe, Star, User, ChevronRight, Send, Filter, Sparkles, Bot, Loader2, Image as ImageIcon, Video, Trash2, Play, Plus, Info } from "lucide-react";
import PageLayout from "../components/PageLayout";
import { suggestConnection } from "../lib/gemini";
import { createPost, subscribeToFeed, likePost, deletePost, addComment, subscribeToComments, PostMedia, subscribeToPublicBookings } from "../lib/firebase";
import { useAuth } from "../components/AuthProvider";

const CommentSection = ({ postId, user }: { postId: string, user: any }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToComments(postId, (data) => {
      setComments(data);
    });
    return () => unsubscribe();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;
    setIsSubmitting(true);
    try {
      await addComment(postId, user, newComment.trim());
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
      <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <img src={comment.authorPhoto || `https://ui-avatars.com/api/?name=${comment.authorName}`} className="w-8 h-8 rounded-lg" />
            <div className="flex-1 glass p-3 rounded-xl border-white/5">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">{comment.authorName}</span>
                <span className="text-[8px] text-gray-500">{comment.createdAt?.toDate?.().toLocaleTimeString()}</span>
              </div>
              <p className="text-xs text-gray-300">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
      
      {user && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input 
            type="text" 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={isSubmitting}
            placeholder="Viết bình luận..." 
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:border-hub-blue outline-none" 
          />
          <button 
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="p-2 bg-hub-blue rounded-xl hover:bg-hub-purple transition-all disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      )}
    </div>
  );
};

const Community = () => {
  const [activeTab, setActiveTab] = useState("feed");
  const [matchingUserSkills, setMatchingUserSkills] = useState("");
  const [matchingProjectNeeds, setMatchingProjectNeeds] = useState("");
  const [matchingResult, setMatchingResult] = useState("");
  const [isMatchingLoading, setIsMatchingLoading] = useState(false);
  const [showHeatmapDetails, setShowHeatmapDetails] = useState<string | null>(null);

  // Dynamic Feed State
  const [posts, setPosts] = useState<any[]>([]);
  const [postContent, setPostContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [showMediaInput, setShowMediaInput] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [publicBookings, setPublicBookings] = useState<any[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const unsubscribe = subscribeToFeed((newPosts) => {
      setPosts(newPosts);
    });
    
    const unsubscribeBookings = subscribeToPublicBookings((data) => {
      setPublicBookings(data);
    });

    return () => {
      unsubscribe();
      unsubscribeBookings();
    };
  }, []);

  const handlePost = async () => {
    if (!user || !postContent.trim()) return;
    setIsPosting(true);
    try {
      const media: PostMedia | undefined = mediaUrl ? { url: mediaUrl, type: mediaType } : undefined;
      await createPost(user, postContent.trim(), media);
      setPostContent("");
      setMediaUrl("");
      setShowMediaInput(false);
    } catch (error) {
      console.error("Failed to post", error);
    } finally {
      setIsPosting(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá bài viết này?")) return;
    try {
      await deletePost(postId);
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await likePost(postId);
    } catch (error) {
      console.error("Failed to like", error);
    }
  };

  const members = [
    { name: "Anh Tuấn", skill: "Event Planner", rating: 4.9, projects: 12, avatar: "https://ui-avatars.com/api/?name=Anh+Tuan&background=7c3aed&color=fff" },
    { name: "Bảo Ngọc", skill: "Graphic Designer", rating: 4.8, projects: 8, avatar: "https://ui-avatars.com/api/?name=Bao+Ngoc&background=38bdf8&color=fff" },
    { name: "Đức Anh", skill: "Video Editor", rating: 4.7, projects: 15, avatar: "https://ui-avatars.com/api/?name=Duc+Anh&background=db2777&color=fff" },
    { name: "Phương Thảo", skill: "Content Creator", rating: 4.9, projects: 20, avatar: "https://ui-avatars.com/api/?name=Phuong+Thao&background=fbbf24&color=fff" },
  ];

  return (
    <PageLayout>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-6 text-gradient-cosmic uppercase tracking-tighter">Hub Connect</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Nơi kết nối những tâm hồn sáng tạo, tìm kiếm đối tác và cùng nhau tạo nên những dự án đột phá.
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          <button 
            onClick={() => setActiveTab("feed")}
            className={`px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${activeTab === "feed" ? "bg-hub-purple shadow-lg shadow-hub-purple/30 text-white" : "glass text-gray-400 hover:bg-white/10"}`}
          >
            Bảng tin Hub-Feed
          </button>
          <button 
            onClick={() => setActiveTab("members")}
            className={`px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${activeTab === "members" ? "bg-hub-purple shadow-lg shadow-hub-purple/30 text-white" : "glass text-gray-400 hover:bg-white/10"}`}
          >
            Hub-Connect
          </button>
          <button 
            onClick={() => setActiveTab("map")}
            className={`px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${activeTab === "map" ? "bg-hub-purple shadow-lg shadow-hub-purple/30 text-white" : "glass text-gray-400 hover:bg-white/10"}`}
          >
            Live-Heatmap
          </button>
        </div>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === "feed" && (
              <motion.div 
                key="feed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Post Box */}
                <div className="glass p-8 rounded-[2.5rem] border-white/10 mb-12">
                  <div className="flex gap-4 mb-6">
                    <img src={user?.photoURL || "https://ui-avatars.com/api/?name=User&background=7c3aed&color=fff"} className="w-12 h-12 rounded-2xl" />
                    <textarea 
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      placeholder={user ? "Bạn đang tìm kiếm điều gì? Chia sẻ ngay với cộng đồng Hubers..." : "Vui lòng đăng nhập để đăng bài..."}
                      disabled={!user || isPosting}
                      className="w-full bg-transparent border-none outline-none text-lg resize-none pt-2 font-medium"
                      rows={2}
                    ></textarea>
                  </div>

                  {showMediaInput && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mb-6 space-y-4"
                    >
                      <div className="flex gap-2 mb-2">
                        <button 
                          onClick={() => setMediaType('image')}
                          className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${mediaType === 'image' ? 'bg-hub-blue text-white' : 'glass text-gray-400'}`}
                        >
                          <ImageIcon className="w-4 h-4 inline mr-2" /> Hình ảnh
                        </button>
                        <button 
                          onClick={() => setMediaType('video')}
                          className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${mediaType === 'video' ? 'bg-hub-blue text-white' : 'glass text-gray-400'}`}
                        >
                          <Video className="w-4 h-4 inline mr-2" /> Video
                        </button>
                      </div>
                      <input 
                        type="url" 
                        value={mediaUrl}
                        onChange={(e) => setMediaUrl(e.target.value)}
                        placeholder={`Dán URL ${mediaType === 'image' ? 'ảnh' : 'video'} vào đây...`}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs focus:border-hub-blue outline-none transition-all"
                      />
                    </motion.div>
                  )}

                  <div className="flex justify-between items-center pt-6 border-t border-white/5">
                    <div className="flex gap-4">
                      <button className="text-gray-500 hover:text-hub-blue transition-colors"><Globe className="w-5 h-5" /></button>
                      <button className="text-gray-500 hover:text-hub-blue transition-colors"><MapPin className="w-5 h-5" /></button>
                      <button 
                        onClick={() => setShowMediaInput(!showMediaInput)}
                        className={`transition-colors ${showMediaInput ? 'text-hub-blue' : 'text-gray-500 hover:text-hub-blue'}`}
                      >
                        <ImageIcon className="w-5 h-5" />
                      </button>
                    </div>
                    <button 
                      onClick={handlePost}
                      disabled={!user || isPosting || !postContent.trim()}
                      className="px-8 py-2.5 bg-hub-blue rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {isPosting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Đăng tin"}
                    </button>
                  </div>
                </div>

                {/* Feed Posts */}
                {posts.map((post, i) => (
                  <motion.div 
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass p-8 rounded-[2.5rem] border-white/5 hover:border-white/10 transition-all group/card"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-4">
                        <img src={post.authorPhoto || `https://ui-avatars.com/api/?name=${post.authorName}&background=7c3aed&color=fff`} className="w-12 h-12 rounded-2xl" />
                        <div>
                          <h4 className="font-bold text-white uppercase tracking-wider">{post.authorName}</h4>
                          <span className="text-[10px] font-bold text-hub-blue uppercase tracking-widest">Huber</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                          {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleString() : 'Vừa xong'}
                        </span>
                        {user?.uid === post.authorId && (
                          <button 
                            onClick={() => handleDelete(post.id)}
                            className="text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover/card:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-300 text-lg leading-relaxed mb-6 font-medium">{post.content}</p>
                    
                    {post.mediaUrl && (
                      <div className="mb-8 rounded-3xl overflow-hidden glass p-1 border-white/5 aspect-video relative group">
                        {post.mediaType === 'video' ? (
                          <div className="w-full h-full relative cursor-pointer" onClick={() => window.open(post.mediaUrl, '_blank')}>
                            <video className="w-full h-full object-cover">
                              <source src={post.mediaUrl} type="video/mp4" />
                            </video>
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                                <Play className="w-8 h-8 text-white fill-white" />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <img 
                            src={post.mediaUrl} 
                            alt="Post media" 
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" 
                            referrerPolicy="no-referrer"
                            onClick={() => window.open(post.mediaUrl, '_blank')}
                          />
                        )}
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-6 border-t border-white/5">
                      <div className="flex gap-8">
                        <button 
                          onClick={() => handleLike(post.id)}
                          className="flex items-center gap-2 text-gray-500 hover:text-hub-magenta transition-colors group"
                        >
                          <Heart className="w-5 h-5 group-hover:fill-hub-magenta transition-all" /> <span className="text-xs font-bold">{post.likes || 0}</span>
                        </button>
                        <button 
                          onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                          className={`flex items-center gap-2 transition-colors ${expandedComments[post.id] ? 'text-hub-blue' : 'text-gray-500 hover:text-hub-blue'}`}
                        >
                          <MessageSquare className="w-5 h-5" /> <span className="text-xs font-bold">{post.commentCount || 0}</span>
                        </button>
                      </div>
                      <button className="text-gray-500 hover:text-white transition-colors"><Share2 className="w-5 h-5" /></button>
                    </div>

                    <AnimatePresence>
                      {expandedComments[post.id] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <CommentSection postId={post.id} user={user} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === "members" && (
              <motion.div 
                key="members"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-8"
              >
                {/* AI Match Maker - Tinder Style */}
                <div className="glass p-12 rounded-[3rem] border-hub-purple/20 bg-gradient-to-br from-hub-purple/10 to-transparent mb-12 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-hub-purple/10 blur-[100px] -z-10" />
                  <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-hub-purple/30 mb-6">
                      <Sparkles className="w-4 h-4 text-hub-purple" />
                      <span className="text-[10px] font-black uppercase tracking-widest">AI Career Tinder</span>
                    </div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Tìm thấy Tri kỷ Sự nghiệp</h2>
                    <p className="text-gray-400 text-sm max-w-lg mx-auto italic">"Đừng chờ đợi cơ hội, hãy để AI kết nối bạn với những linh hồn sáng tạo cùng tần số."</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-hub-purple ml-2">Bạn có gì?</label>
                      <input 
                        type="text" 
                        value={matchingUserSkills}
                        onChange={(e) => setMatchingUserSkills(e.target.value)}
                        placeholder="Kỹ năng (vd: Guitar, UI Designer...)" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-hub-purple outline-none transition-all placeholder:text-gray-600"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-hub-purple ml-2">Bạn cần gì?</label>
                      <input 
                        type="text" 
                        value={matchingProjectNeeds}
                        onChange={(e) => setMatchingProjectNeeds(e.target.value)}
                        placeholder="Yêu cầu (vd: Cần Marketer cho Start-up...)" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-hub-purple outline-none transition-all placeholder:text-gray-600"
                      />
                    </div>
                  </div>

                  <div className="flex justify-center mt-12">
                    <button 
                      onClick={async () => {
                        if (!matchingUserSkills || !matchingProjectNeeds) return;
                        setIsMatchingLoading(true);
                        const result = await suggestConnection(matchingUserSkills, matchingProjectNeeds);
                        setMatchingResult(result);
                        setIsMatchingLoading(false);
                      }}
                      disabled={isMatchingLoading}
                      className="group relative px-12 py-4 bg-hub-purple rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(124,58,237,0.4)] disabled:opacity-50"
                    >
                      <div className="flex items-center gap-3">
                        {isMatchingLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Bot className="w-5 h-5" />}
                        Bắt đầu "Mai mối" AI
                      </div>
                    </button>
                  </div>

                  {matchingResult && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-12 p-8 glass rounded-3xl border-hub-purple/30 bg-hub-purple/5 relative"
                    >
                      <div className="absolute -top-3 left-8 px-4 py-1 bg-hub-purple rounded-full text-[9px] font-black uppercase tracking-widest">Lời giải từ Cỗ máy tơ hồng</div>
                      <p className="text-gray-300 leading-relaxed text-sm italic">{matchingResult}</p>
                      <div className="mt-8 flex justify-end">
                        <button className="text-[9px] font-black text-hub-purple uppercase tracking-widest flex items-center gap-2 hover:underline">
                          Tạo buổi hẹn ngay <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="flex gap-4 mb-12">
                  <div className="relative flex-1">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input type="text" placeholder="Tìm kiếm theo tên, kỹ năng hoặc dự án..." className="w-full pl-16 pr-6 py-4 rounded-2xl glass border-white/5 focus:border-hub-blue outline-none transition-all" />
                  </div>
                  <button className="px-6 py-4 glass rounded-2xl hover:bg-white/10 transition-all"><Filter className="w-5 h-5" /></button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {members.map((member, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ y: -5 }}
                      className="glass p-8 rounded-[2.5rem] border-white/5 flex items-center gap-6 group"
                    >
                      <img src={member.avatar} className="w-20 h-20 rounded-3xl group-hover:rotate-6 transition-transform" />
                      <div className="flex-1">
                        <h4 className="text-xl font-bold mb-1">{member.name}</h4>
                        <p className="text-xs text-hub-blue font-bold uppercase tracking-widest mb-4">{member.skill}</p>
                        <div className="flex gap-6">
                          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            <Star className="w-3 h-3 text-hub-gold fill-hub-gold" /> {member.rating}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            <Zap className="w-3 h-3 text-hub-purple" /> {member.projects} dự án
                          </div>
                        </div>
                      </div>
                      <button className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-hub-purple transition-colors"><ChevronRight className="w-5 h-5" /></button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "map" && (
              <motion.div 
                key="map"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-8"
              >
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 text-gradient-cosmic">Live-Heatmap</h2>
                  <p className="text-gray-400 text-sm max-w-xl mx-auto">“Góc nào đang nóng nhất? Ai đang toả sáng? Bản đồ nhiệt thời gian thực sẽ cho bạn câu trả lời - Đừng để mình bị tụt lại phía sau!”</p>
                </div>

                <div className="relative aspect-[16/9] glass rounded-[3rem] border-white/10 overflow-hidden group">
                  {/* Digital Grid Layer */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                  
                  {/* Heat Zones */}
                  <div className="absolute top-1/4 left-1/4 w-[20%] h-[30%] bg-hub-purple/20 blur-[60px] animate-pulse" />
                             {/* Hot Spots */}
                  <div className="absolute inset-0 p-12">
                    {/* Public Bookings as Live Pins */}
                    {publicBookings.map((booking, idx) => (
                      <motion.div 
                        key={booking.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute cursor-pointer group/pin"
                        style={{ 
                          top: `${20 + (idx * 15) % 60}%`, 
                          left: `${20 + (idx * 25) % 60}%` 
                        }}
                        onHoverStart={() => setShowHeatmapDetails(booking.id)}
                        onHoverEnd={() => setShowHeatmapDetails(null)}
                      >
                         <div className="relative">
                          <div className="w-8 h-8 bg-hub-blue/30 rounded-full animate-ping absolute -inset-2" />
                          <div className="w-4 h-4 bg-hub-blue rounded-full shadow-[0_0_20px_#38bdf8] relative z-10" />
                          <AnimatePresence>
                            {showHeatmapDetails === booking.id && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 glass p-4 rounded-2xl border-white/10 z-50 pointer-events-none"
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                  <h5 className="text-[10px] font-black text-hub-blue uppercase tracking-widest leading-none">Live: {booking.roomName}</h5>
                                </div>
                                <p className="text-[9px] text-gray-300 leading-tight">Một dự án công khai đang diễn ra! <br/><span className="text-hub-purple font-bold">Lịch: {booking.time}</span></p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    ))}

                    <motion.div 
                      onHoverStart={() => setShowHeatmapDetails("hall-static")}
                      onHoverEnd={() => setShowHeatmapDetails(null)}
                      className="absolute top-1/2 right-1/4 cursor-pointer group/pin"
                    >
                      <div className="relative">
                        <div className="w-12 h-12 bg-hub-purple/30 rounded-full animate-ping absolute -inset-4" />
                        <div className="w-6 h-6 bg-hub-purple rounded-full shadow-[0_0_25px_#7c3aed] relative z-10" />
                        <AnimatePresence>
                          {showHeatmapDetails === "hall-static" && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 glass p-4 rounded-2xl border-white/10 z-50 pointer-events-none"
                            >
                              <h5 className="text-[10px] font-black text-hub-purple uppercase tracking-widest mb-1">Creative Hall</h5>
                              <p className="text-[9px] text-gray-400 leading-tight">Tiệc âm nhạc 4.0 đang diễn ra rầm rộ. 45 Hubers tham gia!</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  </div>
                    <div className="absolute top-2/3 left-1/3 w-3 h-3 bg-white rounded-full opacity-60 animate-pulse" />
                    <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-hub-magenta rounded-full opacity-60 animate-bounce" />
                  

                  {/* UI Overlay */}
                  <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                    <div className="glass px-6 py-3 rounded-2xl border-white/5 flex items-center gap-4">
                      <div className="flex -space-x-3">
                        {[1, 2, 3].map(i => (
                          <img key={i} src={`https://ui-avatars.com/api/?name=User${i}&background=random`} className="w-8 h-8 rounded-full border-2 border-hub-black" />
                        ))}
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-white">82 Đấu sĩ đang Online</div>
                        <div className="text-[8px] text-gray-500 uppercase tracking-widest">Cập nhật 2 phút trước</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-3 glass rounded-xl border-white/5 hover:bg-hub-blue/20 transition-all text-hub-blue"><Search className="w-4 h-4" /></button>
                      <button className="px-6 py-3 bg-hub-purple rounded-xl font-bold text-[9px] uppercase tracking-widest hover:scale-105 transition-all">Đến ngay chỗ này</button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  {[
                    { label: "Check-in sự kiện", value: "+10 Hub-Coins", color: "text-hub-blue" },
                    { label: "Hoàn thành Portfolio", value: "+50 Hub-Coins", color: "text-hub-purple" },
                    { label: "Mai mối thành công", value: "+100 Hub-Coins", color: "text-hub-magenta" },
                  ].map((stat, i) => (
                    <div key={i} className="glass p-6 rounded-3xl border-white/5 text-center group hover:border-white/10 transition-all">
                      <h6 className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">{stat.label}</h6>
                      <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageLayout>
  );
};

export default Community;
