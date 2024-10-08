"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Expense } from "@prisma/client";

interface ExpenseDeleteDialogProps {
  expense: Expense;
  onDelete: (id: string) => Promise<void>;
  onDeleteSuccess: (id: string, message: string) => void;
  onClose: () => void;
}

export function ExpenseDeleteDialog({
  expense,
  onDelete,
  onDeleteSuccess,
  onClose,
}: ExpenseDeleteDialogProps): JSX.Element {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleDelete = async () => {
    try {
      await onDelete(expense.id as string);
      onDeleteSuccess(expense.id as string, "Expense deleted successfully.");
      toast.success(`Expense "${expense.description}" deleted successfully.`);
      onClose();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error deleting the project", error);
      toast.error(
        `Failed to delete project "${expense.description}". Please try again.`
      );
    }
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild onClick={() => setIsDialogOpen(true)}>
        <Button variant="destructive" size="sm">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            expense "{expense?.description}".
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
export default ExpenseDeleteDialog;
