import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import { Users, Shield, Mail, Phone, Briefcase, Award, Activity, Edit } from "lucide-react";
import { Avatar, AvatarFallback } from "@/react-app/components/ui/avatar";
import { Badge } from "@/react-app/components/ui/badge";
import { Button } from "@/react-app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/react-app/components/ui/dialog";

interface Officer {
  id: number;
  name: string;
  badge: string;
  role: string;
  department: string;
  phone: string;
  email: string;
  cases: number;
  status: string;
}

export default function OfficersView() {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    badge: "",
    role: "",
    department: "",
    phone: "",
    status: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchOfficers = () => {
    fetch("/api/officers")
      .then((res) => res.json())
      .then((data) => {
        setOfficers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch officers:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOfficers();
  }, []);

  const handleSelectOfficer = (officer: Officer | null) => {
    setSelectedOfficer(officer);
    setIsEditing(false);
    if (officer) {
      setEditForm({
        name: officer.name,
        badge: officer.badge,
        role: officer.role,
        department: officer.department,
        phone: officer.phone,
        status: officer.status,
      });
    }
  };

  const handleSave = async () => {
    if (!selectedOfficer) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/officers/${selectedOfficer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        // Refetch to update the list, then update the selected officer details
        fetch("/api/officers")
          .then((r) => r.json())
          .then((data) => {
            setOfficers(data);
            const updated = data.find((o: Officer) => o.id === selectedOfficer.id);
            if (updated) setSelectedOfficer(updated);
            setIsEditing(false);
          });
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-300";
      case "OnLeave":
      case "On Leave":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-6 h-6" />
          Officers Directory
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage and view police officers in the system
        </p>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="text-center p-8 text-muted-foreground">Loading officers...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Total Officers</p>
                    <p className="text-2xl font-bold">{officers.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-green-50 text-green-600 p-3 rounded-lg">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Active Officers</p>
                    <p className="text-2xl font-bold">
                      {officers.filter((o) => o.status === "Active").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-purple-50 text-purple-600 p-3 rounded-lg">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Total Assigned Cases</p>
                    <p className="text-2xl font-bold">
                      {officers.reduce((sum, o) => sum + o.cases, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Officers Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {officers.map((officer) => (
              <Card
                key={officer.id}
                className="hover:shadow-md transition-shadow cursor-pointer border-transparent hover:border-blue-200"
                onClick={() => handleSelectOfficer(officer)}
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Avatar className="w-14 h-14">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold flex items-center justify-center">
                        {getInitials(officer.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{officer.name}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{officer.role}</p>
                        </div>
                        <Badge
                          variant={officer.status === "Active" ? "default" : "secondary"}
                          className={
                            officer.status === "Active"
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-gray-100 text-gray-700"
                          }
                        >
                          {officer.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Badge:</span>
                    <span className="text-muted-foreground">{officer.badge}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Department:</span>
                    <span className="text-muted-foreground">{officer.department}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{officer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{officer.email}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Assigned Cases</span>
                      <span className="font-semibold text-blue-600">{officer.cases} cases</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Dialog open={!!selectedOfficer} onOpenChange={(open) => !open && handleSelectOfficer(null)}>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
              {selectedOfficer && (
                <>
                  <DialogHeader>
                    <div className="flex justify-between items-start pr-8">
                      <DialogTitle className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border shadow-sm">
                          <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold flex items-center justify-center">
                            {getInitials(selectedOfficer.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-lg">{selectedOfficer.name}</div>
                          <div className="text-sm font-normal text-muted-foreground mt-1">Badge: {selectedOfficer.badge}</div>
                        </div>
                      </DialogTitle>
                      {!isEditing && (
                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          <Edit className="w-4 h-4 mr-1" /> Edit
                        </Button>
                      )}
                    </div>
                    <DialogDescription className="sr-only">
                      Detailed profile of {selectedOfficer.name}
                    </DialogDescription>
                  </DialogHeader>

                  {isEditing ? (
                    <div className="py-4 space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Name</label>
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">Role</label>
                          <input
                            type="text"
                            value={editForm.role}
                            onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">Badge</label>
                          <input
                            type="text"
                            value={editForm.badge}
                            onChange={(e) => setEditForm(prev => ({ ...prev, badge: e.target.value }))}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Department</label>
                        <input
                          type="text"
                          value={editForm.department}
                          onChange={(e) => setEditForm(prev => ({ ...prev, department: e.target.value }))}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">Phone</label>
                          <input
                            type="text"
                            value={editForm.phone}
                            onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">Duty Status</label>
                          <select
                            value={editForm.status}
                            onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <option value="Active">Active</option>
                            <option value="On Leave">On Leave</option>
                            <option value="Suspended">Suspended</option>
                            <option value="Retired">Retired</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                        <Button variant="outline" onClick={() => {
                          setIsEditing(false);
                          handleSelectOfficer(selectedOfficer); // Reset form
                        }}>
                          Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={isSaving}>
                          {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-4 py-4">
                      <div className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center gap-2 text-slate-700">
                          <Award className="w-5 h-5 text-blue-600" />
                          <span className="font-medium">Role</span>
                        </div>
                        <span>{selectedOfficer.role}</span>
                      </div>
                      <div className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center gap-2 text-slate-700">
                          <Shield className="w-5 h-5 text-blue-600" />
                          <span className="font-medium">Department</span>
                        </div>
                        <span>{selectedOfficer.department}</span>
                      </div>
                      <div className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center gap-2 text-slate-700">
                          <Mail className="w-5 h-5 text-blue-600" />
                          <span className="font-medium">Email</span>
                        </div>
                        <a href={`mailto:${selectedOfficer.email}`} className="text-blue-600 hover:underline">{selectedOfficer.email}</a>
                      </div>
                      <div className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center gap-2 text-slate-700">
                          <Phone className="w-5 h-5 text-blue-600" />
                          <span className="font-medium">Phone</span>
                        </div>
                        <a href={`tel:${selectedOfficer.phone}`} className="text-blue-600 hover:underline">{selectedOfficer.phone}</a>
                      </div>
                      <div className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center gap-2 text-slate-700">
                          <Briefcase className="w-5 h-5 text-blue-600" />
                          <span className="font-medium">Active Cases</span>
                        </div>
                        <span className="font-semibold bg-slate-100 px-3 py-1 rounded-full">{selectedOfficer.cases || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-700">
                          <Activity className="w-5 h-5 text-blue-600" />
                          <span className="font-medium">Duty Status</span>
                        </div>
                        <Badge variant="outline" className={getStatusColor(selectedOfficer.status)}>
                          {selectedOfficer.status}
                        </Badge>
                      </div>
                    </div>
                  )}
                </>
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
