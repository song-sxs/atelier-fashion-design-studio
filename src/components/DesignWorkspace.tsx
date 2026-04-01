import React, { useState } from "react";
import { motion } from "motion/react";
import { Brush, Layers, Palette, Undo, Sparkles, Box } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useFabrics } from "@/src/lib/hooks";

export default function DesignWorkspace() {
  const [activeTool, setActiveTool] = useState("brush");
  const [selectedSwatch, setSelectedSwatch] = useState<string | null>(null);
  const [lines, setLines] = useState<{ [key: number]: { points: { x: number; y: number }[]; color: string }[] }>({ 0: [], 1: [] });
  const [activeLayer, setActiveLayer] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#2d3435");
  const [showSwatches, setShowSwatches] = useState(true);

  // NOTE: 面料色板数据从 API 加载，复用 useFabrics Hook
  const { data: swatches, loading: swatchesLoading } = useFabrics(undefined, true);

  // 首次加载完成后自动选中第一个色板
  React.useEffect(() => {
    if (swatches.length > 0 && !selectedSwatch) {
      setSelectedSwatch(swatches[0].id);
    }
  }, [swatches, selectedSwatch]);

  const colors = ["#2d3435", "#F27D26", "#3B82F6", "#10B981", "#EF4444"];

  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeTool === "brush") {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setLines(prev => ({
        ...prev,
        [activeLayer]: [...prev[activeLayer], { points: [{ x, y }], color: brushColor }]
      }));
      setIsDrawing(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDrawing && activeTool === "brush") {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setLines(prev => {
        const currentLayerLines = [...prev[activeLayer]];
        const lastLine = { ...currentLayerLines[currentLayerLines.length - 1] };
        const lastPoints = [...lastLine.points];
        
        // 只在距离上一点足够远时才添加新点，避免过多冗余点
        const lastPoint = lastPoints[lastPoints.length - 1];
        const dist = Math.sqrt(Math.pow(x - lastPoint.x, 2) + Math.pow(y - lastPoint.y, 2));
        
        if (dist > 2) {
          lastPoints.push({ x, y });
          lastLine.points = lastPoints;
          currentLayerLines[currentLayerLines.length - 1] = lastLine;
          return { ...prev, [activeLayer]: currentLayerLines };
        }
        return prev;
      });
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const cycleFabric = () => {
    if (swatches.length === 0) return;
    const currentIndex = swatches.findIndex(s => s.id === selectedSwatch);
    const nextIndex = (currentIndex + 1) % swatches.length;
    setSelectedSwatch(swatches[nextIndex].id);
  };

  const cycleColor = () => {
    const currentIndex = colors.indexOf(brushColor);
    const nextIndex = (currentIndex + 1) % colors.length;
    setBrushColor(colors[nextIndex]);
  };

  const selectedSwatchData = swatches.find(s => s.id === selectedSwatch);

  return (
    <div className="relative h-[calc(100vh-160px)] w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Design Workspace */}
      <div 
        className="relative w-full max-w-lg h-full flex items-center justify-center px-6 cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Background Paper Texture Effect */}
        <div className="absolute inset-0 mx-8 my-4 bg-surface-container-lowest shadow-[0px_10px_40px_rgba(45,52,53,0.04)] rounded-xl border border-outline-variant/10" />
        
        {/* Mannequin / Croquis */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-8 pointer-events-none">
          {/* Base Mannequin */}
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfVn1V6hY1Cf9IimVqDdj_KUhIzSfcSevBBQDzQOmkLlBU2pLJxpDyY8xzH54PjMB95MfgI8erCkp9Lkr0-6KOF90rWUajtvWHfFq4EWraVr-TGszs7aHU2zbXXIGh2gQGGovIsxH24qTgtE3miIDrye-cNdr1wJ_wDMlDJ7swoxQjSzaY8pc1c8c_SEvFEZeXPzhXNhrvQSDPlEA-dvyvG6rWtOvEsVjE4rIIeJv560uyGDnGexeM9y6KlmUEvEl8i-9ggnf5HRc" 
            alt="Mannequin" 
            className="h-full object-contain mix-blend-multiply opacity-80"
            referrerPolicy="no-referrer"
          />
          
          {/* Fabric Overlay (Box Tool Effect) */}
          {selectedSwatchData && (
            <div 
              className="absolute inset-0 flex items-center justify-center p-8 mix-blend-overlay opacity-40 transition-all duration-500"
              style={{ 
                backgroundImage: `url(${selectedSwatchData.imageUrl})`,
                backgroundSize: '200px',
                maskImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuDfVn1V6hY1Cf9IimVqDdj_KUhIzSfcSevBBQDzQOmkLlBU2pLJxpDyY8xzH54PjMB95MfgI8erCkp9Lkr0-6KOF90rWUajtvWHfFq4EWraVr-TGszs7aHU2zbXXIGh2gQGGovIsxH24qTgtE3miIDrye-cNdr1wJ_wDMlDJ7swoxQjSzaY8pc1c8c_SEvFEZeXPzhXNhrvQSDPlEA-dvyvG6rWtOvEsVjE4rIIeJv560uyGDnGexeM9y6KlmUEvEl8i-9ggnf5HRc)',
                maskSize: 'contain',
                maskRepeat: 'no-repeat',
                maskPosition: 'center'
              }}
            />
          )}

          {/* Brush Lines - Layer 0 (Base) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
            {lines[0].map((line, i) => (
              <polyline
                key={`l0-${i}`}
                points={line.points.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke={line.color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ opacity: activeLayer === 0 ? 1 : 0.6 }}
              />
            ))}
          </svg>

          {/* Brush Lines - Layer 1 (Overlay) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-21">
            {lines[1].map((line, i) => (
              <polyline
                key={`l1-${i}`}
                points={line.points.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke={line.color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={activeLayer === 1 ? "0" : "4 2"}
                style={{ opacity: activeLayer === 1 ? 1 : 0.6 }}
              />
            ))}
          </svg>
        </div>

        {/* Floating Toolbar (Left) */}
        <aside className="absolute left-12 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-4 p-2 bg-surface-container-lowest/90 backdrop-blur-md rounded-2xl shadow-[0px_10px_30px_rgba(45,52,53,0.08)] border border-outline-variant/10">
          <ToolButton 
            active={activeTool === "brush"} 
            onClick={() => setActiveTool("brush")}
            icon={<Brush size={20} />} 
          />
          <ToolButton 
            active={activeTool === "box"} 
            onClick={() => {
              setActiveTool("box");
              cycleFabric();
            }}
            icon={<Box size={20} />} 
          />
          <ToolButton 
            active={activeTool === "layers"} 
            onClick={() => {
              setActiveTool("layers");
              setActiveLayer(prev => (prev === 0 ? 1 : 0));
            }}
            icon={
              <div className="relative">
                <Layers size={20} />
                <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-primary text-[8px] text-white font-bold">
                  {activeLayer + 1}
                </span>
              </div>
            } 
          />
          <ToolButton 
            active={activeTool === "palette"} 
            onClick={() => {
              setActiveTool("palette");
              cycleColor();
            }}
            icon={
              <div className="relative">
                <Palette size={20} />
                <div 
                  className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-white shadow-sm"
                  style={{ backgroundColor: brushColor }}
                />
              </div>
            } 
          />
          <div className="h-px bg-outline-variant/20 mx-2" />
          <ToolButton 
            onClick={() => {
              setLines({ 0: [], 1: [] });
              setIsDrawing(false);
            }}
            icon={<Undo size={20} />} 
          />
        </aside>

        {/* Contextual Action (Moodboard Pin) */}
        <button className="absolute right-12 bottom-12 z-20 w-14 h-14 bg-tertiary-fixed text-on-tertiary-fixed rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
          <Sparkles size={24} fill="currentColor" />
        </button>
      </div>

      {/* Fabric Swatch Area */}
      <div className="fixed bottom-24 left-0 w-full z-40 px-6 py-4">
        <div className="bg-surface-container-low/80 backdrop-blur-md rounded-3xl p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-3 px-2">
            <span className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">推荐面料</span>
            <span 
              className="text-[10px] text-primary font-medium cursor-pointer hover:underline"
              onClick={() => setShowSwatches(!showSwatches)}
            >
              {showSwatches ? "隐藏全部" : "查看全部"}
            </span>
          </div>

          {/* 面料色板加载态 */}
          {swatchesLoading && showSwatches && (
            <div className="flex gap-4 pb-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-shrink-0 flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-xl bg-surface-container-high animate-pulse" />
                  <div className="w-10 h-2 bg-surface-container-high rounded animate-pulse" />
                </div>
              ))}
            </div>
          )}

          {showSwatches && !swatchesLoading && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex gap-4 overflow-x-auto no-scrollbar pb-2"
            >
              {swatches.map((swatch) => (
                <div key={swatch.id} className="flex-shrink-0 flex flex-col items-center gap-2">
                  <div 
                    onClick={() => setSelectedSwatch(swatch.id)}
                    className={cn(
                      "w-16 h-16 rounded-xl overflow-hidden shadow-sm border-2 transition-all cursor-pointer",
                      selectedSwatch === swatch.id ? "border-primary scale-105 shadow-md" : "border-transparent hover:border-primary/50"
                    )}
                  >
                    <img src={swatch.imageUrl} className="w-full h-full object-cover" alt={swatch.name} referrerPolicy="no-referrer" />
                  </div>
                  <span className={cn(
                    "text-[10px] font-medium transition-colors",
                    selectedSwatch === swatch.id ? "text-primary font-bold" : "text-on-surface"
                  )}>{swatch.name}</span>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function ToolButton({ icon, active, onClick }: { icon: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-12 h-12 flex items-center justify-center rounded-xl transition-all hover:scale-105 active:scale-95",
        active ? "bg-primary text-surface-container-lowest shadow-md" : "text-on-surface-variant hover:bg-surface-container-low"
      )}
    >
      {icon}
    </button>
  );
}
