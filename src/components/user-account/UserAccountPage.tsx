"use client";

import { useState, useEffect, SetStateAction } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DetailsModal } from "./DetailsModal";
import { AddFormModal } from "./AddFormModal";
import TravelTable from "./TravelTable";
import ExpensesTable from "./ExpenseTable";
import { BillsModal } from "./BillsModal"; // Importiere die BillsModal Komponente
import DashboardCardsUser from "@/components/user-account/DashboardCardsUser";

export default function UserAccountPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "expenses" | "travel"
  >("dashboard");
  const [showDetails, setShowDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBills, setShowBills] = useState(false); // Zustand für BillsModal

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

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

  const handleFormSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setShowAddForm(false);
  };

  return (
    <div className="grid grid-cols-1 gap-6 w-full max-w-4xl">
      {/* Tabs für verschiedene Bereiche des Benutzer-Accounts */}
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
          <DashboardCardsUser />
        </TabsContent>

        <TabsContent value="expenses">
          <ExpensesTable
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            debouncedSearchTerm={debouncedSearchTerm}
            handleAddNewClick={handleAddNewClick}
            handleViewDetails={handleViewDetails}
            handleViewBills={handleViewBills} // Übergib die Funktion zum Anzeigen der Rechnungen
          />
        </TabsContent>

        <TabsContent value="travel">
          <TravelTable
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            debouncedSearchTerm={debouncedSearchTerm}
            handleAddNewClick={handleAddNewClick}
            handleViewDetails={handleViewDetails}
            handleViewBills={handleViewBills} // Übergib die Funktion zum Anzeigen der Rechnungen
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
        <BillsModal
          selectedItem={selectedItem}
          setShowDetails={setShowBills} // Verwende setShowBills zum Schließen des BillsModal
        />
      )}

      {showAddForm && (activeTab === "expenses" || activeTab === "travel") && (
        <AddFormModal
          setShowAddForm={setShowAddForm}
          handleFormSubmit={handleFormSubmit}
          activeTab={activeTab}
        />
      )}
    </div>
  );
}
