import React from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Search, Sparkles, Pencil, Layers, Briefcase } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { motion } from "motion/react";

export default function Layout() {
  const location = useLocation();
  
  const getTitle = () => {
    switch (location.pathname) {
      case "/": return "灵感看板";
      case "/workspace": return "设计工作台";
      case "/fabrics": return "面料库";
      case "/projects": return "项目管理";
      default: return "Atelier";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md shadow-[0px_10px_30px_rgba(45,52,53,0.06)] flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNACc3qv87wAEjJ3WE2yu1lieMfQNho8s0ymYFH0tfD0o3w9CMTOSCIaZ1MMjVj_vXWRGcSc5JZY8ii9ZDdg0OTNZUXPeQJZqk-9teZ1Uv6qxcMI1b9kb0UV-8TSi2BJM7q7GuC-6GLRtI5Q8W_67nh47I70CAzW6KirQCOhETVgJ1CBuuESLmu4nq9GY0Nua8ZjRRRRM0LFOVkeqbeU1wvhCo8xI67UGxY-YE57mUXD7on53fc5OrHwwHxylA3d2bxkQG-FQLa6s" 
              alt="Profile" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        <h1 className="font-serif text-2xl tracking-tight text-on-surface font-bold">
          {getTitle()}
        </h1>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors active:scale-95">
          <Search className="w-5 h-5 text-on-surface-variant" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-24 pb-32">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-xl rounded-t-2xl shadow-[0_-5px_20px_rgba(0,0,0,0.03)] flex justify-around items-center pt-2 pb-6 px-4">
        <NavButton to="/" icon={<Sparkles size={20} />} label="灵感" />
        <NavButton to="/workspace" icon={<Pencil size={20} />} label="工作台" />
        <NavButton to="/fabrics" icon={<Layers size={20} />} label="面料" />
        <NavButton to="/projects" icon={<Briefcase size={20} />} label="项目" />
      </nav>
    </div>
  );
}

function NavButton({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        "flex flex-col items-center justify-center px-5 py-1.5 transition-all duration-200 tap-highlight-none active:scale-90",
        isActive 
          ? "bg-primary-container text-primary rounded-xl font-bold" 
          : "text-on-surface-variant hover:text-primary"
      )}
    >
      <span className="mb-1">{icon}</span>
      <span className="font-serif text-[12px] tracking-[0.05em]">{label}</span>
    </NavLink>
  );
}
