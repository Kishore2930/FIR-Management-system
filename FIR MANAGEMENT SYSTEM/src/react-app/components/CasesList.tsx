import { useState, useEffect, useMemo } from "react";
import { useCases } from "@/react-app/hooks/useCases";
import { Badge } from "@/react-app/components/ui/badge";
import { Button } from "@/react-app/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/react-app/components/ui/table";
import { Input } from "@/react-app/components/ui/input";
import { Skeleton } from "@/react-app/components/ui/skeleton";
import { Search, Eye, Download, UserPlus, FileText, X, SlidersHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/react-app/components/ui/dialog";

interface CasesListProps {
  onViewCase: (caseId: string) => void;
}

const STATUS_OPTIONS = [
  "Under Investigation",
  "Pending Review",
  "Evidence Collection",
  "Closed",
];

const PRIORITY_OPTIONS = ["High", "Medium", "Low"];

export default function CasesList({ onViewCase }: CasesListProps) {
  const { cases, loading, error, refetch } = useCases();

  // ----- Filter State -----
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [assignmentFilter, setAssignmentFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // ----- Quick Assign State -----
  const [officers, setOfficers] = useState<{ name: string }[]>([]);
  const [assigningCase, setAssigningCase] = useState<any>(null);
  const [selectedOfficer, setSelectedOfficer] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    fetch("/api/officers")
      .then((res) => res.json())
      .then((data) => setOfficers(data))
      .catch((err) => console.error("Error fetching officers:", err));
  }, []);

  // ----- Derived filtered cases -----
  const filteredCases = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return cases.filter((c) => {
      // Text search across key fields
      if (q) {
        const haystack = [
          c.fir_number,
          c.complainant_name,
          c.incident_subject,
          c.incident_location,
          c.incident_description,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      // Status filter
      if (statusFilter && c.status !== statusFilter) return false;

      // Priority filter
      if (priorityFilter && c.priority !== priorityFilter) return false;

      // Assignment filter
      if (assignmentFilter === "assigned" && !c.assigned_to) return false;
      if (assignmentFilter === "unassigned" && c.assigned_to) return false;

      // Date range filter
      if (dateFrom && c.incident_date < dateFrom) return false;
      if (dateTo && c.incident_date > dateTo) return false;

      return true;
    });
  }, [cases, searchQuery, statusFilter, priorityFilter, assignmentFilter, dateFrom, dateTo]);

  const hasActiveFilters =
    searchQuery || statusFilter || priorityFilter || assignmentFilter || dateFrom || dateTo;

  const activeFilterCount = [
    searchQuery,
    statusFilter,
    priorityFilter,
    assignmentFilter,
    dateFrom || dateTo,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setPriorityFilter("");
    setAssignmentFilter("");
    setDateFrom("");
    setDateTo("");
  };

  // ----- Quick Assign handlers -----
  const openAssignModal = (firCase: any) => {
    setAssigningCase(firCase);
    setSelectedOfficer(firCase.assigned_to || "");
  };

  const handleQuickAssign = async () => {
    if (!assigningCase) return;
    setIsAssigning(true);
    try {
      const res = await fetch(`/api/cases/${assigningCase.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: assigningCase.status,
          priority: assigningCase.priority,
          assigned_to: selectedOfficer,
        }),
      });
      if (res.ok) {
        if (refetch) await refetch();
        setAssigningCase(null);
      }
    } catch (err) {
      console.error("Assign error:", err);
    } finally {
      setIsAssigning(false);
    }
  };

  // ----- Colour helpers -----
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Under Investigation":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Pending Review":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Evidence Collection":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "Closed":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-300";
      case "Medium":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "Low":
        return "bg-slate-100 text-slate-800 border-slate-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // ----- Shared select class -----
  const selectClass =
    "flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  // ----- Loading / Error states -----
  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">
          <p>Error loading cases: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">FIR Cases</h2>
          <p className="text-sm text-muted-foreground">Manage and track all filed cases</p>
        </div>
      </div>

      {/* ── Filter Toolbar ── */}
      <div className="bg-white rounded-lg border shadow-sm p-4 space-y-3">
        {/* Row 1: Search + quick dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by FIR #, complainant, subject or location…"
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={selectClass}
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Priority */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className={selectClass}
          >
            <option value="">All Priorities</option>
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          {/* Assignment */}
          <select
            value={assignmentFilter}
            onChange={(e) => setAssignmentFilter(e.target.value)}
            className={selectClass}
          >
            <option value="">All Assignments</option>
            <option value="assigned">Assigned</option>
            <option value="unassigned">Unassigned</option>
          </select>

          {/* Clear button */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="shrink-0 text-red-600 border-red-300 hover:bg-red-50"
            >
              <X className="w-3.5 h-3.5 mr-1" />
              Clear filters
              {activeFilterCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-red-100 text-red-700 text-xs font-bold w-5 h-5">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          )}
        </div>

        {/* Row 2: Date range */}
        <div className="flex flex-wrap items-center gap-3">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="text-sm text-muted-foreground">Incident date:</span>
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">From</label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="h-9 w-40"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">To</label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="h-9 w-40"
            />
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold">FIR Number</TableHead>
              <TableHead className="font-semibold">Complainant</TableHead>
              <TableHead className="font-semibold">Subject</TableHead>
              <TableHead className="font-semibold">Location</TableHead>
              <TableHead className="font-semibold">Date &amp; Time</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Priority</TableHead>
              <TableHead className="font-semibold">Assigned To</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                  {hasActiveFilters
                    ? "No cases match your current filters."
                    : "No cases found. Start by filing a new FIR."}
                </TableCell>
              </TableRow>
            ) : (
              filteredCases.map((firCase) => (
                <TableRow key={firCase.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-mono font-semibold text-blue-700">
                    {firCase.fir_number}
                  </TableCell>
                  <TableCell className="font-medium">{firCase.complainant_name}</TableCell>
                  <TableCell className="max-w-xs truncate">{firCase.incident_subject}</TableCell>
                  <TableCell className="text-muted-foreground">{firCase.incident_location}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(firCase.incident_date).toLocaleDateString()} {firCase.incident_time}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(firCase.status)}>
                      {firCase.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getPriorityColor(firCase.priority)}>
                      {firCase.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {firCase.assigned_to ? (
                      <span className="font-medium text-slate-700">{firCase.assigned_to}</span>
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                        Unassigned
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!firCase.assigned_to && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => openAssignModal(firCase)}
                          title="Assign Officer"
                        >
                          <UserPlus className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewCase(String(firCase.id))}
                        title="View Case Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Download FIR">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          Showing{" "}
          <span className="font-semibold text-slate-700">{filteredCases.length}</span>
          {hasActiveFilters && (
            <> of <span className="font-semibold text-slate-700">{cases.length}</span></>
          )}{" "}
          case{filteredCases.length !== 1 ? "s" : ""}
          {hasActiveFilters && " (filtered)"}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>

      {/* ── Quick Assign Dialog ── */}
      <Dialog
        open={!!assigningCase}
        onOpenChange={(open) => !open && setAssigningCase(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Officer to Case</DialogTitle>
            <DialogDescription>
              Select an available officer to handle {assigningCase?.fir_number}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {assigningCase?.incident_subject}
                </p>
                <p className="text-xs text-muted-foreground">
                  Complainant: {assigningCase?.complainant_name}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="officer-select" className="text-sm font-medium text-slate-700">
                Select Officer
              </label>
              <select
                id="officer-select"
                value={selectedOfficer}
                onChange={(e) => setSelectedOfficer(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">-- Leave Unassigned --</option>
                {officers.map((o) => (
                  <option key={o.name} value={o.name}>
                    {o.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-2">
            <Button variant="outline" onClick={() => setAssigningCase(null)}>
              Cancel
            </Button>
            <Button onClick={handleQuickAssign} disabled={isAssigning}>
              {isAssigning ? "Assigning..." : "Assign Case"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
