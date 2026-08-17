import { useState, useEffect } from "react";

export interface FIRCase {
  id: number;
  fir_number: string;
  complainant_name: string;
  complainant_address: string;
  complainant_phone: string;
  incident_subject: string;
  incident_description: string;
  incident_location: string;
  incident_date: string;
  incident_time: string;
  witnesses: string;
  suspect_info: string;
  property_involved: string;
  applicable_sections: string;
  status: string;
  priority: string;
  assigned_to: string;
  created_at: string;
  updated_at: string;
}

export function useCases() {
  const [cases, setCases] = useState<FIRCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/cases");
      if (!response.ok) throw new Error("Failed to fetch cases");
      const data = await response.json();
      setCases(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  return { cases, loading, error, refetch: fetchCases };
}

export function useCase(id: string) {
  const [caseData, setCaseData] = useState<FIRCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCase = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/cases/${id}`);
      if (!response.ok) throw new Error("Failed to fetch case");
      const data = await response.json();
      setCaseData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCase();
  }, [id]);

  return { caseData, loading, error, refetchCase: fetchCase };
}
