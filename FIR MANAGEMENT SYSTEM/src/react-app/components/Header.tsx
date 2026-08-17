import { useState, useEffect } from "react";
import { Bell, LogOut, User, Settings, HelpCircle, Shield, ChevronDown } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/react-app/components/ui/dropdown-menu";
import { useAuth } from "@/react-app/contexts/AuthContext";
import { useNavigate } from "react-router";

const VIEW_LABELS: Record<string, string> = {
  dashboard: "Dashboard Overview",
  cases: "FIR Cases",
  new: "File New FIR",
  analytics: "Analytics",
  officers: "Officers",
  settings: "Settings",
  "case-details": "Case Details",
};

interface HeaderProps {
  currentView?: string;
}

export default function Header({ currentView }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });

  const viewLabel = currentView ? VIEW_LABELS[currentView] || currentView : "Dashboard";

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "OF";

  const roleColor = user?.role === "Inspector" ? "bg-amber-500" : "bg-blue-500";

  return (
    <header className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="flex h-16 items-center px-6 gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3 pr-4 border-r border-slate-200">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 shadow-md shadow-blue-200">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent leading-none">
              CrimeTrack Pro
            </h1>
            <p className="text-[10px] text-muted-foreground leading-none mt-0.5">FIR Management System</p>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
          <span className="text-slate-400">Home</span>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-700">{viewLabel}</span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Live Clock */}
        <div className="hidden lg:flex flex-col items-end mr-2">
          <span className="text-base font-bold font-mono text-slate-800 leading-none tabular-nums">
            {formatTime(time)}
          </span>
          <span className="text-[10px] text-muted-foreground mt-0.5">{formatDate(time)}</span>
        </div>

        {/* Separator */}
        <div className="hidden lg:block w-px h-8 bg-slate-200" />

        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-slate-100"
            onClick={() => setNotifOpen(!notifOpen)}
          >
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
          </Button>
          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-xl border shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b bg-slate-50 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-800">Notifications</p>
                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">3 new</span>
              </div>
              <div className="divide-y max-h-64 overflow-y-auto">
                {[
                  { text: "New FIR filed and awaiting review", time: "2 min ago", dot: "bg-blue-500" },
                  { text: "Case FIR-202602-001 marked High Priority", time: "15 min ago", dot: "bg-red-500" },
                  { text: "Officer Rajesh Kumar assigned to case", time: "1 hr ago", dot: "bg-green-500" },
                ].map((n, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer">
                    <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.dot}`} />
                    <div>
                      <p className="text-xs text-slate-700 font-medium leading-snug">{n.text}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t bg-slate-50">
                <button className="text-xs text-blue-600 font-medium hover:underline w-full text-center">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2 h-10 rounded-lg hover:bg-slate-100">
              <div className={`w-8 h-8 rounded-full ${roleColor} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                {initials}
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-semibold text-slate-800 leading-none">{user?.name || "Officer"}</span>
                <span className="text-[10px] text-muted-foreground leading-none mt-0.5">{user?.role || "Officer"}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60 shadow-xl rounded-xl">
            <DropdownMenuLabel className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${roleColor} flex items-center justify-center text-white text-sm font-bold`}>
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full text-white font-medium ${roleColor} mt-1 inline-block`}>
                    {user?.role || "Officer"}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <User className="w-4 h-4 text-muted-foreground" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <Settings className="w-4 h-4 text-muted-foreground" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <HelpCircle className="w-4 h-4 text-muted-foreground" />
              Help & Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
