import React from "react";
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
import DeleteButtonExpenseModal from "@/components/user-account/DeleteButtonExpenseModal";
import { Expense } from "@prisma/client";

interface SharedExpenseTableProps {
  category: "reimbursement" | "travel";
  expenses: any[];
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  handleAddNewClick: () => void;
  handleViewDetails: (item: any) => void;

  handleFormSubmit: (formData: any) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
}

export default function SharedExpenseTable({
  category,
  expenses,
  isLoading,
  searchTerm,
  setSearchTerm,
  handleAddNewClick,
  handleViewDetails,

  handleFormSubmit,
  handleDelete,
}: SharedExpenseTableProps) {
  const filteredResults = expenses.filter(
    (item: any) =>
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <Input
          placeholder={`Suchen nach ${
            category === "reimbursement" ? "Auslagen" : "Reisekosten"
          } oder Projekten...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-background"
        />
        <AddFormModal
          activeTab={category === "reimbursement" ? "expenses" : "travel"}
          setShowAddForm={handleAddNewClick}
          handleFormSubmit={handleFormSubmit}
        />
      </div>

      {isLoading ? (
        <p>
          Lade {category === "reimbursement" ? "Auslagen" : "Reisekosten"}...
        </p>
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
            {filteredResults.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.description}</TableCell>
                <TableCell>
                  <Badge
                    className={`${
                      item.status === "paid"
                        ? "bg-green-100 text-green-800"
                        : item.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    } text-xs`}
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(item.createdAt).toLocaleDateString("de-DE", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell>{item.amount.toLocaleString()} €</TableCell>
                <TableCell>{item.project.name}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(item)}
                    >
                      Ansehen
                    </Button>
                    <DeleteButtonExpenseModal
                      expense={item as unknown as Expense}
                      onDelete={() => handleDelete(item.id)}
                      onDeleteSuccess={() => {}}
                      onClose={() => {}}
                    />
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
