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
  handleFormSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function AddFormModal({
  activeTab,
  setShowAddForm,
  handleFormSubmit,
}: AddFormModalProps) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default" onClick={() => setIsDialogOpen(true)}>
          {activeTab === "expenses" ? "Neue Auslage" : "Neue Reisekosten"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {activeTab === "expenses"
              ? "Auslage hinzufügen"
              : "Reisekosten hinzufügen"}
          </DialogTitle>
          <DialogDescription>
            Bitte füllen Sie das Formular aus.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit}>
          <Input placeholder="Titel" required className="mb-4" />
          <Input placeholder="Betrag" required className="mb-4" type="number" />
          <Input placeholder="Projekt" required className="mb-4" />
          <Input
            placeholder="Belege (optional)"
            type="file"
            multiple
            className="mb-4"
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
