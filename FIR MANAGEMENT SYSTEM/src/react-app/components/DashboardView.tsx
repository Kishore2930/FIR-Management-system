import { useMemo } from "react";
import { useCases } from "@/react-app/hooks/useCases";
import {
    FileText, Clock, CheckCircle, AlertTriangle, TrendingUp,
    Users, PlusCircle, Eye, UserCheck, Activity, ArrowUpRight,
    ArrowDownRight, Minus,
} from "lucide-react";
import { Badge } from "@/react-app/components/ui/badge";
import { Button } from "@/react-app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/react-app/components/ui/card";

interface DashboardViewProps {
    onViewCase: (id: string) => void;
    onViewChange: (view: string) => void;
}

function StatCard({
    title, value, subtitle, icon: Icon, gradient, trend,
}: {
    title: string;
    value: number;
    subtitle: string;
    icon: React.ElementType;
    gradient: string;
    trend?: "up" | "down" | "neutral";
}) {
    const TrendIcon = trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus;
    const trendColor = trend === "up" ? "text-emerald-600 bg-emerald-50" : trend === "down" ? "text-red-500 bg-red-50" : "text-slate-500 bg-slate-100";

    return (
        <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 group">
            <div className={`absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity ${gradient}`} />
            <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${gradient} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                    {trend && (
                        <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-full ${trendColor}`}>
                            <TrendIcon className="w-3 h-3" />
                            Live
                        </span>
                    )}
                </div>
                <p className="text-3xl font-extrabold text-slate-900 tabular-nums">{value}</p>
                <p className="text-sm font-semibold text-slate-700 mt-1">{title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
            </div>
        </div>
    );
}

function MiniProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
    const pct = max > 0 ? Math.round((value / max) * 100) : 0;
    return (
        <div className="flex items-center gap-2 w-full">
            <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                <div className={`h-1.5 rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs text-muted-foreground tabular-nums w-8 text-right">{value}</span>
        </div>
    );
}

export default function DashboardView({ onViewCase, onViewChange }: DashboardViewProps) {
    const { cases, loading } = useCases();

    const stats = useMemo(() => {
        const total = cases.length;
        const active = cases.filter((c) => c.status === "Under Investigation").length;
        const pending = cases.filter((c) => c.status === "Pending Review").length;
        const evidence = cases.filter((c) => c.status === "Evidence Collection").length;
        const closed = cases.filter((c) => c.status === "Closed").length;
        const highPriority = cases.filter((c) => c.priority === "High").length;
        const unassigned = cases.filter((c) => !c.assigned_to).length;

        // Officer workload
        const officerMap: Record<string, number> = {};
        cases.forEach((c) => {
            if (c.assigned_to) {
                officerMap[c.assigned_to] = (officerMap[c.assigned_to] || 0) + 1;
            }
        });
        const officerWorkload = Object.entries(officerMap)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Monthly breakdown
        const monthMap: Record<string, number> = {};
        cases.forEach((c) => {
            const month = c.created_at?.slice(0, 7) || "Unknown";
            monthMap[month] = (monthMap[month] || 0) + 1;
        });
        const monthlyTrend = Object.entries(monthMap)
            .sort(([a], [b]) => b.localeCompare(a))
            .slice(0, 6)
            .reverse();

        return { total, active, pending, evidence, closed, highPriority, unassigned, officerWorkload, monthlyTrend };
    }, [cases]);

    const recentCases = cases.slice(0, 6);

    const getStatusBg = (status: string) => {
        switch (status) {
            case "Under Investigation": return "bg-blue-100 text-blue-700 border-blue-200";
            case "Pending Review": return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "Evidence Collection": return "bg-purple-100 text-purple-700 border-purple-200";
            case "Closed": return "bg-green-100 text-green-700 border-green-200";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getPriorityDot = (p: string) => {
        if (p === "High") return "bg-red-500";
        if (p === "Medium") return "bg-orange-400";
        return "bg-slate-400";
    };

    if (loading) {
        return (
            <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-36 rounded-2xl bg-slate-100 animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 max-w-[1400px]">
            {/* ── Page Title ── */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-900">Dashboard Overview</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">Welcome back — here's today's situation at a glance.</p>
                </div>
                <Button onClick={() => onViewChange("new")} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200 gap-2">
                    <PlusCircle className="w-4 h-4" />
                    File New FIR
                </Button>
            </div>

            {/* ── Unassigned Alert ── */}
            {stats.unassigned > 0 && (
                <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-amber-800">
                            {stats.unassigned} case{stats.unassigned !== 1 ? "s" : ""} unassigned
                        </p>
                        <p className="text-xs text-amber-600">Please assign officers to ensure timely investigation.</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => onViewChange("cases")} className="border-amber-300 text-amber-700 hover:bg-amber-100 shrink-0">
                        View Cases
                    </Button>
                </div>
            )}

            {/* ── KPI Cards ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="Total Cases" value={stats.total} subtitle="All time FIRs filed" icon={FileText} gradient="bg-gradient-to-br from-blue-500 to-indigo-600" trend="neutral" />
                <StatCard title="Under Investigation" value={stats.active} subtitle="Currently active" icon={Activity} gradient="bg-gradient-to-br from-violet-500 to-purple-600" trend="up" />
                <StatCard title="Pending Review" value={stats.pending} subtitle="Awaiting action" icon={Clock} gradient="bg-gradient-to-br from-amber-500 to-orange-600" trend="neutral" />
                <StatCard title="Closed Cases" value={stats.closed} subtitle="Successfully resolved" icon={CheckCircle} gradient="bg-gradient-to-br from-emerald-500 to-green-600" trend="up" />
            </div>

            {/* ── Second Row ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="High Priority" value={stats.highPriority} subtitle="Requires immediate attention" icon={AlertTriangle} gradient="bg-gradient-to-br from-red-500 to-rose-600" trend="down" />
                <StatCard title="Evidence Collection" value={stats.evidence} subtitle="In evidence phase" icon={TrendingUp} gradient="bg-gradient-to-br from-cyan-500 to-teal-600" trend="neutral" />
                <StatCard title="Unassigned Cases" value={stats.unassigned} subtitle="No officer assigned yet" icon={Users} gradient="bg-gradient-to-br from-slate-500 to-slate-700" trend={stats.unassigned > 0 ? "down" : "neutral"} />
            </div>

            {/* ── Quick Actions ── */}
            <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { label: "File New FIR", icon: PlusCircle, view: "new", color: "from-blue-500 to-indigo-600", light: "bg-blue-50 hover:bg-blue-100 border-blue-200", text: "text-blue-700" },
                        { label: "Browse All Cases", icon: FileText, view: "cases", color: "from-slate-500 to-slate-700", light: "bg-slate-50 hover:bg-slate-100 border-slate-200", text: "text-slate-700" },
                        { label: "View Analytics", icon: TrendingUp, view: "analytics", color: "from-violet-500 to-purple-600", light: "bg-purple-50 hover:bg-purple-100 border-purple-200", text: "text-purple-700" },
                        { label: "Manage Officers", icon: UserCheck, view: "officers", color: "from-emerald-500 to-green-600", light: "bg-emerald-50 hover:bg-emerald-100 border-emerald-200", text: "text-emerald-700" },
                    ].map((a) => (
                        <button
                            key={a.view}
                            onClick={() => onViewChange(a.view)}
                            className={`flex items-center gap-3 p-4 rounded-xl border ${a.light} transition-all duration-150 group cursor-pointer`}
                        >
                            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${a.color} flex items-center justify-center shadow-sm`}>
                                <a.icon className="w-4 h-4 text-white" />
                            </div>
                            <span className={`text-sm font-semibold ${a.text}`}>{a.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Main Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Cases */}
                <Card className="lg:col-span-2 shadow-sm border-slate-100">
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                        <div>
                            <CardTitle className="text-base font-bold">Recent Cases</CardTitle>
                            <CardDescription>Latest filed FIR cases</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => onViewChange("cases")} className="gap-1.5 text-xs">
                            <Eye className="w-3.5 h-3.5" />
                            View all
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-50">
                            {recentCases.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-8">No cases filed yet.</p>
                            ) : (
                                recentCases.map((c) => (
                                    <div key={c.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50/70 transition-colors">
                                        <div className={`w-2 h-2 rounded-full shrink-0 ${getPriorityDot(c.priority)}`} />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-mono font-bold text-blue-600">{c.fir_number}</span>
                                                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${getStatusBg(c.status)}`}>
                                                    {c.status}
                                                </Badge>
                                            </div>
                                            <p className="text-sm font-medium text-slate-800 truncate mt-0.5">{c.incident_subject}</p>
                                            <p className="text-xs text-muted-foreground truncate">{c.complainant_name} · {c.incident_location}</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onViewCase(String(c.id))}
                                            className="shrink-0 h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Officer Workload */}
                <Card className="shadow-sm border-slate-100">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-bold">Officer Workload</CardTitle>
                        <CardDescription>Cases per assigned officer</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats.officerWorkload.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">No cases assigned yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {stats.officerWorkload.map((o) => {
                                    const initials = o.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
                                    return (
                                        <div key={o.name} className="space-y-1.5">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                                                    {initials}
                                                </div>
                                                <span className="text-sm font-medium text-slate-700 flex-1 truncate">{o.name}</span>
                                                <span className="text-xs text-muted-foreground">{o.count} case{o.count !== 1 ? "s" : ""}</span>
                                            </div>
                                            <MiniProgressBar
                                                value={o.count}
                                                max={Math.max(...stats.officerWorkload.map((x) => x.count))}
                                                color="bg-gradient-to-r from-blue-500 to-indigo-500"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {stats.unassigned > 0 && (
                            <div className="mt-4 pt-4 border-t">
                                <div className="flex items-center gap-2">
                                    <span className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-[10px] font-bold shrink-0">?</span>
                                    <span className="text-sm text-muted-foreground flex-1">Unassigned</span>
                                    <span className="text-xs text-red-500 font-semibold">{stats.unassigned}</span>
                                </div>
                                <MiniProgressBar value={stats.unassigned} max={stats.total} color="bg-red-400" />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* ── Monthly Trend ── */}
            {stats.monthlyTrend.length > 1 && (
                <Card className="shadow-sm border-slate-100">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-bold">Monthly Case Trend</CardTitle>
                        <CardDescription>FIR filings per month (last 6 months)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-3 h-28">
                            {stats.monthlyTrend.map(([month, count]) => {
                                const maxCount = Math.max(...stats.monthlyTrend.map(([, c]) => c), 1);
                                const heightPct = Math.max((count / maxCount) * 100, 8);
                                const label = new Date(month + "-01").toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
                                return (
                                    <div key={month} className="flex flex-col items-center gap-1 flex-1">
                                        <span className="text-xs font-semibold text-slate-700">{count}</span>
                                        <div className="w-full relative rounded-t-md overflow-hidden bg-slate-100 flex-1 flex items-end">
                                            <div
                                                className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-md transition-all duration-700"
                                                style={{ height: `${heightPct}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] text-muted-foreground font-medium">{label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
