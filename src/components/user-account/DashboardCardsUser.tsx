import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Beispiel-API-Aufruf zum Laden der Projektdaten
async function fetchProjects() {
  const response = await fetch("/api/expenses");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

// Funktion zum Sortieren der Projekte
function sortProjects(projects: any[]) {
  // Beispiel-Sortierlogik (nach Name sortieren)
  return projects.sort((a, b) => a.name.localeCompare(b.name));
}

export default function DashboardCards() {
  const [openExpensesCount, setOpenExpensesCount] = useState(0);
  const [approvedExpensesCount, setApprovedExpensesCount] = useState(0);
  const [openTravelsCount, setOpenTravelsCount] = useState(0);
  const [approvedTravelsCount, setApprovedTravelsCount] = useState(0);
  const [rejectedExpensesCount, setRejectedExpensesCount] = useState(0);
  const [rejectedTravelsCount, setRejectedTravelsCount] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchProjects();
        const sortedProjects = sortProjects(data); // Projekte sortieren

        // Beispiel-Logik zum Zählen der offenen und genehmigten Ausgaben
        const openExpenses = sortedProjects.filter(
          (project: { type: string; status: string }) =>
            project.type === "EXPENSE" && project.status === "OPEN"
        ).length;
        const approvedExpenses = sortedProjects.filter(
          (project: { type: string; status: string }) =>
            project.type === "EXPENSE" && project.status === "APPROVED"
        ).length;

        // Beispiel-Logik zum Zählen der offenen und genehmigten Reisen
        const openTravels = sortedProjects.filter(
          (project: { type: string; status: string }) =>
            project.type === "TRAVEL" && project.status === "OPEN"
        ).length;
        const approvedTravels = sortedProjects.filter(
          (project: { type: string; status: string }) =>
            project.type === "TRAVEL" && project.status === "APPROVED"
        ).length;

        const rejectedExpenses = sortedProjects.filter(
          (project: { type: string; status: string }) =>
            project.type === "EXPENSE" && project.status === "OPEN"
        ).length;
        const rejectedTravels = sortedProjects.filter(
          (project: { type: string; status: string }) =>
            project.type === "TRAVEL" && project.status === "OPEN"
        ).length;

        setOpenExpensesCount(openExpenses);
        setApprovedExpensesCount(approvedExpenses);
        setOpenTravelsCount(openTravels);
        setApprovedTravelsCount(approvedTravels);
        setRejectedExpensesCount(rejectedExpenses);
        setRejectedTravelsCount(rejectedTravels);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }

    loadData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <Card className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-50 text-white">
        <CardHeader>
          <CardTitle>Expenses</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center h-24">
          <p className="text-2xl">Open: {openExpensesCount}</p>
          <p className="text-2xl">Approved: {approvedExpensesCount}</p>
          <p className="text-2xl">Rejected: {rejectedExpensesCount}</p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-r from-blue-400 to-indigo-500 opacity-50 text-white">
        <CardHeader>
          <CardTitle>Travels</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center h-24">
          <p className="text-2xl">Open: {openTravelsCount}</p>
          <p className="text-2xl">Approved: {approvedTravelsCount}</p>
          <p className="text-2xl">Rejected: {rejectedTravelsCount}</p>
        </CardContent>
      </Card>
    </div>
  );
}
