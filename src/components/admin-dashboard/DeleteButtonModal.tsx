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

interface Project {
  id: string;
  name: string;
}

interface ProjectDeleteDialogProps {
  project: Project;
  onDelete: (id: string) => Promise<void>;
  onDeleteSuccess: (id: string, message: string) => void;
  onClose: () => void;
}

export function ProjectDeleteDialog({
  project,
  onDelete,
  onDeleteSuccess,
  onClose,
}: ProjectDeleteDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleDelete = async () => {
    try {
      await onDelete(project.id);
      onDeleteSuccess(project.id, "Project deleted successfully.");
      toast.success(`Project "${project.name}" deleted successfully.`);
      onClose();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error deleting the project", error);
      toast.error(
        `Failed to delete project "${project.name}". Please try again.`
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
            project "{project.name}".
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
