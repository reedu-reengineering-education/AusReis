"use client";

import { useState } from "react";
import { toast } from "react-toastify";
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
import { ProjectStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function ProjectForm({
  onSave,
  availableUsers,
}: {
  onSave: (project: any) => void;
  availableUsers: { id: string; name: string }[];
}) {
  const [formData, setFormData] = useState({
    name: "",
    status: "" as ProjectStatus,
    budget: "",
    actualSpend: "",
    users: [] as any[],
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | null>(
    null
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsedBudget = parseFloat(formData.budget);
    const parsedActualSpend = parseFloat(formData.actualSpend);

    if (isNaN(parsedBudget) || isNaN(parsedActualSpend)) {
      toast.error("Please enter valid numbers for budget and actual spend.");
      return;
    }

    if (!formData.users.length) {
      toast.error("Please select at least one user for the project.");
      return;
    }

    if (!selectedStatus) {
      toast.error("Please select a project status.");
      return;
    }

    try {
      onSave({
        ...formData,
        status: selectedStatus,
        budget: parsedBudget,
        actualSpend: parsedActualSpend,
      });
      setIsDialogOpen(false);
      toast.success("Project created successfully!");
    } catch (error) {
      toast.error("Failed to create project. Please try again.");
    }
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
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "archived":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
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
                  <DropdownMenuItem
                    onClick={() => setSelectedStatus("active")}
                    className="bg-green-100 text-green-800"
                  >
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSelectedStatus("pending")}
                    className="bg-yellow-100 text-yellow-800"
                  >
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSelectedStatus("completed")}
                    className="bg-blue-100 text-blue-800 mt-8"
                  >
                    Completed
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSelectedStatus("archived")}
                    className="bg-red-100 text-red-800"
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
