import { motion } from "motion/react";
import { Plus, Clock, Eye } from "lucide-react";
import { useProjects } from "@/src/lib/hooks";

export default function ProjectManagement() {
  // NOTE: 分别加载活跃项目和归档项目
  const { data: activeProjects, loading: activeLoading, error: activeError } = useProjects("active");
  const { data: archivedProjects, loading: archivedLoading } = useProjects("archived");

  return (
    <div className="px-6 max-w-4xl mx-auto space-y-10">
      {/* Active Projects */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-on-surface">进行中</h2>
          <span className="text-sm font-medium bg-primary-container text-on-primary-container px-3 py-1 rounded-full">
            {activeLoading ? "..." : `${activeProjects.length} 个活跃项目`}
          </span>
        </div>

        {/* 加载态 */}
        {activeLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-surface-container-low rounded-xl p-5">
                <div className="flex gap-4 mb-4">
                  <div className="w-20 h-28 rounded-lg bg-surface-container-high" />
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-4 bg-surface-container-high rounded w-3/4" />
                    <div className="h-3 bg-surface-container-high rounded w-1/2" />
                  </div>
                </div>
                <div className="h-1.5 bg-surface-container-high rounded-full" />
              </div>
            ))}
          </div>
        )}

        {/* 错误提示 */}
        {activeError && (
          <div className="text-center py-8">
            <p className="text-on-surface-variant text-sm">加载失败: {activeError}</p>
          </div>
        )}

        {!activeLoading && !activeError && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeProjects.map((project, i) => (
              <motion.div 
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`bg-surface-container-lowest rounded-xl p-5 shadow-[0px_10px_30px_rgba(45,52,53,0.06)] group hover:scale-[1.01] transition-all ${i === 2 ? 'md:col-span-2' : ''}`}
              >
                <div className={i === 2 ? "flex flex-col md:flex-row gap-6" : "flex gap-4 mb-4"}>
                  <div className={`${i === 2 ? "w-full md:w-48 h-32" : "w-20 h-28"} rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-high`}>
                    <img src={project.imageUrl} className="w-full h-full object-cover" alt={project.name} referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-on-surface leading-tight">{project.name}</h3>
                        <p className="text-[10px] text-on-surface-variant tracking-wider mt-1 uppercase">{project.subtitle}</p>
                      </div>
                      {i === 2 && <span className="text-[10px] border border-outline-variant px-2 py-0.5 rounded text-on-surface-variant uppercase font-bold">Priority</span>}
                    </div>
                    {project.daysLeft && (
                      <div className="flex items-center gap-2 text-primary mt-2">
                        <Clock size={12} />
                        <span className="text-xs font-medium">剩余 {project.daysLeft} 天</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className={`space-y-3 ${i === 2 ? 'mt-4' : ''}`}>
                  <div className="flex justify-between text-xs font-medium text-on-surface-variant">
                    <span>{project.phase}</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="relative w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${project.progress}%` }} />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-outline-variant tracking-widest pt-1">
                    <span className={project.progress >= 25 ? "text-primary font-bold" : ""}>草图</span>
                    <span className={project.progress >= 65 ? "text-primary font-bold" : ""}>打样</span>
                    <span className={project.progress >= 90 ? "text-primary font-bold" : ""}>生产</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Archived Projects */}
      <section className="pb-12">
        <h2 className="text-2xl font-bold text-on-surface mb-6 opacity-60">已归档</h2>

        {archivedLoading && (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse flex items-center gap-4 p-4 bg-surface-container-low rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-surface-container-high" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-surface-container-high rounded w-1/2" />
                  <div className="h-3 bg-surface-container-high rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!archivedLoading && (
          <div className="space-y-4">
            {archivedProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl opacity-75 hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-surface-container-high overflow-hidden grayscale">
                    <img src={project.imageUrl} className="w-full h-full object-cover" alt={project.name} referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface">{project.name}</h4>
                    <p className="text-[10px] text-outline-variant uppercase tracking-widest">{project.subtitle}</p>
                  </div>
                </div>
                <button className="text-primary hover:bg-primary-container p-2 rounded-full transition-colors">
                  <Eye size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FAB */}
      <button className="fixed right-6 bottom-24 w-14 h-14 bg-gradient-to-br from-primary to-primary-dim text-surface-container-lowest rounded-full shadow-xl flex items-center justify-center active:scale-95 transition-all z-40">
        <Plus size={32} />
      </button>
    </div>
  );
}
