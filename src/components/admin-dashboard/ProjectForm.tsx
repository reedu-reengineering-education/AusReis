import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ProjectStatus } from "@prisma/client"; // Prisma Enum importieren
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function ProjectForm({
  onSave,
  availableUsers, // Benutzerliste als Prop
}: {
  onSave: (project: any) => void;
  availableUsers: { id: string; name: string }[]; // Benutzerliste
}) {
  const [formData, setFormData] = useState({
    name: "",
    status: "" as ProjectStatus, // Verwende den Prisma-Enum-Typ für Status
    budget: "",
    actualSpend: "",
    users: [] as any[], // Benutzer-IDs werden hier gespeichert
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false); // Steuerung des Dialogs
  const [error, setError] = useState<string | null>(null); // Fehlerzustand
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | null>(
    null
  ); // Ausgewählter Status vom Prisma-Enum

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validierung von Budget und Actual Spend
    const parsedBudget = parseFloat(formData.budget);
    const parsedActualSpend = parseFloat(formData.actualSpend);

    if (isNaN(parsedBudget) || isNaN(parsedActualSpend)) {
      setError("Please enter valid numbers for budget and actual spend.");
      return;
    }

    if (!formData.users.length) {
      setError("Please select at least one user for the project.");
      return;
    }

    if (!selectedStatus) {
      setError("Please select a project status.");
      return;
    }

    // Wenn alles in Ordnung ist, rufe die onSave-Funktion auf
    onSave({
      ...formData,
      status: selectedStatus, // Der ausgewählte Prisma-Status wird übergeben
      budget: parsedBudget,
      actualSpend: parsedActualSpend,
    });
    setIsDialogOpen(false); // Dialog schließen
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUserIds = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData({ ...formData, users: selectedUserIds });
  };

  const getStatusBadgeColor = (status: ProjectStatus) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"; // Grün für "Active"
      case "pending":
        return "bg-yellow-100 text-yellow-800"; // Gelb für "Inactive"
      case "completed":
        return "bg-blue-100 text-blue-800"; // Blau für "Completed"
      case "archived":
        return "bg-red-100 text-red-800"; // Grau für "Archived"
      default:
        return "bg-gray-100 text-gray-800"; // Grau für unbekannte Status
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          onClick={() => {
            setIsDialogOpen(true);
          }}
        >
          Add New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
          <DialogDescription>
            Enter the details for the new project. Please fill out all fields
            and click save when done.
          </DialogDescription>
        </DialogHeader>
        {error && <p className="text-red-500">{error}</p>} {/* Fehleranzeige */}
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Project Name"
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {selectedStatus ? (
                      <Badge className={getStatusBadgeColor(selectedStatus)}>
                        {selectedStatus}
                      </Badge>
                    ) : (
                      "Select"
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedStatus("active")}>
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSelectedStatus("pending")}
                  >
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSelectedStatus("completed")}
                  >
                    Completed
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSelectedStatus("archived")}
                  >
                    Archived
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="budget" className="text-right">
                Budget
              </Label>
              <Input
                id="budget"
                value={formData.budget}
                onChange={(e) =>
                  setFormData({ ...formData, budget: e.target.value })
                }
                placeholder="Budget"
                type="number"
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="actualSpend" className="text-right">
                Actual Spend
              </Label>
              <Input
                id="actualSpend"
                value={formData.actualSpend}
                onChange={(e) =>
                  setFormData({ ...formData, actualSpend: e.target.value })
                }
                placeholder="Actual Spend"
                type="number"
                className="col-span-3"
                required
              />
            </div>

            {/* Multi-Select für Benutzer */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="userSelect" className="text-right">
                Users
              </Label>
              <select
                id="userSelect"
                name="users"
                multiple
                value={formData.users}
                onChange={handleUserChange}
                className="col-span-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                {availableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
