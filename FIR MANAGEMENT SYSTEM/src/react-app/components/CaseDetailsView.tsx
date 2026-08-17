import { useState, useEffect } from "react";
import { useCase } from "@/react-app/hooks/useCases";
import { Badge } from "@/react-app/components/ui/badge";
import { Button } from "@/react-app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import { Separator } from "@/react-app/components/ui/separator";
import { Skeleton } from "@/react-app/components/ui/skeleton";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Home,
  FileText,
  Users,
  AlertTriangle,
  Package,
  Download,
  Edit,
  Trash2,
  Scale,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/react-app/components/ui/dialog";
import LegalSectionsPicker from "@/react-app/components/LegalSectionsPicker";
import { parseSections, encodeSections } from "@/react-app/lib/legalSections";

interface CaseDetailsViewProps {
  caseId: string;
  onBack: () => void;
}

export default function CaseDetailsView({ caseId, onBack }: CaseDetailsViewProps) {
  const { caseData, loading, error, refetchCase } = useCase(caseId);

  const [officers, setOfficers] = useState<{ name: string }[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editForm, setEditForm] = useState({
    status: "",
    priority: "",
    assigned_to: "",
    complainant_name: "",
    complainant_phone: "",
    complainant_address: "",
    incident_subject: "",
    incident_description: "",
    incident_location: "",
    incident_date: "",
    incident_time: "",
  });
  const [editSectionIds, setEditSectionIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch("/api/officers")
      .then(res => res.json())
      .then(data => setOfficers(data))
      .catch(err => console.error("Error fetching officers:", err));
  }, []);

  const openEditModal = () => {
    setEditForm({
      status: caseData?.status || "Pending Review",
      priority: caseData?.priority || "Medium",
      assigned_to: caseData?.assigned_to || "",
      complainant_name: caseData?.complainant_name || "",
      complainant_phone: caseData?.complainant_phone || "",
      complainant_address: caseData?.complainant_address || "",
      incident_subject: caseData?.incident_subject || "",
      incident_description: caseData?.incident_description || "",
      incident_location: caseData?.incident_location || "",
      incident_date: caseData?.incident_date || "",
      incident_time: caseData?.incident_time || "",
    });
    setEditSectionIds(parseSections(caseData?.applicable_sections || ""));
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!caseData) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/cases/${caseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editForm.status,
          priority: editForm.priority,
          assigned_to: editForm.assigned_to,
          complainant_name: editForm.complainant_name,
          complainant_phone: editForm.complainant_phone,
          complainant_address: editForm.complainant_address,
          incident_subject: editForm.incident_subject,
          incident_description: editForm.incident_description,
          incident_location: editForm.incident_location,
          incident_date: editForm.incident_date,
          incident_time: editForm.incident_time,
          applicable_sections: encodeSections(editSectionIds),
        }),
      });
      if (res.ok) {
        if (refetchCase) await refetchCase();
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!caseData || !window.confirm("Are you sure you want to completely delete this case? This action cannot be undone.")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/cases/${caseId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        onBack();
      }
    } catch (err) {
      console.error("Delete error:", err);
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">
          <p>Error loading case details</p>
          <Button onClick={onBack} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

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

  const handleDownload = () => {
    if (!caseData) return;

    const content = `CRIMETRACK PRO - FIR REPORT
=============================
FIR No: ${caseData.fir_number}
Status: ${caseData.status}
Priority: ${caseData.priority}

INCIDENT DETAILS
----------------
Subject: ${caseData.incident_subject}
Date: ${new Date(caseData.incident_date).toLocaleDateString("en-IN")} at ${caseData.incident_time}
Location: ${caseData.incident_location}
Description:
${caseData.incident_description}

COMPLAINANT INFORMATION
-----------------------
Name: ${caseData.complainant_name}
Phone: ${caseData.complainant_phone}
Address: ${caseData.complainant_address}

CASE MANAGEMENT
---------------
Assigned To: ${caseData.assigned_to || "Not assigned"}
Filed On: ${new Date(caseData.created_at).toLocaleDateString("en-IN")}

${caseData.witnesses ? `WITNESSES\n---------\n${caseData.witnesses}\n\n` : ''}${caseData.suspect_info ? `SUSPECT INFO\n------------\n${caseData.suspect_info}\n\n` : ''}${caseData.property_involved ? `PROPERTY INVOLVED\n-----------------\n${caseData.property_involved}\n\n` : ''}`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${caseData.fir_number}_Report.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cases
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {caseData.fir_number}
            </h2>
            <p className="text-sm text-muted-foreground">{caseData.incident_subject}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={getStatusColor(caseData.status)}>
            {caseData.status}
          </Badge>
          <Badge variant="outline" className={getPriorityColor(caseData.priority)}>
            {caseData.priority} Priority
          </Badge>
          <Button variant="outline" onClick={openEditModal} className="hover:bg-slate-50">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" onClick={handleDownload} className="hover:bg-blue-50 text-blue-600 border-blue-200 hover:border-blue-300">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" onClick={handleDelete} disabled={isDeleting} className="hover:bg-red-50 hover:text-red-700 text-red-600 border-red-200 hover:border-red-300 px-3">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Incident Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                Subject/Nature
              </h3>
              <p className="text-base">{caseData.incident_subject}</p>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                Detailed Description
              </h3>
              <p className="text-base leading-relaxed whitespace-pre-wrap">
                {caseData.incident_description}
              </p>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Date of Incident</p>
                  <p className="font-medium">
                    {new Date(caseData.incident_date).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Time of Incident</p>
                  <p className="font-medium">{caseData.incident_time}</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-medium">{caseData.incident_location}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Complainant Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="font-medium">{caseData.complainant_name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium">{caseData.complainant_phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Home className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="text-sm leading-relaxed">
                    {caseData.complainant_address}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Case Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Assigned To</p>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">
                      {caseData.assigned_to ? (
                        caseData.assigned_to
                      ) : (
                        <span className="text-red-600 italic">Unassigned</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Filed On</p>
                  <p className="font-medium">
                    {new Date(caseData.created_at).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {(caseData.witnesses || caseData.suspect_info || caseData.property_involved) && (
        <div className="grid grid-cols-3 gap-6">
          {caseData.witnesses && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Witnesses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {caseData.witnesses}
                </p>
              </CardContent>
            </Card>
          )}

          {caseData.suspect_info && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Suspect Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {caseData.suspect_info}
                </p>
              </CardContent>
            </Card>
          )}

          {caseData.property_involved && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Property Involved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {caseData.property_involved}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Charges & Applicable Sections */}
      <Card className="border-blue-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Scale className="w-5 h-5 text-blue-600" />
            Charges &amp; Applicable Sections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LegalSectionsPicker
            selectedIds={parseSections(caseData.applicable_sections || "")}
            onChange={() => { }}
            readOnly
          />
        </CardContent>
      </Card>

      {/* Edit Details Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Case Details</DialogTitle>
            <DialogDescription>
              Update the details for {caseData.fir_number}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-6">

            {/* Status & Assignment */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 border-b pb-2">Status & Assignment</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="Pending Review">Pending Review</option>
                    <option value="Under Investigation">Under Investigation</option>
                    <option value="Evidence Collection">Evidence Collection</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Priority</label>
                  <select
                    value={editForm.priority}
                    onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Assigned Officer</label>
                  <select
                    value={editForm.assigned_to}
                    onChange={(e) => setEditForm({ ...editForm, assigned_to: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">-- Unassigned --</option>
                    {officers.map(o => (
                      <option key={o.name} value={o.name}>{o.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Incident Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 border-b pb-2">Incident Details</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Subject</label>
                  <input
                    type="text"
                    value={editForm.incident_subject}
                    onChange={(e) => setEditForm({ ...editForm, incident_subject: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Description</label>
                  <textarea
                    value={editForm.incident_description}
                    onChange={(e) => setEditForm({ ...editForm, incident_description: e.target.value })}
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Date</label>
                    <input
                      type="date"
                      value={editForm.incident_date}
                      onChange={(e) => setEditForm({ ...editForm, incident_date: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Time</label>
                    <input
                      type="time"
                      value={editForm.incident_time}
                      onChange={(e) => setEditForm({ ...editForm, incident_time: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Location</label>
                    <input
                      type="text"
                      value={editForm.incident_location}
                      onChange={(e) => setEditForm({ ...editForm, incident_location: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Complainant Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 border-b pb-2">Complainant Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Name</label>
                  <input
                    type="text"
                    value={editForm.complainant_name}
                    onChange={(e) => setEditForm({ ...editForm, complainant_name: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Phone</label>
                  <input
                    type="text"
                    value={editForm.complainant_phone}
                    onChange={(e) => setEditForm({ ...editForm, complainant_phone: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Address</label>
                <input
                  type="text"
                  value={editForm.complainant_address}
                  onChange={(e) => setEditForm({ ...editForm, complainant_address: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>

          </div>
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
