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
import { expenses } from "../../../data"; // Importiere die Daten
import { AddFormModal } from "./AddFormModal";

interface ExpensesTableProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  debouncedSearchTerm: string;
  handleAddNewClick: () => void;
  handleViewDetails: (item: any) => void;
}

export default function ExpensesTable({
  searchTerm,
  setSearchTerm,
  debouncedSearchTerm,
  handleAddNewClick,
  handleViewDetails,
}: ExpensesTableProps) {
  const [filteredExpenses, setFilteredExpenses] = useState(expenses);

  useEffect(() => {
    const filtered = expenses.filter(
      (item) =>
        item.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        item.project.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
    setFilteredExpenses(filtered);
  }, [debouncedSearchTerm]);

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
          setShowAddForm={() => {}}
          handleFormSubmit={handleAddNewClick}
        />
      </div>

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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(item)}
                >
                  Ansehen
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}