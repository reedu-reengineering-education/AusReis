import { useState } from "react";
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

export default function ExpenseTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      user: "John Doe",
      project: "Project A",
      amount: 100,
      status: "Open",
    },
    {
      id: 2,
      user: "Jane Doe",
      project: "Project B",
      amount: 200,
      status: "Paid",
    },
    {
      id: 3,
      user: "Bob Smith",
      project: "Project C",
      amount: 150,
      status: "Pending",
    },
  ]);

  const handleApproveExpense = (id: number) => {
    const updatedExpenses = expenses.map((expense) =>
      expense.id === id ? { ...expense, status: "Paid" } : expense
    );
    setExpenses(updatedExpenses);
  };

  const handleRejectExpense = (id: number) => {
    const updatedExpenses = expenses.map((expense) =>
      expense.id === id ? { ...expense, status: "Rejected" } : expense
    );
    setExpenses(updatedExpenses);
  };

  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.project.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <TableCell>{expense.user}</TableCell>
              <TableCell>{expense.project}</TableCell>
              <TableCell>${expense.amount.toLocaleString()}</TableCell>
              <TableCell>
                <Badge
                  className={`${
                    expense.status === "Paid"
                      ? "bg-green-100 text-green-800"
                      : expense.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  } text-xs`}
                >
                  {expense.status}
                </Badge>
              </TableCell>
              <TableCell className="flex justify-end space-x-2">
                {expense.status === "Pending" || expense.status === "Open" ? (
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
