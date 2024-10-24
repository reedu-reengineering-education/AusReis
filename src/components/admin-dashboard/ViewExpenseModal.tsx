// Path: src/components/admin-dashboard/ViewExpenseModal.tsx
// Component: ViewExpenseModal for viewing expense details and downloading files
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, AlertTriangle } from "lucide-react";

interface ViewExpenseModalProps {
  expenseId: string;
  fileId: number;
  fileName: string;
  fileType: "image" | "pdf";
}

export default function ViewExpenseModal({
  expenseId,
  fileId,
  fileName,
  fileType,
}: ViewExpenseModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && fileId) {
      setError(null);
      setFileUrl(`/api/view/${fileId}`);
    }
  }, [isOpen, fileId]);

  const handleDownload = () => {
    window.open(`/api/download/${fileId}`, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Expense Details - {fileName}</DialogTitle>
        </DialogHeader>
        <div className="flex-grow overflow-auto p-6">
          {error ? (
            <div className="flex flex-col items-center justify-center h-full text-red-500">
              <AlertTriangle className="w-12 h-12 mb-4" />
              <p>{error}</p>
            </div>
          ) : fileUrl ? (
            fileType === "image" ? (
              <img
                src={fileUrl}
                alt="Expense receipt"
                className="max-w-full h-auto rounded-lg shadow-lg"
                onError={() => setError("Failed to load image")}
              />
            ) : (
              <iframe
                src={fileUrl}
                className="w-full h-full min-h-[60vh] rounded-lg shadow-lg"
                onError={() => setError("Failed to load PDF")}
              />
            )
          ) : (
            <div className="flex items-center justify-center h-full">
              <p>Loading...</p>
            </div>
          )}
        </div>
        <div className="flex justify-end items-center space-x-2 p-4 bg-muted">
          <Button
            onClick={handleDownload}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
