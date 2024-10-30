// Path: src/components/admin/DashboardCardsAdmin.tsx
// Component: DashboardCards for displaying statistics on the admin dashboard
import { getExpenses } from "@/lib/api/expenseClient";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DashboardCards() {
  const [openExpensesCount, setOpenExpensesCount] = useState(0);
  const [processedExpensesCount, setProcessedExpensesCount] = useState(0);
  const [paidExpensesCount, setPaidExpensesCount] = useState(0);
  const [openTravelsCount, setOpenTravelsCount] = useState(0);
  const [processedTravelsCount, setProcessedTravelsCount] = useState(0);
  const [paidTravelsCount, setPaidTravelsCount] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const expenses = await getExpenses();

        const openExpenses = expenses.filter(
          (expense: { category: string; status: string }) =>
            expense.category === "reimbursement" && expense.status === "pending"
        ).length;

        const processedExpenses = expenses.filter(
          (expense: { category: string; status: string }) =>
            expense.category === "reimbursement" &&
            expense.status === "processed"
        ).length;

        const paidExpenses = expenses.filter(
          (expense: { category: string; status: string }) =>
            expense.category === "reimbursement" && expense.status === "paid"
        ).length;

        const openTravels = expenses.filter(
          (expense: { category: string; status: string }) =>
            expense.category === "travel" && expense.status === "pending"
        ).length;

        const processedTravels = expenses.filter(
          (expense: { category: string; status: string }) =>
            expense.category === "travel" && expense.status === "processed"
        ).length;

        const paidTravels = expenses.filter(
          (expense: { category: string; status: string }) =>
            expense.category === "travel" && expense.status === "paid"
        ).length;

        setOpenExpensesCount(openExpenses);
        setProcessedExpensesCount(processedExpenses);
        setPaidExpensesCount(paidExpenses);
        setOpenTravelsCount(openTravels);
        setProcessedTravelsCount(processedTravels);
        setPaidTravelsCount(paidTravels);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }
    loadData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {/* Auslagen-Karte */}
      <Card className="bg-gradient-to-r from-red-500 via-orange-400 to-orange-500 opacity-50 hover:scale-[1.1] transition-transform duration-200 shadow-lg shadow-red-400 text-white">
        <CardHeader>
          <CardTitle>Expenses</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center h-24">
          <p className="text-2xl">Open: {openExpensesCount}</p>
          <p className="text-2xl">Processed: {processedExpensesCount}</p>
          <p className="text-2xl">Paid: {paidExpensesCount}</p>
        </CardContent>
      </Card>

      {/* Reisen-Karte */}
      <Card className="bg-gradient-to-r from-orange-400 via-red-300 to-purple-400  opacity-50 hover:scale-[1.1] transition-transform duration-200 shadow-lg shadow-orange-500 text-white">
        <CardHeader>
          <CardTitle>Travels</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center h-24">
          <p className="text-2xl">Open: {openTravelsCount}</p>
          <p className="text-2xl">Processed: {processedTravelsCount}</p>
          <p className="text-2xl">Paid: {paidTravelsCount}</p>
        </CardContent>
      </Card>
    </div>
  );
}
