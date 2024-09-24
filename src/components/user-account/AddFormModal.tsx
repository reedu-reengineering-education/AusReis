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
import { useState } from "react";

interface AddFormModalProps {
  activeTab: "expenses" | "travel";
  setShowAddForm: (show: boolean) => void;
  handleFormSubmit: (formData: {
    amount: number;
    description: string;
    projectId: string;
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
  const [formData, setFormData] = useState<{
    amount: number;
    description: string;
    projectId: string;
    userId: string;
    category: string;
    bills: { file: string; amount: number }[];
  }>({
    amount: 0,
    description: "",
    projectId: "",
    userId: "",
    category: "",
    bills: [],
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
