// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { toast } from "react-toastify";
// import { updateExpense, deleteExpense } from "@/lib/api/expenseClient";
// import { ExpenseStatus } from "@prisma/client";

// interface ExpenseButtonsProps {
//   expenseId: string;
//   status: ExpenseStatus;
//   onStatusChange: (newStatus: ExpenseStatus) => void;
//   onDelete: () => void;
//   fileId: number;
//   fileName: string;
//   fileType: "image" | "pdf";
// }

// export default function ExpenseButtons({
//   expenseId,
//   status,
//   onStatusChange,
//   onDelete,
//   fileId,
// }: ExpenseButtonsProps) {
//   const [isLoading, setIsLoading] = useState(false);

//   const handleDownload = () => {
//     window.open(`/api/download/${fileId}`, "_blank");
//   };

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
//       <Button onClick={handleDownload} size="sm">
//         Download
//       </Button>
//       <Button
//         variant="destructive"
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
import { Download } from "lucide-react";

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

  const handleDownloadBlob = async () => {
    try {
      const response = await fetch(`/api/download/${fileId}`);
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Error downloading file. Please try again.");
    }
  };

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
      <Button onClick={handleDownloadBlob} size="sm">
        Download
      </Button>

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
