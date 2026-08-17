import { useMemo } from "react";
import { BarChart3, TrendingUp, FileText, Clock, CheckCircle, AlertTriangle, Users, Activity } from "lucide-react";
import { useCases } from "@/react-app/hooks/useCases";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import { Badge } from "@/react-app/components/ui/badge";

export default function AnalyticsView() {
  const { cases, loading } = useCases();

  const stats = useMemo(() => {
    const total = cases.length;
    const pending = cases.filter((c) => c.status === "Pending Review").length;
    const active = cases.filter((c) => c.status === "Under Investigation").length;
    const evidence = cases.filter((c) => c.status === "Evidence Collection").length;
    const closed = cases.filter((c) => c.status === "Closed").length;
    const highPriority = cases.filter((c) => c.priority === "High").length;
    const medPriority = cases.filter((c) => c.priority === "Medium").length;
    const lowPriority = cases.filter((c) => c.priority === "Low").length;
    const unassigned = cases.filter((c) => !c.assigned_to).length;

    const resolutionRate = total > 0 ? Math.round((closed / total) * 100) : 0;

    // Officer assignment counts
    const officerMap: Record<string, number> = {};
    cases.forEach((c) => {
      if (c.assigned_to) officerMap[c.assigned_to] = (officerMap[c.assigned_to] || 0) + 1;
    });
    const officerStats = Object.entries(officerMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Monthly trend
    const monthMap: Record<string, number> = {};
    cases.forEach((c) => {
      const m = c.created_at?.slice(0, 7) || "Unknown";
      monthMap[m] = (monthMap[m] || 0) + 1;
    });
    const monthly = Object.entries(monthMap)
      .sort(([a], [b]) => b.localeCompare(a))
      .slice(0, 6)
      .reverse();

    // Location hot-spots
    const locMap: Record<string, number> = {};
    cases.forEach((c) => {
      if (c.incident_location) {
        const loc = c.incident_location.split(",")[0].trim();
        locMap[loc] = (locMap[loc] || 0) + 1;
      }
    });
    const hotspots = Object.entries(locMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

    return { total, pending, active, evidence, closed, highPriority, medPriority, lowPriority, unassigned, resolutionRate, officerStats, monthly, hotspots };
  }, [cases]);

  if (loading) {
    return (
      <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-40 rounded-2xl bg-slate-100 animate-pulse" />
        ))}
      </div>
    );
  }

  const BigBar = ({ label, value, max, color }: { label: string; value: number; max: number; color: string }) => {
    const pct = max > 0 ? Math.max((value / max) * 100, value > 0 ? 3 : 0) : 0;
    return (
      <div className="space-y-1.5">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-slate-700">{label}</span>
          <span className="text-muted-foreground tabular-nums">{value} ({stats.total > 0 ? Math.round((value / stats.total) * 100) : 0}%)</span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    );
  };

  const DonutRing = ({ value, max, color, label, sub }: { value: number; max: number; color: string; label: string; sub: string }) => {
    const pct = max > 0 ? (value / max) * 100 : 0;
    const r = 30;
    const circ = 2 * Math.PI * r;
    const dash = (pct / 100) * circ;
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-20 h-20">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r={r} fill="none" stroke="#f1f5f9" strokeWidth="8" />
            <circle
              cx="40" cy="40" r={r} fill="none"
              stroke={color} strokeWidth="8"
              strokeDasharray={`${dash} ${circ}`}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-extrabold text-slate-800 leading-none">{value}</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-700">{label}</p>
          <p className="text-xs text-muted-foreground">{sub}</p>
        </div>
      </div>
    );
  };

  const maxMonthly = Math.max(...stats.monthly.map(([, c]) => c), 1);
  const maxOfficer = Math.max(...stats.officerStats.map((o) => o.count), 1);

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          Analytics Dashboard
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Comprehensive overview of FIR cases and system metrics</p>
      </div>

      {/* ── Insight KPIs ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Cases", value: stats.total, icon: FileText, color: "from-blue-500 to-indigo-600" },
          { label: "Resolution Rate", value: `${stats.resolutionRate}%`, icon: CheckCircle, color: "from-emerald-500 to-green-600" },
          { label: "High Priority", value: stats.highPriority, icon: AlertTriangle, color: "from-red-500 to-rose-600" },
          { label: "Unassigned", value: stats.unassigned, icon: Users, color: "from-amber-500 to-orange-600" },
        ].map((k) => (
          <div key={k.label} className="flex items-center gap-4 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${k.color} flex items-center justify-center shadow-md shrink-0`}>
              <k.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900 tabular-nums">{k.value}</p>
              <p className="text-xs text-muted-foreground font-medium">{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Status + Priority ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Bar Chart */}
        <Card className="shadow-sm border-slate-100">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              Cases by Status
            </CardTitle>
            <CardDescription>Breakdown of all cases across workflow stages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <BigBar label="Under Investigation" value={stats.active} max={stats.total} color="bg-gradient-to-r from-blue-400 to-indigo-500" />
            <BigBar label="Pending Review" value={stats.pending} max={stats.total} color="bg-gradient-to-r from-amber-400 to-orange-500" />
            <BigBar label="Evidence Collection" value={stats.evidence} max={stats.total} color="bg-gradient-to-r from-violet-400 to-purple-500" />
            <BigBar label="Closed" value={stats.closed} max={stats.total} color="bg-gradient-to-r from-emerald-400 to-green-500" />
          </CardContent>
        </Card>

        {/* Priority Donuts */}
        <Card className="shadow-sm border-slate-100">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-rose-500" />
              Priority Breakdown
            </CardTitle>
            <CardDescription>Distribution of cases by urgency level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-around items-center py-4">
              <DonutRing value={stats.highPriority} max={stats.total} color="#ef4444" label="High" sub="Critical cases" />
              <DonutRing value={stats.medPriority} max={stats.total} color="#f59e0b" label="Medium" sub="Standard cases" />
              <DonutRing value={stats.lowPriority} max={stats.total} color="#94a3b8" label="Low" sub="Routine cases" />
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {[{ l: "High", c: "bg-red-500" }, { l: "Medium", c: "bg-amber-400" }, { l: "Low", c: "bg-slate-400" }].map((t) => (
                <div key={t.l} className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${t.c}`} />
                  <span className="text-xs text-muted-foreground">{t.l}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Monthly Bar Chart ── */}
      {stats.monthly.length > 0 && (
        <Card className="shadow-sm border-slate-100">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-violet-500" />
              Monthly FIR Filings
            </CardTitle>
            <CardDescription>Number of cases filed per month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4 h-36">
              {stats.monthly.map(([month, count]) => {
                const hPct = Math.max((count / maxMonthly) * 100, count > 0 ? 5 : 0);
                const label = new Date(month + "-01").toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
                return (
                  <div key={month} className="flex flex-col items-center gap-1 flex-1 h-full">
                    <span className="text-xs font-bold text-slate-700">{count}</span>
                    <div className="w-full flex-1 flex items-end">
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 via-indigo-500 to-violet-400 transition-all duration-700 shadow-sm"
                        style={{ height: `${hPct}%` }}
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

      {/* ── Officers + Hotspots ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Officer Performance */}
        <Card className="shadow-sm border-slate-100">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-500" />
              Officer Assignment
            </CardTitle>
            <CardDescription>Cases assigned per officer</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.officerStats.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No cases assigned yet.</p>
            ) : (
              <div className="space-y-4">
                {stats.officerStats.slice(0, 6).map((o, idx) => {
                  const initials = o.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
                  const colors = ["from-blue-500 to-indigo-600", "from-emerald-500 to-green-600", "from-violet-500 to-purple-600", "from-amber-500 to-orange-600", "from-rose-500 to-red-600", "from-cyan-500 to-teal-600"];
                  return (
                    <div key={o.name} className="space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${colors[idx % colors.length]} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                          {initials}
                        </div>
                        <span className="text-sm font-medium text-slate-700 flex-1 truncate">{o.name}</span>
                        <Badge variant="outline" className="text-xs font-bold text-blue-700 border-blue-200 bg-blue-50">{o.count}</Badge>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${colors[idx % colors.length]} transition-all duration-700`}
                          style={{ width: `${(o.count / maxOfficer) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                {stats.unassigned > 0 && (
                  <div className="pt-2 border-t mt-2 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Unassigned cases</span>
                    <Badge variant="outline" className="text-xs font-bold text-red-600 border-red-200 bg-red-50">{stats.unassigned}</Badge>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Incident Hotspots */}
        <Card className="shadow-sm border-slate-100">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              Incident Hotspots
            </CardTitle>
            <CardDescription>Top locations with most reported incidents</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.hotspots.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Insufficient location data.</p>
            ) : (
              <div className="space-y-3">
                {stats.hotspots.map(([loc, count], i) => (
                  <div key={loc} className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${i === 0 ? "bg-red-500" : i === 1 ? "bg-orange-400" : "bg-slate-400"}`}>
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700 truncate">{loc}</span>
                        <span className="text-xs text-muted-foreground">{count} case{count !== 1 ? "s" : ""}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${i === 0 ? "bg-red-400" : i === 1 ? "bg-orange-300" : "bg-slate-300"}`}
                          style={{ width: `${(count / stats.hotspots[0][1]) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
