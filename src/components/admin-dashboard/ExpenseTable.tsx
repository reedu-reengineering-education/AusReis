// Path: src/components/admin-dashboard/ExpenseTable.tsx
// Component: ExpenseTable for displaying expenses on the admin dashboard
"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchBar from "./SearchBar";
import ExpenseButtons from "./ExpenseButtons";
import type { ExpenseStatus } from "@prisma/client";
import { Expense, Bill, File } from "@prisma/client";
import { User } from "@prisma/client";
import { Project } from "@prisma/client";
import { getUsers } from "@/lib/api/userClient";

import {
  getExpenses,
  updateExpense,
  deleteExpense,
  getExpensesForAdmin,
} from "@/lib/api/expenseClient";
import { toast } from "react-toastify";
import axios from "axios";

export default function ExpenseTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expenses, setExpenses] = useState<
    (Expense & {
      user: User;
      project: Project;
      file: File;
      bills: (Bill & { files: File[] })[];
    })[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [isDeletingExpense, setIsDeletingExpense] = useState<{
    [key: string]: boolean;
  }>({});
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);

  useEffect(() => {
    // ... other effect logic

    const fetchUsers = async () => {
      try {
        const users = await getUsers();
        setAvailableUsers(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setIsLoading(true);
        const data = await getExpensesForAdmin();
        setExpenses(data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
        setError(
          error instanceof Error
            ? error
            : new Error("An unknown error occurred")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const filteredExpenses = expenses.filter((expense) => {
    if (activeTab !== "all" && expense.category !== activeTab) {
      return false;
    }

    if (searchTerm === "") {
      return true;
    }

    const searchLower = searchTerm.toLowerCase();
    return (
      expense.user?.name?.toLowerCase().includes(searchLower) ||
      false ||
      expense.project.name.toLowerCase().includes(searchLower) ||
      expense.amount.toString().includes(searchLower) ||
      expense.category.toLowerCase().includes(searchLower) ||
      expense.status.toLowerCase().includes(searchLower) ||
      (expense.description &&
        expense.description.toLowerCase().includes(searchLower))
    );
  });

  const handleStatusChange = async (
    expenseId: string,
    newStatus: ExpenseStatus
  ) => {
    try {
      await updateExpense(expenseId, newStatus);
      setExpenses((prevExpenses) =>
        prevExpenses.map((e) =>
          e.id === expenseId ? { ...e, status: newStatus } : e
        )
      );
    } catch (error) {
      console.error("Error updating expense status:", error);
      toast.error("Failed to update expense status. Please try again.");
    }
  };

  const handleDelete = async (expenseId: string) => {
    if (isDeletingExpense[expenseId]) return;

    setIsDeletingExpense((prev) => ({ ...prev, [expenseId]: true }));

    try {
      await deleteExpense(expenseId);
      setExpenses((prevExpenses) =>
        prevExpenses.filter((e) => e.id !== expenseId)
      );
      toast.success("Expense deleted successfully.");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.warn("Expense not found, it may have been already deleted");
        setExpenses((prevExpenses) =>
          prevExpenses.filter((e) => e.id !== expenseId)
        );
        toast.info("Expense was already deleted.");
      } else {
        console.error("Error deleting expense:", error);
        toast.error("Failed to delete expense. Please try again.");
      }
    } finally {
      setIsDeletingExpense((prev) => ({ ...prev, [expenseId]: false }));
    }
  };

  if (isLoading) {
    return <div>Loading expenses...</div>;
  }

  if (error) {
    return <div>Error loading expenses: {error.message}</div>;
  }

  return (
    <div className="flex">
      <Tabs
        orientation="vertical"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-48"
      >
        <TabsList className="flex flex-col h-full">
          <TabsTrigger value="all">All Expenses</TabsTrigger>
          <TabsTrigger value="travel">Travel</TabsTrigger>
          <TabsTrigger value="reimbursement">Reimbursement</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex-1 ml-4 ">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search expenses..."
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.user.name}</TableCell>
                <TableCell>{expense.project.name}</TableCell>
                <TableCell>{expense.amount.toLocaleString()} €</TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell>
                  <Badge
                    className={`${
                      expense.status === "paid"
                        ? "bg-green-100 text-green-800"
                        : expense.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    } text-xs`}
                  >
                    {expense.status}
                  </Badge>
                </TableCell>
                <TableCell className="flex justify-end space-x-2">
                  <ExpenseButtons
                    expenseId={expense.id}
                    status={expense.status}
                    onStatusChange={(newStatus) =>
                      handleStatusChange(expense.id, newStatus)
                    }
                    onDelete={() => handleDelete(expense.id)}
                    fileId={expense.bills?.[0]?.files?.[0]?.id}
                    fileName={expense.bills[0]?.files[0]?.filename || ""}
                    fileType={
                      expense.bills[0]?.files[0]?.mimeType?.startsWith("image/")
                        ? "image"
                        : "pdf"
                    }
                    description={expense.description || ""}
                    isDeleting={isDeletingExpense[expense.id]}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
