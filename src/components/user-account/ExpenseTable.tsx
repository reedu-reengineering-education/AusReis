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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AddFormModal } from "./AddFormModal";
import { getExpenses, createExpense } from "@/lib/api/expenseClient"; // API Funktionen

interface ExpensesTableProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  debouncedSearchTerm: string;
  handleAddNewClick: () => void;
  handleViewDetails: (item: any) => void;
  handleViewBills: (item: any) => void;
}

export default function ExpensesTable({
  searchTerm,
  setSearchTerm,
  debouncedSearchTerm,
  handleAddNewClick,
  handleViewDetails,
  handleViewBills,
}: ExpensesTableProps) {
  const [filteredExpenses, setFilteredExpenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Abrufen der Daten aus der API
  useEffect(() => {
    const fetchExpenses = async () => {
      setIsLoading(true);
      try {
        const expensesData = await getExpenses();
        setFilteredExpenses(expensesData);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // Filtern der Daten basierend auf der Suche
  useEffect(() => {
    if (filteredExpenses.length > 0) {
      const filtered = filteredExpenses.filter(
        (item) =>
          item.title
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          item.project.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
      setFilteredExpenses(filtered);
    }
  }, [debouncedSearchTerm, filteredExpenses]);

  // Handler für das Erstellen einer neuen Auslage
  const handleFormSubmit = async (formData: any) => {
    try {
      const newExpense = await createExpense(
        formData.amount,
        formData.description,
        formData.projectId,
        formData.userId,
        formData.category,
        formData.bills
      );
      setFilteredExpenses((prevExpenses) => [...prevExpenses, newExpense]);
    } catch (error) {
      console.error("Error creating expense:", error);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <Input
          placeholder="Suchen nach Auslagen oder Projekten..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-background"
        />
        <AddFormModal
          activeTab="expenses"
          setShowAddForm={handleAddNewClick}
          handleFormSubmit={handleFormSubmit}
        />
      </div>

      {isLoading ? (
        <p>Laden...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titel</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Datum</TableHead>
              <TableHead>Betrag</TableHead>
              <TableHead>Projekt</TableHead>
              <TableHead>
                <span className="sr-only">Aktionen</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.title}</TableCell>
                <TableCell>
                  <Badge
                    className={`${
                      item.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : item.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    } text-xs`}
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>{item.submissionDate}</TableCell>
                <TableCell>${item.amount.toLocaleString()}</TableCell>
                <TableCell>{item.project}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(item)}
                    >
                      Ansehen
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewBills(item)}
                    >
                      Rechnungen
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
