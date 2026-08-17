import { useState } from "react";
import Header from "@/react-app/components/Header";
import Sidebar from "@/react-app/components/Sidebar";
import DashboardView from "@/react-app/components/DashboardView";
import CasesList from "@/react-app/components/CasesList";
import FileFIRForm from "@/react-app/components/FileFIRForm";
import CaseDetailsView from "@/react-app/components/CaseDetailsView";
import AnalyticsView from "@/react-app/components/AnalyticsView";
import OfficersView from "@/react-app/components/OfficersView";
import SettingsView from "@/react-app/components/SettingsView";

export default function Home() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  const handleViewCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setCurrentView("case-details");
  };

  const handleBackToCases = () => {
    setSelectedCaseId(null);
    setCurrentView("cases");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50/20 to-slate-100 flex flex-col">
      <Header currentView={currentView} />
      <div className="flex flex-1">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        <main className="flex-1 overflow-y-auto">
          {currentView === "dashboard" && (
            <DashboardView onViewCase={handleViewCase} onViewChange={setCurrentView} />
          )}
          {currentView === "cases" && <CasesList onViewCase={handleViewCase} />}
          {currentView === "new" && <FileFIRForm />}
          {currentView === "analytics" && <AnalyticsView />}
          {currentView === "officers" && <OfficersView />}
          {currentView === "settings" && <SettingsView />}
          {currentView === "case-details" && selectedCaseId && (
            <CaseDetailsView caseId={selectedCaseId} onBack={handleBackToCases} />
          )}
        </main>
      </div>
    </div>
  );
}
