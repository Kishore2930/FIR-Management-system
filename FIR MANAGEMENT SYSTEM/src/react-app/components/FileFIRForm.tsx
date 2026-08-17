import { useState, useRef, useEffect } from "react";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Textarea } from "@/react-app/components/ui/textarea";
import { Label } from "@/react-app/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import { Upload, FileText, Loader2, Sparkles, X, AlertCircle, CheckCircle2, Scale } from "lucide-react";
import { Alert, AlertDescription } from "@/react-app/components/ui/alert";
import LegalSectionsPicker from "@/react-app/components/LegalSectionsPicker";
import { encodeSections } from "@/react-app/lib/legalSections";

export default function FileFIRForm() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionError, setExtractionError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedSectionIds, setSelectedSectionIds] = useState<string[]>([]);

  const [officers, setOfficers] = useState<{ name: string }[]>([]);

  const [formData, setFormData] = useState({
    complainant_name: "",
    complainant_address: "",
    complainant_phone: "",
    incident_subject: "",
    incident_description: "",
    incident_location: "",
    incident_date: "",
    incident_time: "",
    witnesses: "",
    suspect_info: "",
    property_involved: "",
    assigned_to: "",
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setExtractionError("");

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl("");
      }
    }
  };

  useEffect(() => {
    fetch("/api/officers")
      .then((res) => res.json())
      .then((data) => setOfficers(data))
      .catch((err) => console.error("Failed to fetch officers:", err));
  }, []);

  const handleExtractData = async () => {
    if (!uploadedFile) return;

    setIsExtracting(true);
    setExtractionError("");

    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);

      const response = await fetch("/api/ocr/extract-fir", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to extract data");
      }

      const extractedData = await response.json();
      setFormData(extractedData);
    } catch (error) {
      console.error("Extraction error:", error);
      setExtractionError("Failed to extract information from the document. Please fill the form manually.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setPreviewUrl("");
    setExtractionError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      const response = await fetch("/api/cases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          applicable_sections: encodeSections(selectedSectionIds),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit FIR");
      }

      await response.json();
      setSubmitSuccess(true);

      // Reset form after success
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitError("Failed to submit FIR. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">File New FIR</h2>
        <p className="text-sm text-muted-foreground">
          Upload a complaint letter or fill the form manually
        </p>
      </div>

      {/* Document Upload Section */}
      <Card className="border-2 border-dashed border-blue-200 bg-blue-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            AI-Powered Document Analysis
          </CardTitle>
          <CardDescription>
            Upload a complaint letter or document to automatically extract case details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!uploadedFile ? (
            <div
              className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 mx-auto text-slate-400 mb-4" />
              <p className="text-sm font-medium text-slate-700 mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, PNG, JPG up to 10MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-white rounded-lg border">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Document preview"
                    className="w-32 h-32 object-cover rounded border"
                  />
                ) : (
                  <div className="w-32 h-32 flex items-center justify-center bg-slate-100 rounded border">
                    <FileText className="w-12 h-12 text-slate-400" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{uploadedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadedFile.size / 1024).toFixed(2)} KB
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <Button
                      onClick={handleExtractData}
                      disabled={isExtracting}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      {isExtracting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Extracting Data...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Extract Information
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleRemoveFile}
                      disabled={isExtracting}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>

              {extractionError && (
                <Alert variant="destructive">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>{extractionError}</AlertDescription>
                </Alert>
              )}

              {submitSuccess && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    FIR filed successfully! Redirecting to cases...
                  </AlertDescription>
                </Alert>
              )}

              {submitError && (
                <Alert variant="destructive">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>{submitError}</AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* FIR Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Complainant Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="complainant_name">Complainant Name *</Label>
                <Input
                  id="complainant_name"
                  value={formData.complainant_name}
                  onChange={(e) => handleInputChange("complainant_name", e.target.value)}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="complainant_phone">Phone Number *</Label>
                <Input
                  id="complainant_phone"
                  value={formData.complainant_phone}
                  onChange={(e) => handleInputChange("complainant_phone", e.target.value)}
                  placeholder="Enter phone number"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="complainant_address">Address *</Label>
              <Textarea
                id="complainant_address"
                value={formData.complainant_address}
                onChange={(e) => handleInputChange("complainant_address", e.target.value)}
                placeholder="Enter complete address"
                rows={2}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Incident Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="incident_subject">Subject/Nature of Complaint *</Label>
              <Input
                id="incident_subject"
                value={formData.incident_subject}
                onChange={(e) => handleInputChange("incident_subject", e.target.value)}
                placeholder="Brief description of the incident"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="incident_description">Detailed Description *</Label>
              <Textarea
                id="incident_description"
                value={formData.incident_description}
                onChange={(e) => handleInputChange("incident_description", e.target.value)}
                placeholder="Provide a detailed account of the incident"
                rows={6}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="incident_date">Date of Incident *</Label>
                <Input
                  id="incident_date"
                  type="date"
                  value={formData.incident_date}
                  onChange={(e) => handleInputChange("incident_date", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="incident_time">Time of Incident *</Label>
                <Input
                  id="incident_time"
                  type="time"
                  value={formData.incident_time}
                  onChange={(e) => handleInputChange("incident_time", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="incident_location">Location of Incident *</Label>
              <Input
                id="incident_location"
                value={formData.incident_location}
                onChange={(e) => handleInputChange("incident_location", e.target.value)}
                placeholder="Enter location where incident occurred"
                required
              />
            </div>

            <div className="space-y-2 pt-2 border-t">
              <Label htmlFor="assigned_to" className="text-blue-600 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Assign Officer (Optional)
              </Label>
              <select
                id="assigned_to"
                value={formData.assigned_to || ""}
                onChange={(e) => handleInputChange("assigned_to", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">-- Leave Unassigned --</option>
                {officers.map((officer, index) => (
                  <option key={index} value={officer.name}>
                    {officer.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">Select an officer to immediately assign them to this case.</p>
            </div>
          </CardContent>
        </Card>

        {/* Legal Sections Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-600" />
              Applicable Sections &amp; Acts
            </CardTitle>
            <CardDescription>
              Select the BNS/IPC sections and special acts that apply to this case. Use the category tabs or search by section number.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LegalSectionsPicker
              selectedIds={selectedSectionIds}
              onChange={setSelectedSectionIds}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="witnesses">Witnesses (if any)</Label>
              <Textarea
                id="witnesses"
                value={formData.witnesses}
                onChange={(e) => handleInputChange("witnesses", e.target.value)}
                placeholder="Names and contact details of witnesses"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="suspect_info">Suspect Information (if any)</Label>
              <Textarea
                id="suspect_info"
                value={formData.suspect_info}
                onChange={(e) => handleInputChange("suspect_info", e.target.value)}
                placeholder="Description or details about suspects"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="property_involved">Property/Items Involved</Label>
              <Textarea
                id="property_involved"
                value={formData.property_involved}
                onChange={(e) => handleInputChange("property_involved", e.target.value)}
                placeholder="List any property or items involved in the incident"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button type="button" variant="outline" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Filing FIR...
              </>
            ) : (
              "File FIR"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
