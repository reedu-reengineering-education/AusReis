"use client";

import { useState, useEffect, SetStateAction } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import SharedExpenseTable from "./SharedExpenseTable";

import DashboardCardsUser from "@/components/user-account/DashboardCardsUser";
import {
  getExpenses,
  createExpense,
  deleteExpense,
} from "@/lib/api/expenseClient";
import { toast } from "react-toastify";

export default function UserAccountPage() {
  console.log("UserAccountPage: Component rendering");

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "expenses" | "travel"
  >("dashboard");
  const [showDetails, setShowDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBills, setShowBills] = useState(false);
  const [openExpensesCount, setOpenExpensesCount] = useState(0);
  const [approvedExpensesCount, setApprovedExpensesCount] = useState(0);
  const [rejectedExpensesCount, setRejectedExpensesCount] = useState(0);
  const [openTravelsCount, setOpenTravelsCount] = useState(0);
  const [approvedTravelsCount, setApprovedTravelsCount] = useState(0);
  const [rejectedTravelsCount, setRejectedTravelsCount] = useState(0);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("UserAccountPage: searchTerm effect triggered", { searchTerm });
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    console.log("UserAccountPage: Data loading effect triggered");
    async function loadData() {
      setIsLoading(true);
      try {
        console.log("UserAccountPage: Fetching expenses");
        const data = await getExpenses();
        console.log("UserAccountPage: Expenses fetched", { data });
        setExpenses(data);

        const openExpenses = data.filter(
          (item: any) =>
            item.category === "reimbursement" && item.status === "pending"
        ).length;
        const approvedExpenses = data.filter(
          (item: any) =>
            item.category === "reimbursement" && item.status === "processed"
        ).length;
        const rejectedExpenses = data.filter(
          (item: any) =>
            item.category === "reimbursement" && item.status === "paid"
        ).length;
        const openTravels = data.filter(
          (item: any) => item.category === "travel" && item.status === "pending"
        ).length;
        const approvedTravels = data.filter(
          (item: any) =>
            item.category === "travel" && item.status === "processed"
        ).length;
        const rejectedTravels = data.filter(
          (item: any) => item.category === "travel" && item.status === "paid"
        ).length;

        console.log("UserAccountPage: Expense counts calculated", {
          openExpenses,
          approvedExpenses,
          rejectedExpenses,
          openTravels,
          approvedTravels,
          rejectedTravels,
        });

        setOpenExpensesCount(openExpenses);
        setApprovedExpensesCount(approvedExpenses);
        setRejectedExpensesCount(rejectedExpenses);
        setOpenTravelsCount(openTravels);
        setApprovedTravelsCount(approvedTravels);
        setRejectedTravelsCount(rejectedTravels);
      } catch (error) {
        console.error("UserAccountPage: Error loading data:", error);
      } finally {
        setIsLoading(false);
        console.log("UserAccountPage: Data loading completed");
      }
    }

    loadData();
  }, []);

  const handleViewDetails = (item: SetStateAction<null>) => {
    console.log("UserAccountPage: View details triggered", { item });
    setSelectedItem(item);
    setShowDetails(true);
  };

  const handleAddNewClick = () => {
    console.log("UserAccountPage: Add new clicked");
    setShowAddForm(true);
  };

  const handleFormSubmit = async (formData: any) => {
    console.log(
      "UserAccountPage: Form submit triggered",
      JSON.stringify(formData, null, 2)
    );
    try {
      const processedFormData = {
        ...formData,
        bills: formData.bills.map((bill: any) => ({
          fileId: bill.fileId,
          amount: bill.amount,
        })),
        grossAmount: formData.grossAmount,
        netAmount: formData.netAmount,
      };

      console.log(
        "UserAccountPage: Processed form data",
        JSON.stringify(processedFormData, null, 2)
      );

      const newExpense = await createExpense(processedFormData);
      console.log(
        "UserAccountPage: New expense created",
        JSON.stringify(newExpense, null, 2)
      );

      setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
      toast.success(
        `${
          formData.category === "reimbursement" ? "Auslage" : "Reisekosten"
        } erfolgreich erstellt`
      );
    } catch (error) {
      console.error("UserAccountPage: Error creating expense:", error);
      toast.error(
        `Fehler beim Erstellen der ${
          formData.category === "reimbursement" ? "Auslage" : "Reisekosten"
        }: ${(error as any).response?.data?.error || (error as any).message}`
      );
    }
  };

  const handleDelete = async (expenseId: string) => {
    console.log("UserAccountPage: Delete expense triggered", { expenseId });
    try {
      await deleteExpense(expenseId);
      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense.id !== expenseId)
      );
      console.log("UserAccountPage: Expense deleted successfully");
      toast.success("Eintrag erfolgreich gelöscht");
    } catch (error) {
      console.error("UserAccountPage: Error deleting expense:", error);
      toast.error("Fehler beim Löschen des Eintrags");
    }
  };

  console.log("UserAccountPage: Rendering component", {
    activeTab,
    expenses,
    isLoading,
    showDetails,
    showBills,
  });

  return (
    <div className="grid grid-cols-1 gap-6 w-full max-w-4xl">
      <Tabs
        value={activeTab}
        onValueChange={(value: string) => {
          console.log("UserAccountPage: Tab changed", { newTab: value });
          setActiveTab(value as "dashboard" | "expenses" | "travel");
        }}
        className="w-full"
      >
        <TabsList className="flex border-b">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="expenses">Auslagen</TabsTrigger>
          <TabsTrigger value="travel">Reisekosten</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <DashboardCardsUser />
        </TabsContent>

        <TabsContent value="expenses">
          <SharedExpenseTable
            category="reimbursement"
            expenses={expenses.filter(
              (item) => item.category === "reimbursement"
            )}
            isLoading={isLoading}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleAddNewClick={handleAddNewClick}
            handleFormSubmit={handleFormSubmit}
            handleDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="travel">
          <SharedExpenseTable
            category="travel"
            expenses={expenses.filter((item) => item.category === "travel")}
            isLoading={isLoading}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleAddNewClick={handleAddNewClick}
            handleFormSubmit={handleFormSubmit}
            handleDelete={handleDelete}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
