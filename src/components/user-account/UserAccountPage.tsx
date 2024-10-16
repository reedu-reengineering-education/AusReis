"use client";

import { useState, useEffect, SetStateAction } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DetailsModal } from "./DetailsModal";
import SharedExpenseTable from "./SharedExpenseTable";
import { BillsModal } from "./BillsModal";
import DashboardCardsUser from "@/components/user-account/DashboardCardsUser";
import {
  getExpenses,
  createExpense,
  deleteExpense,
} from "@/lib/api/expenseClient";
import { createFormData } from "@/helpers/fileUploadHelpers";
import { toast } from "react-toastify";

export default function UserAccountPage() {
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
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await getExpenses();
        setExpenses(data);

        const openExpenses = data.filter(
          (item: any) =>
            item.category === "reimbursement" && item.status === "OPEN"
        ).length;
        const approvedExpenses = data.filter(
          (item: any) =>
            item.category === "reimbursement" && item.status === "APPROVED"
        ).length;
        const rejectedExpenses = data.filter(
          (item: any) =>
            item.category === "reimbursement" && item.status === "REJECTED"
        ).length;
        const openTravels = data.filter(
          (item: any) => item.category === "travel" && item.status === "OPEN"
        ).length;
        const approvedTravels = data.filter(
          (item: any) =>
            item.category === "travel" && item.status === "APPROVED"
        ).length;
        const rejectedTravels = data.filter(
          (item: any) =>
            item.category === "travel" && item.status === "REJECTED"
        ).length;

        setOpenExpensesCount(openExpenses);
        setApprovedExpensesCount(approvedExpenses);
        setRejectedExpensesCount(rejectedExpenses);
        setOpenTravelsCount(openTravels);
        setApprovedTravelsCount(approvedTravels);
        setRejectedTravelsCount(rejectedTravels);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const handleViewDetails = (item: SetStateAction<null>) => {
    setSelectedItem(item);
    setShowDetails(true);
  };

  const handleViewBills = (item: SetStateAction<null>) => {
    setSelectedItem(item);
    setShowBills(true);
  };

  const handleAddNewClick = () => {
    setShowAddForm(true);
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      const uploadFormData = createFormData(
        formData.bills.map((bill: any) => bill.file)
      );

      const response = await fetch("/api/upload/files", {
        method: "POST",
        body: uploadFormData,
      });

      if (response.ok) {
        const responseData = await response.json();
        const newExpense = await createExpense(formData, responseData.data);
        setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
        toast.success(
          `${
            formData.category === "reimbursement" ? "Auslage" : "Reisekosten"
          } erfolgreich erstellt`
        );
      } else {
        throw new Error("Fehler beim Hochladen");
      }
    } catch (error) {
      console.error("Error creating expense:", error);
      toast.error(
        `Fehler beim Erstellen der ${
          formData.category === "reimbursement" ? "Auslage" : "Reisekosten"
        }`
      );
    }
  };

  const handleDelete = async (expenseId: string) => {
    try {
      await deleteExpense(expenseId);
      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense.id !== expenseId)
      );
      toast.success("Eintrag erfolgreich gelöscht");
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Fehler beim Löschen des Eintrags");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 w-full max-w-4xl">
      <Tabs
        value={activeTab}
        onValueChange={(value: string) =>
          setActiveTab(value as "dashboard" | "expenses" | "travel")
        }
        className="w-full"
      >
        <TabsList className="flex border-b">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="expenses">Auslagen</TabsTrigger>
          <TabsTrigger value="travel">Reisekosten</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <DashboardCardsUser
            openExpensesCount={openExpensesCount}
            approvedExpensesCount={approvedExpensesCount}
            rejectedExpensesCount={rejectedExpensesCount}
            openTravelsCount={openTravelsCount}
            approvedTravelsCount={approvedTravelsCount}
            rejectedTravelsCount={rejectedTravelsCount}
          />
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
            handleViewDetails={handleViewDetails}
            handleViewBills={handleViewBills}
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
            handleViewDetails={handleViewDetails}
            handleViewBills={handleViewBills}
            handleFormSubmit={handleFormSubmit}
            handleDelete={handleDelete}
          />
        </TabsContent>
      </Tabs>

      {showDetails && selectedItem && (
        <DetailsModal
          selectedItem={selectedItem}
          setShowDetails={setShowDetails}
        />
      )}

      {showBills && selectedItem && (
        <BillsModal selectedItem={selectedItem} setShowDetails={setShowBills} />
      )}
    </div>
  );
}
