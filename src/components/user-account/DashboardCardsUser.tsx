import { getExpenses } from "@/lib/api/expenseClient";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DashboardCards() {
  const [openExpensesCount, setOpenExpensesCount] = useState(0);
  const [approvedExpensesCount, setApprovedExpensesCount] = useState(0);
  const [rejectedExpensesCount, setRejectedExpensesCount] = useState(0);
  const [openTravelsCount, setOpenTravelsCount] = useState(0);
  const [approvedTravelsCount, setApprovedTravelsCount] = useState(0);
  const [rejectedTravelsCount, setRejectedTravelsCount] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const expenses = await getExpenses();

        const openExpenses = expenses.filter(
          (expense: { category: string; status: string }) =>
            expense.category === "reimbursement" && expense.status === "pending"
        ).length;

        const approvedExpenses = expenses.filter(
          (expense: { category: string; status: string }) =>
            expense.category === "reimbursement" &&
            expense.status === "approved"
        ).length;

        const rejectedExpenses = expenses.filter(
          (expense: { category: string; status: string }) =>
            expense.category === "reimbursement" &&
            expense.status === "rejected"
        ).length;

        const openTravels = expenses.filter(
          (expense: { category: string; status: string }) =>
            expense.category === "travel" && expense.status === "pending"
        ).length;

        const approvedTravels = expenses.filter(
          (expense: { category: string; status: string }) =>
            expense.category === "travel" && expense.status === "approved"
        ).length;

        const rejectedTravels = expenses.filter(
          (expense: { category: string; status: string }) =>
            expense.category === "travel" && expense.status === "rejected"
        ).length;

        setOpenExpensesCount(openExpenses);
        setApprovedExpensesCount(approvedExpenses);
        setRejectedExpensesCount(rejectedExpenses);
        setOpenTravelsCount(openTravels);
        setApprovedTravelsCount(approvedTravels);
        setRejectedTravelsCount(rejectedTravels);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }
    loadData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {/* Auslagen-Karte */}
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

      {/* Reisen-Karte */}
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
