import { LayoutDashboard, FileText, PlusCircle, BarChart3, Users, Settings, Shield, ChevronRight } from "lucide-react";
import { cn } from "@/react-app/lib/utils";
import { useCases } from "@/react-app/hooks/useCases";

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const NAV_GROUPS = [
  {
    label: "MAIN",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "cases", label: "All Cases", icon: FileText, badge: true },
      { id: "new", label: "File New FIR", icon: PlusCircle },
    ],
  },
  {
    label: "INTEL",
    items: [
      { id: "analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    label: "ADMIN",
    items: [
      { id: "officers", label: "Officers", icon: Users },
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
];

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const { cases } = useCases();
  const caseCount = cases.length;
  const urgentCount = cases.filter((c) => !c.assigned_to || c.priority === "High").length;

  return (
    <aside className="w-64 min-h-[calc(100vh-4rem)] bg-slate-900 flex flex-col shadow-xl">
      {/* Brand strip */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-700/60">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-[13px] font-bold text-white tracking-wide">CrimeTrack</p>
          <p className="text-[10px] text-slate-400 tracking-widest uppercase">Pro Edition</p>
        </div>
      </div>

      {/* Station info */}
      <div className="px-4 py-3 mx-3 mt-3 rounded-lg bg-slate-800/60 border border-slate-700/40">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Active Station</p>
        <p className="text-xs text-slate-200 font-semibold mt-0.5">Central Police Station</p>
        {urgentCount > 0 && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] text-red-400 font-medium">{urgentCount} urgent item{urgentCount !== 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id || (currentView === "case-details" && item.id === "cases");
                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative",
                      isActive
                        ? "bg-blue-600/20 text-blue-400 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-400 before:rounded-full"
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    )}
                  >
                    <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300")} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && caseCount > 0 && (
                      <span className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center",
                        isActive ? "bg-blue-500/30 text-blue-300" : "bg-slate-700 text-slate-300"
                      )}>
                        {caseCount}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3 h-3 text-blue-400/60 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/60">
        <div className="px-3 py-2 rounded-lg bg-slate-800/50">
          <p className="text-[10px] text-slate-500">System Status</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] text-emerald-400 font-medium">All systems operational</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
