"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export function ProjectViewModal({ project }: { project: any }) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800"; // Grün für "Active"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"; // Gelb für "Pending"
      case "COMPLETED":
        return "bg-blue-100 text-blue-800"; // Blau für "Completed"
      default:
        return "bg-gray-100 text-gray-800"; // Grau für unbekannte Status
    }
  };
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild onClick={() => setIsDialogOpen(true)}>
        <Button variant="outline" size="sm">
          View
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Project Details</DialogTitle>
          <DialogDescription>Information about the project</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            <strong>Name:</strong> {project.name}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <Badge className={getStatusBadgeColor(project.status)}>
              {project.status}
            </Badge>
          </p>
          <p>
            <strong>Budget:</strong> ${project.budget.toLocaleString()}
          </p>
          <p>
            <strong>Actual Spend:</strong> $
            {project.actualSpend.toLocaleString()}
          </p>
          <h3 className="font-bold">Assigned Users</h3>
          <ul>
            {project.users && project.users.length > 0 ? (
              project.users.map((user: any) => (
                <li key={user.id}>{user.name}</li>
              ))
            ) : (
              <p>No users assigned</p>
            )}
          </ul>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
