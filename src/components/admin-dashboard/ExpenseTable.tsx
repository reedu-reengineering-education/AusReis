"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SearchBar from "./SearchBar";
import type { ExpenseStatus } from "@prisma/client";

interface Expense {
  id: string;
  amount: number;
  description: string;
  status: ExpenseStatus;
  userId: string;
  projectId: string;
  createdAt: Date;
  category: string;
  fileId: string; // Added fileId property
}
import { getExpenses, updateExpense } from "@/lib/api/expenseClient";

const downloadFile = async (fileId: string) => {
  window.open(`/api/download/${fileId}`, "_blank");
};

export default function ExpenseTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Daten von der API laden
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setIsLoading(true);
        const data = await getExpenses();
        setExpenses(data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
        setError(error as any);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const handleApproveExpense = async (id: string) => {
    try {
      await updateExpense(id, undefined, undefined, undefined, "paid");
      setExpenses((prevExpenses) =>
        prevExpenses.map((expense: Expense) =>
          expense.id === id ? { ...expense, status: "paid" } : expense
        )
      );
    } catch (error) {
      console.error("Error approving expense:", error);
    }
  };

  const handleRejectExpense = async (id: string) => {
    try {
      await updateExpense(id, undefined, undefined, undefined, "rejected");
      setExpenses((prevExpenses) =>
        prevExpenses.map((expense) =>
          expense.id === id
            ? { ...expense, status: "rejected" as ExpenseStatus }
            : expense
        )
      );
    } catch (error) {
      console.error("Error rejecting expense:", error);
    }
  };

  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.projectId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div>Loading expenses...</div>;
  }

  if (error) {
    return <div>Error loading expenses: {error.message}</div>;
  }

  return (
    <div>
      <SearchBar
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredExpenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>{expense.userId}</TableCell>
              <TableCell>{expense.projectId}</TableCell>
              <TableCell>${expense.amount.toLocaleString()}</TableCell>
              <TableCell>
                <Badge
                  className={`${
                    expense.status === "paid"
                      ? "bg-green-100 text-green-800"
                      : expense.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  } text-xs`}
                >
                  {expense.status}
                </Badge>
              </TableCell>
              <TableCell className="flex justify-end space-x-2">
                {expense.status === "pending" ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleApproveExpense(expense.id)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRejectExpense(expense.id)}
                    >
                      Reject
                    </Button>
                  </>
                ) : null}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadFile(expense.fileId)}
                >
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadFile(expense.fileId)}
                >
                  Download
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
