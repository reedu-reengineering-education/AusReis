// components/AdminDashboard/DashboardCards.tsx
// Component: DashboardCards for displaying key metrics on the admin dashboard
import { getExpenses } from "@/lib/api/expenseClient";
import { Project } from "@prisma/client";
import { getProject } from "@/lib/api/projectClient";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DashboardCards() {
  const [projects, setProjects] = useState<Project[]>([]);

  const [openExpensesCount, setOpenExpensesCount] = useState(0);
  const [approvedExpensesCount, setApprovedExpensesCount] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const expenses = await getExpenses();
        const projects = await getProject();

        // Beispiel-Logik zum Zählen der
        // offenen und genehmigten Ausgaben
        const openExpenses = expenses.filter((expense: any) =>
          expense.status === "Pending" ? "OPEN" : "APPROVED"
        ).length;
        const approvedExpenses = expenses.filter(
          (expense: any) => expense.status === "APPROVED"
        ).length;

        setOpenExpensesCount(openExpenses);
        setApprovedExpensesCount(approvedExpenses);
        setProjects(projects);
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
          <p className="text-5xl font-bold">{projects.length}</p>
        </CardContent>
      </Card>
    </div>
  );
}
