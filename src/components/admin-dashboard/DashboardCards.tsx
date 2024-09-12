// components/AdminDashboard/DashboardCards.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DashboardCards() {
  // Dummy-Daten für die Karten
  const openExpensesCount = 2;
  const approvedExpensesCount = 3;
  const totalProjects = 5;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white">
        <CardHeader>
          <CardTitle>Open Expenses</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-24">
          <p className="text-5xl font-bold">{openExpensesCount}</p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-r from-green-400 to-teal-500 text-white">
        <CardHeader>
          <CardTitle>Approved Expenses</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-24">
          <p className="text-5xl font-bold">{approvedExpensesCount}</p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white">
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
