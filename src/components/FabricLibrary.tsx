import { useState } from "react";
import { motion } from "motion/react";
import { Info, Filter } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useFabrics } from "@/src/lib/hooks";

const categories = [
  { id: "Natural Fiber", label: "天然纤维", imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBiet1O1BqAKGmAdo4eHqXUk-DyHt9NLkPNaoaVh3b__aYvFYTF7UiQgx3vctCqLpgtqpLEpAE0pzWL0_rdDPJQN3xkRM6k8qr-x5uudKKiuHysFIrUdc6UAYxlO-vNSiqv0rX-8xeZkOmuD1DD7Ud1iPOULkjBv3jX5LGuuuLzMMzLIsXH4-uXgieVaWsrPi06wn3FbdT_5qXNFQbS_BV934PLSK_ypgpH4XrEijqLoh_V-hGAXLj2crHgY4IvkojwdPLw04QR1MA" },
  { id: "Technical", label: "合成纤维", imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeAL-ZbySZOte4HjZcUmqdYolVBr7FSMqrOBR1GadAW7p3GFrynBEmOYUD31-rd2jF7MEbpZK_q2ayj25BOnI3ErcF7E2Xkdy3edpUnS7RZkOanB2dSkWbg2P7-fPa-fn5E-wFBx0paK3u28qeeppNilwF-Owo0ifVJ23D2sD21bAQ0vlkU6Fm2nHVJJ2tI8GBLN78JTHfGj7MFqA9Fe4d-5IqtFduVg1gmC-h9oKa9ySqb78OGWR8cEaA45MNNfa3SYFCUQYm4OI" },
  { id: "Silk", label: "丝绸缎面", imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbKmG1z0NL5OluzVMHVrFoSa2c0JgZfABMTo_yWDqtqqhCm8Nto39qE6NXhBSeV6aLO9AZQhWEpKm95l0oG3ERKlr8MgrO83JtqmkNZ_ueXY1Scj4vvL3HKPJpEGriugyg0_TAx0P5r7JMqML0G0cAOIqvueN0Ii5xYF-nSzY_B0K2bk4CP2f9c3I8Pa-ENSbkWjE8oyrCiI9-gWRnX3AzIyllSqNgAzryENlJ-gh6hTDymsMKW8F67OXjz1piHocEHLxYKWPnSzM" },
  { id: "Leather", label: "皮革皮草", imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBTIX66mbCuH1T8EkhlVcNgoPYTlb4CUSdXAFtm_Gz1JO3ZUgh2lXam2SP8sGMh2E7xKSD7bGasXgOpdEm1o4KYWgL9FM_J6KJ7oFQDMVSVoOHVWGfk7zqoCmSlgBYD_BLboYbvzrvuGFBG8V1dgzL0EAUE40BPrlxP_fjmfjSp4cPislpvLMeUfWC7ULSCgk9ZhEJKYAXyNSfR3f5yjwRKi_q9H9Morg1wJ5OcN6lywysSIaJO24zMcThWNY4CvX8Vur8J0EyyNB8" },
  { id: "all", label: "全部", imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6pkADyEJEZaEudmKMIOaQx-X42h4DcVUV8vyv2aA3BUu6L3vl2awdzi8xBuYsNLPv19XjZ1ymsJnWRwOPX-E0WYUplD073S6SSboMPm1SiS0r1EUtUT_6UyFXNlQlNt7e5DsG4pHOKa6u6890p2r7KYqn3BBo7nTvmywiqMyV3QmasKiFyJEWA6c4ym2bpqtop7dNm2IHXbh6Qv18Qu6LuU5R7vJ1UD25DP74xUnribI_JorRkZ1Nz2TldXzSNJ9Qb0MSdYKtZc8" },
];

export default function FabricLibrary() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [showCatalog, setShowCatalog] = useState(false);
  const [showCommon, setShowCommon] = useState(true);

  // NOTE: 精选面料和目录面料分别从 API 加载
  const { data: featuredFabrics, loading: featuredLoading } = useFabrics(undefined, true);
  const { data: catalogFabrics, loading: catalogLoading } = useFabrics(
    activeCategory !== "all" ? activeCategory : undefined,
    false
  );

  return (
    <div className="px-6 space-y-10">
      {/* Featured Section */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-on-surface">常用面料</h2>
            <p className="text-sm text-on-surface-variant mt-1">最近使用的核心材质</p>
          </div>
          <button 
            onClick={() => setShowCommon(!showCommon)}
            className="text-primary text-sm font-semibold hover:underline transition-all"
          >
            {showCommon ? "隐藏全部" : "查看全部"}
          </button>
        </div>

        {/* 精选面料加载态 */}
        {featuredLoading && showCommon && (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse rounded-2xl bg-surface-container-low overflow-hidden">
                <div className="h-40 bg-surface-container-high" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-surface-container-high rounded w-2/3" />
                  <div className="h-2 bg-surface-container-high rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {showCommon && !featuredLoading && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 gap-4 overflow-hidden"
          >
            {featuredFabrics.map((fabric) => (
              <div key={fabric.id} className="relative group overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm">
                <img 
                  src={fabric.imageUrl} 
                  className="w-full h-40 object-cover" 
                  alt={fabric.name}
                  referrerPolicy="no-referrer"
                />
                <div className="p-4">
                  <h3 className="font-bold text-sm text-on-surface">{fabric.name}</h3>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] text-on-surface-variant">{fabric.weight}</span>
                    <Info size={16} className="text-primary" />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Categories */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-on-surface px-1">面料分类</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              onClick={() => setActiveCategory(cat.id)}
              className="flex-shrink-0 flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 overflow-hidden",
                activeCategory === cat.id ? "ring-2 ring-primary ring-offset-2 scale-105 shadow-lg" : "bg-surface-container-low hover:bg-surface-container-high"
              )}>
                <img 
                  src={cat.imageUrl} 
                  className={cn(
                    "w-full h-full object-cover transition-opacity duration-300",
                    activeCategory === cat.id ? "opacity-100" : "opacity-60 grayscale-[0.5]"
                  )} 
                  alt={cat.label}
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className={cn(
                "text-xs font-medium transition-colors",
                activeCategory === cat.id ? "text-primary font-bold" : "text-on-surface-variant"
              )}>{cat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Catalog */}
      {showCatalog && (
        <motion.section
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-on-surface">发现材质</h2>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <Filter size={18} />
              <span className="text-sm font-medium">筛选</span>
            </div>
          </div>

          {/* 目录面料加载态 */}
          {catalogLoading && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse space-y-3">
                  <div className="aspect-square rounded-2xl bg-surface-container-high" />
                  <div className="space-y-1 px-1">
                    <div className="h-3 bg-surface-container-high rounded w-2/3" />
                    <div className="h-2 bg-surface-container-high rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!catalogLoading && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8">
              {catalogFabrics.map((fabric) => (
                <motion.div 
                  key={fabric.id} 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  <div className="aspect-square rounded-2xl overflow-hidden bg-surface-container-low shadow-sm">
                    <img 
                      src={fabric.imageUrl} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                      alt={fabric.name}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex justify-between items-start px-1">
                    <div>
                      <h4 className="font-bold text-sm">{fabric.name}</h4>
                      <p className="text-[11px] text-on-surface-variant">{fabric.weight} • {fabric.category}</p>
                    </div>
                    <Info size={16} className="text-primary" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      )}
    </div>
  );
}
