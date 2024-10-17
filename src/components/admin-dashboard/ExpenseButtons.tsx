// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { toast } from "react-toastify";
// import { updateExpense, deleteExpense } from "@/lib/api/expenseClient";
// import { ExpenseStatus } from "@prisma/client";
// import ViewExpenseModal from "./ViewExpenseModal";

// interface ExpenseButtonsProps {
//   expenseId: string;
//   status: ExpenseStatus;
//   onStatusChange: (newStatus: ExpenseStatus) => void;
//   onDelete: () => void;
//   fileUrl: string;
//   fileName: string;
//   fileType: "image" | "pdf";
// }

// export default function ExpenseButtons({
//   expenseId,
//   status,
//   onStatusChange,
//   onDelete,
//   fileUrl,
//   fileName,
//   fileType,
// }: ExpenseButtonsProps) {
//   const [isLoading, setIsLoading] = useState(false);

//   const handleStatusChange = async (newStatus: ExpenseStatus) => {
//     setIsLoading(true);
//     try {
//       const updatedExpense = await updateExpense(expenseId, newStatus);
//       onStatusChange(updatedExpense.status);
//       toast.success(`Expense ${newStatus}. The expense has been ${newStatus}.`);
//     } catch (error) {
//       console.error(`Error updating expense status:`, error);
//       toast.error(
//         `Error: There was an error updating the expense status. Please try again.`
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     setIsLoading(true);
//     try {
//       await deleteExpense(expenseId);
//       onDelete();
//       toast.success(
//         "Expense deleted. The expense has been successfully deleted."
//       );
//     } catch (error) {
//       console.error("Error deleting expense:", error);
//       toast.error(
//         "Error: There was an error deleting the expense. Please try again."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex space-x-2">
//       {status === "pending" && (
//         <>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => handleStatusChange("processed")}
//             disabled={isLoading}
//           >
//             {isLoading ? "Processing..." : "Process"}
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => handleStatusChange("paid")}
//             disabled={isLoading}
//           >
//             {isLoading ? "Paying..." : "Pay"}
//           </Button>
//         </>
//       )}
//       {status === "processed" && (
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => handleStatusChange("paid")}
//           disabled={isLoading}
//         >
//           {isLoading ? "Paying..." : "Pay"}
//         </Button>
//       )}
//       <ViewExpenseModal
//         expenseId={expenseId}
//         fileUrl={fileUrl}
//         fileName={fileName}
//         fileType={fileType}
//       />
//       <Button
//         variant="outline"
//         size="sm"
//         onClick={handleDelete}
//         disabled={isLoading}
//       >
//         {isLoading ? "Deleting..." : "Delete"}
//       </Button>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { updateExpense, deleteExpense } from "@/lib/api/expenseClient";
import { ExpenseStatus } from "@prisma/client";
import ViewExpenseModal from "./ViewExpenseModal";

interface ExpenseButtonsProps {
  expenseId: string;
  status: ExpenseStatus;
  onStatusChange: (newStatus: ExpenseStatus) => void;
  onDelete: () => void;
  fileId: number;
  fileName: string;
  fileType: "image" | "pdf";
}

export default function ExpenseButtons({
  expenseId,
  status,
  onStatusChange,
  onDelete,
  fileId,
  fileName,
  fileType,
}: ExpenseButtonsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (newStatus: ExpenseStatus) => {
    setIsLoading(true);
    try {
      const updatedExpense = await updateExpense(expenseId, newStatus);
      onStatusChange(updatedExpense.status);
      toast.success(`Expense ${newStatus}. The expense has been ${newStatus}.`);
    } catch (error) {
      console.error(`Error updating expense status:`, error);
      toast.error(
        `Error: There was an error updating the expense status. Please try again.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteExpense(expenseId);
      onDelete();
      toast.success(
        "Expense deleted. The expense has been successfully deleted."
      );
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error(
        "Error: There was an error deleting the expense. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex space-x-2">
      {status === "pending" && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange("processed")}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Process"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange("paid")}
            disabled={isLoading}
          >
            {isLoading ? "Paying..." : "Pay"}
          </Button>
        </>
      )}
      {status === "processed" && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleStatusChange("paid")}
          disabled={isLoading}
        >
          {isLoading ? "Paying..." : "Pay"}
        </Button>
      )}
      {/* <ViewExpenseModal
        expenseId={expenseId}
        fileId={fileId}
        fileName={fileName}
        fileType={fileType}
      /> */}
      <Button
        variant="destructive"
        size="sm"
        onClick={handleDelete}
        disabled={isLoading}
      >
        {isLoading ? "Deleting..." : "Delete"}
      </Button>
    </div>
  );
}
