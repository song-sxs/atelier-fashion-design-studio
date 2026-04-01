import React, { useState } from "react";
import { motion } from "motion/react";
import { Search, Filter, Heart, Plus } from "lucide-react";
import { useInspirations } from "@/src/lib/hooks";

export default function InspirationBoard() {
  const [activeTag, setActiveTag] = useState("全部");
  const [searchQuery, setSearchQuery] = useState("");

  // NOTE: 使用自定义 Hook 从 API 加载数据，替代硬编码
  const { data: inspirations, loading, error } = useInspirations(activeTag, searchQuery);

  /**
   * 搜索输入变更时同步更新标签状态
   * 如果搜索词恰好匹配一个标签，自动切换到该标签
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (["现代", "复古", "极简", "街头", "艺术"].includes(val)) {
      setActiveTag(val);
    } else if (val === "") {
      setActiveTag("全部");
    }
  };

  return (
    <div className="px-6 space-y-8">
      {/* Search & Filter */}
      <div className="space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline-variant" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="搜索风格、面料或色卡..." 
            className="w-full pl-12 pr-4 py-4 bg-surface-container-high border-none rounded-2xl focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/50"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button className="flex items-center gap-1.5 px-4 py-2 bg-surface-container-highest text-on-surface-variant rounded-full text-sm font-medium border border-outline-variant/10 shrink-0">
            <Filter size={16} />
            <span>筛选</span>
          </button>
          <div className="w-px h-6 bg-outline-variant/30 shrink-0 mx-1" />
          {["全部", "现代", "复古", "极简", "街头", "艺术"].map((tag) => (
            <button 
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${activeTag === tag ? 'bg-primary text-surface-container-lowest font-bold shadow-md' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-highest'}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 加载状态 */}
      {loading && (
        <div className="grid grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse bg-surface-container-low rounded-3xl overflow-hidden">
              <div className="h-[240px] bg-surface-container-high" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-surface-container-high rounded w-3/4" />
                <div className="h-3 bg-surface-container-high rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="text-center py-12">
          <p className="text-on-surface-variant text-sm">加载失败: {error}</p>
          <button 
            onClick={() => { setActiveTag("全部"); setSearchQuery(""); }}
            className="mt-4 px-6 py-2 bg-primary text-surface-container-lowest rounded-full text-sm font-medium"
          >
            重试
          </button>
        </div>
      )}

      {/* Masonry Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-2 gap-6">
          {inspirations.map((item) => (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="group relative bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {item.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${item.height === 'tall' ? 'h-[320px]' : item.height === 'medium' ? 'h-[240px]' : 'h-[180px]'}`}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="h-[180px] flex">
                  {item.colors?.map((color, i) => (
                    <div key={i} className="flex-1 h-full" style={{ backgroundColor: color }} />
                  ))}
                </div>
              )}
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-on-surface font-medium text-lg leading-tight">{item.title}</h3>
                  <button className="text-primary hover:scale-110 transition-transform">
                    <Heart size={18} fill="none" />
                  </button>
                </div>
                <p className="text-on-surface-variant text-[10px] mt-1 uppercase tracking-wider">{item.type}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* 空数据提示 */}
      {!loading && !error && inspirations.length === 0 && (
        <div className="text-center py-16">
          <p className="text-on-surface-variant text-sm">暂无匹配的灵感内容</p>
        </div>
      )}

      {/* FAB */}
      <button className="fixed right-6 bottom-24 w-14 h-14 bg-tertiary-fixed text-on-tertiary-fixed rounded-2xl shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-90 z-40">
        <Plus size={32} />
      </button>
    </div>
  );
}
