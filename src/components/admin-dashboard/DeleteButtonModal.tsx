"use client";
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
import { useState } from "react";

interface Project {
  id: string;
  name: string;
}

interface ProjectDeleteDialogProps {
  project: Project;
  onDelete: (id: string) => void;
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
      await onDelete(project.id); // Führt die Löschaktion aus
      onDeleteSuccess(project.id, "Project deleted successfully."); // Erfolgreiche Löschung
      onClose(); // Schließt das Dialog
    } catch (error) {
      console.error("Error deleting the project", error); // Fehlerbehandlung
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
            project.
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
// export default function DeleteProjectModal({ project, onDelete, onClose }) {
//     return (
//       <Dialog open={!!project} onOpenChange={onClose}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Delete Project</DialogTitle>
//           </DialogHeader>
//           <p>Are you sure you want to delete the project "{project?.name}"?</p>
//           <DialogFooter>
//             <Button variant="destructive" onClick={() => onDelete(project.id)}>
//               Delete
//             </Button>
//             <Button onClick={onClose}>Cancel</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     );
//   }
