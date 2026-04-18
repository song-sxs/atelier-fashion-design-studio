import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Info, Filter, Plus, X, Check, Loader2,
  Image as ImageIcon, Star, ZoomIn, ChevronDown, ChevronUp,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useFabrics } from "@/src/lib/hooks";
import { fabricApi } from "@/src/lib/api";
import { Fabric } from "@/src/types";

// 面料分类选项
const CATEGORY_OPTIONS = [
  { value: "Natural Fiber", label: "天然纤维" },
  { value: "Cotton", label: "棉类" },
  { value: "Silk", label: "丝绸" },
  { value: "Wool", label: "毛类" },
  { value: "Leather", label: "皮革" },
  { value: "Technical", label: "合成纤维 / 功用" },
];

const CATEGORY_TABS = [
  { id: "Natural Fiber", label: "天然纤维", imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBiet1O1BqAKGmAdo4eHqXUk-DyHt9NLkPNaoaVh3b__aYvFYTF7UiQgx3vctCqLpgtqpLEpAE0pzWL0_rdDPJQN3xkRM6k8qr-x5uudKKiuHysFIrUdc6UAYxlO-vNSiqv0rX-8xeZkOmuD1DD7Ud1iPOULkjBv3jX5LGuuuLzMMzLIsXH4-uXgieVaWsrPi06wn3FbdT_5qXNFQbS_BV934PLSK_ypgpH4XrEijqLoh_V-hGAXLj2crHgY4IvkojwdPLw04QR1MA" },
  { id: "Technical", label: "合成纤维", imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeAL-ZbySZOte4HjZcUmqdYolVBr7FSMqrOBR1GadAW7p3GFrynBEmOYUD31-rd2jF7MEbpZK_q2ayj25BOnI3ErcF7E2Xkdy3edpUnS7RZkOanB2dSkWbg2P7-fPa-fn5E-wFBx0paK3u28qeeppNilwF-Owo0ifVJ23D2sD21bAQ0vlkU6Fm2nHVJJ2tI8GBLN78JTHfGj7MFqA9Fe4d-5IqtFduVg1gmC-h9oKa9ySqb78OGWR8cEaA45MNNfa3SYFCUQYm4OI" },
  { id: "Silk", label: "丝绸缎面", imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbKmG1z0NL5OluzVMHVrFoSa2c0JgZfABMTo_yWDqtqqhCm8Nto39qE6NXhBSeV6aLO9AZQhWEpKm95l0oG3ERKlr8MgrO83JtqmkNZ_ueXY1Scj4vvL3HKPJpEGriugyg0_TAx0P5r7JMqML0G0cAOIqvueN0Ii5xYF-nSzY_B0K2bk4CP2f9c3I8Pa-ENSbkWjE8oyrCiI9-gWRnX3AzIyllSqNgAzryENlJ-gh6hTDymsMKW8F67OXjz1piHocEHLxYKWPnSzM" },
  { id: "Leather", label: "皮革皮草", imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBTIX66mbCuH1T8EkhlVcNgoPYTlb4CUSdXAFtm_Gz1JO3ZUgh2lXam2SP8sGMh2E7xKSD7bGasXgOpdEm1o4KYWgL9FM_J6KJ7oFQDMVSVoOHVWGfk7zqoCmSlgBYD_BLboYbvzrvuGFBG8V1dgzL0EAUE40BPrlxP_fjmfjSp4cPislpvLMeUfWC7ULSCgk9ZhEJKYAXyNSfR3f5yjwRKi_q9H9Morg1wJ5OcN6lywysSIaJO24zMcThWNY4CvX8Vur8J0EyyNB8" },
  { id: "all", label: "全部", imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6pkADyEJEZaEudmKMIOaQx-X42h4DcVUV8vyv2aA3BUu6L3vl2awdzi8xBuYsNLPv19XjZ1ymsJnWRwOPX-E0WYUplD073S6SSboMPm1SiS0r1EUtUT_6UyFXNlQlNt7e5DsG4pHOKa6u6890p2r7KYqn3BBo7nTvmywiqMyV3QmasKiFyJEWA6c4ym2bpqtop7dNm2IHXbh6Qv18Qu6LuU5R7vJ1UD25DP74xUnribI_JorRkZ1Nz2TldXzSNJ9Qb0MSdYKtZc8" },
];

// ============================================
// 大图 Lightbox 组件
// ============================================

interface LightboxProps {
  fabric: Fabric;
  onClose: () => void;
}

function Lightbox({ fabric, onClose }: LightboxProps) {
  return (
    <motion.div
      key="lightbox-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md p-6"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* 关闭按钮 */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        <X size={20} className="text-white" />
      </button>

      {/* 大图 */}
      <motion.div
        key="lightbox-image"
        initial={{ opacity: 0, scale: 0.88, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ type: "spring", damping: 24, stiffness: 280 }}
        className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
      >
        <img
          src={fabric.imageUrl}
          alt={fabric.name}
          className="w-full object-cover"
          referrerPolicy="no-referrer"
          style={{ maxHeight: "60vh" }}
        />
      </motion.div>

      {/* 面料信息卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="w-full max-w-sm mt-5 bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-white"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold leading-tight">{fabric.name}</h3>
            <p className="text-white/60 text-xs mt-1 uppercase tracking-wider">{fabric.category}</p>
          </div>
          {fabric.isFeatured && (
            <span className="flex items-center gap-1 px-2.5 py-1 bg-yellow-400/20 text-yellow-300 rounded-full text-[10px] font-bold shrink-0">
              <Star size={10} fill="currentColor" /> 精选
            </span>
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium">
            {fabric.weight}
          </span>
          {fabric.type && (
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium">
              {fabric.type}
            </span>
          )}
          {fabric.tags?.map((tag) => (
            <span key={tag} className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium">
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// 面料卡片组件（通用）
// ============================================

interface FabricCardProps {
  fabric: Fabric;
  /** 高度模式：compact（常用面料区）/ square（目录区） */
  mode?: "compact" | "square";
  onClick: (fabric: Fabric) => void;
}

function FabricCard({ fabric, mode = "compact", onClick }: FabricCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      onClick={() => onClick(fabric)}
      className="group cursor-pointer"
    >
      {mode === "compact" ? (
        /* 常用面料：横向卡片 */
        <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow">
          <div className="relative overflow-hidden">
            <img
              src={fabric.imageUrl}
              className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
              alt={fabric.name}
              referrerPolicy="no-referrer"
            />
            {/* 大图提示角标 */}
            <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn size={13} className="text-white" />
            </div>
            {fabric.isFeatured && (
              <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-yellow-400/90 flex items-center justify-center">
                <Star size={11} fill="white" className="text-white" />
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-bold text-sm text-on-surface">{fabric.name}</h3>
            <div className="flex justify-between items-center mt-1">
              <span className="text-[10px] text-on-surface-variant">{fabric.weight}</span>
              <Info size={14} className="text-primary" />
            </div>
          </div>
        </div>
      ) : (
        /* 目录面料：方形卡片 */
        <div className="space-y-2.5">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-container-low shadow-sm">
            <img
              src={fabric.imageUrl}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
              alt={fabric.name}
              referrerPolicy="no-referrer"
            />
            {/* hover 遮罩 */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <ZoomIn size={22} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {fabric.isFeatured && (
              <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-yellow-400/90 flex items-center justify-center">
                <Star size={11} fill="white" className="text-white" />
              </div>
            )}
          </div>
          <div className="flex justify-between items-start px-1">
            <div className="min-w-0">
              <h4 className="font-bold text-sm truncate">{fabric.name}</h4>
              <p className="text-[11px] text-on-surface-variant">{fabric.weight} · {fabric.category}</p>
              {fabric.tags && fabric.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {fabric.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-primary-container text-on-primary-container rounded-full font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ============================================
// 新增面料表单弹窗
// ============================================

interface AddFabricModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  name: string;
  category: string;
  weight: string;
  type: string;
  imageUrl: string;
  isFeatured: boolean;
  tags: string;
}

const INITIAL_FORM: FormData = {
  name: "",
  category: "Cotton",
  weight: "",
  type: "",
  imageUrl: "",
  isFeatured: false,
  tags: "",
};

function AddFabricModal({ onClose, onSuccess }: AddFabricModalProps) {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreviewError, setImagePreviewError] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    if (name === "imageUrl") setImagePreviewError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.weight.trim() || !form.imageUrl.trim()) {
      setError("请填写名称、克重和图片 URL（必填项）");
      return;
    }
    try {
      setSubmitting(true);
      setError(null);
      await fabricApi.create({
        name: form.name.trim(),
        category: form.category,
        weight: form.weight.trim(),
        type: form.type.trim() || undefined,
        imageUrl: form.imageUrl.trim(),
        isFeatured: form.isFeatured,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "添加失败，请重试");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      key="add-fabric-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        key="add-fabric-modal"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="w-full max-w-lg bg-surface rounded-t-3xl shadow-2xl overflow-hidden"
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-outline-variant/40 rounded-full" />
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/10">
          <h2 className="text-lg font-bold text-on-surface font-serif">添加新面料</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors">
            <X size={18} className="text-on-surface-variant" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[70vh]">
          <div className="px-6 py-5 space-y-5">
            {/* 图片预览 */}
            <div className="relative w-full h-40 rounded-2xl overflow-hidden bg-surface-container-high flex items-center justify-center">
              {form.imageUrl && !imagePreviewError ? (
                <img src={form.imageUrl} alt="预览" className="w-full h-full object-cover" referrerPolicy="no-referrer" onError={() => setImagePreviewError(true)} />
              ) : (
                <div className="flex flex-col items-center gap-2 text-on-surface-variant/50">
                  <ImageIcon size={32} />
                  <span className="text-xs">输入图片 URL 后预览</span>
                </div>
              )}
            </div>

            {/* 图片 URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                图片 URL <span className="text-primary">*</span>
              </label>
              <input name="imageUrl" type="url" value={form.imageUrl} onChange={handleChange}
                placeholder="https://example.com/fabric.jpg"
                className="w-full px-4 py-3 bg-surface-container-high rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-on-surface-variant/40" />
            </div>

            {/* 名称 */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                面料名称 <span className="text-primary">*</span>
              </label>
              <input name="name" type="text" value={form.name} onChange={handleChange} placeholder="例：精纺亚麻" maxLength={50}
                className="w-full px-4 py-3 bg-surface-container-high rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-on-surface-variant/40" />
            </div>

            {/* 分类 + 克重 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">分类</label>
                <select name="category" value={form.category} onChange={handleChange}
                  className="w-full px-4 py-3 bg-surface-container-high rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none">
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  克重 / 规格 <span className="text-primary">*</span>
                </label>
                <input name="weight" type="text" value={form.weight} onChange={handleChange} placeholder="例：180 g/m²"
                  className="w-full px-4 py-3 bg-surface-container-high rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-on-surface-variant/40" />
              </div>
            </div>

            {/* 类型 */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">类型（可选）</label>
              <input name="type" type="text" value={form.type} onChange={handleChange} placeholder="例：帆布、丝绸、皮革…"
                className="w-full px-4 py-3 bg-surface-container-high rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-on-surface-variant/40" />
            </div>

            {/* 标签 */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">标签（逗号分隔，可选）</label>
              <input name="tags" type="text" value={form.tags} onChange={handleChange} placeholder="例：高克重, 挺括, 透气"
                className="w-full px-4 py-3 bg-surface-container-high rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-on-surface-variant/40" />
            </div>

            {/* 精选 Toggle */}
            <button type="button" onClick={() => setForm((prev) => ({ ...prev, isFeatured: !prev.isFeatured }))}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all",
                form.isFeatured ? "bg-primary-container border-primary/20 text-on-primary-container" : "bg-surface-container-high border-transparent text-on-surface-variant"
              )}>
              <div className="flex items-center gap-3">
                <Star size={18} fill={form.isFeatured ? "currentColor" : "none"} className={form.isFeatured ? "text-primary" : ""} />
                <span className="text-sm font-medium">设为常用面料（精选）</span>
              </div>
              <div className={cn("w-10 h-6 rounded-full transition-all duration-300 relative", form.isFeatured ? "bg-primary" : "bg-surface-container-highest")}>
                <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300", form.isFeatured ? "left-5" : "left-1")} />
              </div>
            </button>

            {error && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">
                {error}
              </motion.p>
            )}
          </div>

          {/* 底部按钮 */}
          <div className="px-6 pb-8 pt-2 flex gap-3">
            <button type="button" onClick={onClose}
              className="flex-1 py-3.5 rounded-2xl bg-surface-container-high text-on-surface-variant font-semibold text-sm transition-all hover:bg-surface-container-highest active:scale-95">
              取消
            </button>
            <button type="submit" disabled={submitting}
              className="flex-[2] py-3.5 rounded-2xl bg-primary text-surface-container-lowest font-bold text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2">
              {submitting ? (<><Loader2 size={16} className="animate-spin" /><span>保存中…</span></>) : (<><Check size={16} /><span>添加到面料库</span></>)}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// 主页面：面料库
// ============================================

export default function FabricLibrary() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [showCommon, setShowCommon] = useState(true);
  // NOTE: 目录区默认展开，让用户能看到所有面料（包括新添加的）
  const [showCatalog, setShowCatalog] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  // 点击面料卡片时展开大图的目标面料
  const [lightboxFabric, setLightboxFabric] = useState<Fabric | null>(null);

  // 精选面料（常用区）
  const { data: featuredFabrics, loading: featuredLoading, refetch: refetchFeatured } = useFabrics(undefined, true);
  // 目录面料（按分类过滤，仅非精选）
  const { data: catalogFabrics, loading: catalogLoading, refetch: refetchCatalog } = useFabrics(
    activeCategory !== "all" ? activeCategory : undefined,
    false
  );

  /**
   * 新增面料成功后：关闭弹窗、刷新两个列表、显示 Toast
   */
  const handleAddSuccess = () => {
    setShowAddModal(false);
    refetchFeatured();
    refetchCatalog();
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 2500);
  };

  return (
    <div className="px-6 space-y-10 pb-32">

      {/* 成功 Toast */}
      <AnimatePresence>
        {successToast && (
          <motion.div key="toast"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 px-5 py-3 bg-on-surface text-surface rounded-2xl shadow-xl text-sm font-medium whitespace-nowrap">
            <Check size={16} className="text-tertiary-fixed" />
            面料已成功添加到数据库
          </motion.div>
        )}
      </AnimatePresence>

      {/* 大图 Lightbox */}
      <AnimatePresence>
        {lightboxFabric && (
          <Lightbox fabric={lightboxFabric} onClose={() => setLightboxFabric(null)} />
        )}
      </AnimatePresence>

      {/* 新增面料弹窗 */}
      <AnimatePresence>
        {showAddModal && (
          <AddFabricModal onClose={() => setShowAddModal(false)} onSuccess={handleAddSuccess} />
        )}
      </AnimatePresence>

      {/* ── 常用面料区 ── */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-on-surface">常用面料</h2>
            <p className="text-sm text-on-surface-variant mt-1">精选 · 最近使用的核心材质</p>
          </div>
          <button onClick={() => setShowCommon(!showCommon)}
            className="flex items-center gap-1 text-primary text-sm font-semibold hover:underline transition-all">
            {showCommon ? (<><ChevronUp size={14} />收起</>) : (<><ChevronDown size={14} />展开</>)}
          </button>
        </div>

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

        <AnimatePresence>
          {showCommon && !featuredLoading && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }} className="grid grid-cols-2 gap-4 overflow-hidden">
              {featuredFabrics.map((fabric) => (
                <FabricCard key={fabric.id} fabric={fabric} mode="compact" onClick={setLightboxFabric} />
              ))}
              {featuredFabrics.length === 0 && (
                <p className="col-span-2 py-6 text-center text-on-surface-variant text-sm">
                  暂无精选面料 — 添加时勾选「设为常用面料」即可出现在这里
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── 分类导航 ── */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-on-surface px-1">面料分类</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar">
          {CATEGORY_TABS.map((cat) => (
            <div key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className="flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer">
              <div className={cn(
                "w-16 h-16 rounded-2xl overflow-hidden transition-all duration-300",
                activeCategory === cat.id ? "ring-2 ring-primary ring-offset-2 scale-105 shadow-lg" : "bg-surface-container-low hover:bg-surface-container-high"
              )}>
                <img src={cat.imageUrl}
                  className={cn("w-full h-full object-cover transition-opacity duration-300",
                    activeCategory === cat.id ? "opacity-100" : "opacity-60 grayscale-[0.5]")}
                  alt={cat.label} referrerPolicy="no-referrer" />
              </div>
              <span className={cn("text-xs font-medium transition-colors",
                activeCategory === cat.id ? "text-primary font-bold" : "text-on-surface-variant")}>
                {cat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 发现材质（目录）区 —— 默认展开，显示所有面料 ── */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-on-surface">发现材质</h2>
            <p className="text-sm text-on-surface-variant mt-1">全部面料库 · 点击卡片查看大图</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <Filter size={16} />
              <span className="text-sm font-medium">已筛选</span>
            </div>
            <button onClick={() => setShowCatalog(!showCatalog)}
              className="flex items-center gap-1 text-primary text-sm font-semibold hover:underline">
              {showCatalog ? (<><ChevronUp size={14} />收起</>) : (<><ChevronDown size={14} />展开</>)}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showCatalog && (
            <motion.div key="catalog-grid"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden">

              {/* 加载态 */}
              {catalogLoading && (
                <div className="grid grid-cols-2 gap-x-4 gap-y-8">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse space-y-3">
                      <div className="aspect-square rounded-2xl bg-surface-container-high" />
                      <div className="space-y-1">
                        <div className="h-3 bg-surface-container-high rounded w-2/3" />
                        <div className="h-2 bg-surface-container-high rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!catalogLoading && (
                <>
                  {catalogFabrics.length === 0 ? (
                    <div className="py-12 text-center text-on-surface-variant text-sm">
                      此分类暂无面料 — 点击右下角 <span className="font-bold text-primary">+</span> 添加
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-8">
                      {catalogFabrics.map((fabric) => (
                        <FabricCard key={fabric.id} fabric={fabric} mode="square" onClick={setLightboxFabric} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* FAB — 添加新面料 */}
      <motion.button
        onClick={() => setShowAddModal(true)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        className="fixed right-6 bottom-24 w-14 h-14 bg-primary text-surface-container-lowest rounded-2xl shadow-xl flex items-center justify-center z-40"
      >
        <Plus size={28} />
      </motion.button>
    </div>
  );
}
