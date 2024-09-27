// components/AdminDashboard/DashboardCards.tsx
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Beispiel-API-Aufruf zum Laden der Projektdaten
async function fetchProjects() {
  const response = await fetch("/api/projects");
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
  const [totalProjects, setTotalProjects] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchProjects();
        const sortedProjects = sortProjects(data); // Projekte sortieren

        // Beispiel-Logik zum Zählen der offenen und genehmigten Ausgaben
        const openExpenses = sortedProjects.filter(
          (project: { status: string }) => project.status === "OPEN"
        ).length;
        const approvedExpenses = sortedProjects.filter(
          (project: { status: string }) => project.status === "APPROVED"
        ).length;

        setOpenExpensesCount(openExpenses);
        setApprovedExpensesCount(approvedExpenses);
        setTotalProjects(sortedProjects.length);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }

    loadData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      <Card className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-50 hover:scale-[1.1] transition-transform duration-200 shadow-lg shadow-purple-500 text-white">
        <CardHeader>
          <CardTitle>Open Expenses</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-24">
          <p className="text-5xl font-bold">{openExpensesCount}</p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-r from-red-500 via-orange-400 to-orange-500 opacity-50 hover:scale-[1.1] transition-transform duration-200 shadow-lg shadow-red-400 text-white">
        <CardHeader>
          <CardTitle>Approved Expenses</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-24">
          <p className="text-5xl font-bold">{approvedExpensesCount}</p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-r from-orange-400 via-red-300 to-purple-400  opacity-50 hover:scale-[1.1] transition-transform duration-200 shadow-lg shadow-orange-500 text-white">
        <CardHeader>
          <CardTitle>Total Projects</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-24">
          <p className="text-5xl font-bold">{totalProjects}</p>
        </CardContent>
      </Card>
    </div>
  );
}
