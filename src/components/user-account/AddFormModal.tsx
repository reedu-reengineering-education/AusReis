import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState, useRef } from "react";
import { Progress } from "@/components/ui/progress";
import { createFormData } from "@/helpers/fileUploadHelpers";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { useSession } from "next-auth/react"; // Importiere useSession

interface AddFormModalProps {
  activeTab: "expenses" | "travel";
  setShowAddForm: (show: boolean) => void;
  handleFormSubmit: (formData: {
    amount: number;
    description: string;
    projectId: string;
    status: string;
    userId: string;
    category: string;
    bills: { file: string; amount: number }[];
  }) => void;
}

export function AddFormModal({
  activeTab,
  setShowAddForm,
  handleFormSubmit,
}: AddFormModalProps) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession(); // Lade die Session

  const [formData, setFormData] = useState<{
    status: string;
    amount: number;
    description: string;
    projectId: string;
    userId: string;
    category: string;
    bills: { file: string; amount: number }[];
  }>({
    status: "pending",
    amount: 0,
    description: "",
    projectId: "",
    userId: session?.user?.id || "",
    category: activeTab === "expenses" ? "reimbursement" : "travel",
    bills: [],
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.amount ||
      !formData.description ||
      !formData.projectId ||
      !formData.userId ||
      !formData.category ||
      !formData.status ||
      !formData.bills
    ) {
      // Optional: Anzeige eines Fehlerhinweises an den Benutzer
      console.log("Alle Felder müssen ausgefüllt sein.");
      return;
    }

    if (formData.bills.length === 0) {
      console.log("Mindestens eine Datei muss hochgeladen werden.");
      return;
    }
    console.log("Form data submitted:", formData);

    handleFormSubmit(formData);
    setIsDialogOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const bills = files
      ? Array.from(files).map((file) => ({ file: file.name, amount: 0 }))
      : [];
    setFormData((prevData) => ({
      ...prevData,
      bills,
    }));
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default" onClick={() => setIsDialogOpen(true)}>
          {activeTab === "expenses" ? "Neue Auslage" : "Neue Reisekosten"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader />
        <DialogTitle>
          {activeTab === "expenses"
            ? "Auslage hinzufügen"
            : "Reisekosten hinzufügen"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <Input
            name="description"
            placeholder="Titel"
            required
            className="mb-4"
            onChange={handleInputChange}
          />
          <Input
            name="amount"
            placeholder="Betrag"
            required
            className="mb-4"
            type="number"
            onChange={handleInputChange}
          />
          <Input
            name="projectId"
            placeholder="Projekt"
            required
            className="mb-4"
            onChange={handleInputChange}
          />
          <Input
            name="bills"
            placeholder="Belege (optional)"
            type="file"
            multiple
            className="mb-4"
            onChange={handleFileChange}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button type="submit">Einreichen</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
