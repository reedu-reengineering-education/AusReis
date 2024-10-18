// "use client";

// import { useState } from "react";
// import { toast } from "react-toastify";
// import {
//   AlertDialog,
//   AlertDialogTrigger,
//   AlertDialogContent,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogDescription,
//   AlertDialogFooter,
// } from "@/components/ui/alert-dialog";
// import { Button } from "@/components/ui/button";

// interface DeleteItem {
//   id: string;
//   name: string;
// }

// interface UniversalDeleteDialogProps<T extends DeleteItem> {
//   item: T;
//   itemType: string;
//   onDelete: (id: string) => Promise<boolean>;
//   onDeleteSuccess: (id: string, message: string) => void;
//   onClose: () => void;
//   triggerButton?: React.ReactNode;
// }

// export function UniversalDeleteDialog<T extends DeleteItem>({
//   item,
//   itemType,
//   onDelete,
//   onDeleteSuccess,
//   onClose,
//   triggerButton,
// }: UniversalDeleteDialogProps<T>) {
//   const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

//   const handleDelete = async () => {
//     try {
//       await onDelete(item.id);
//       onDeleteSuccess(item.id, `${itemType} deleted successfully.`);
//       toast.success(`${itemType} "${item.name}" deleted successfully.`);
//       onClose();
//       setIsDialogOpen(false);
//     } catch (error) {
//       console.error(`Error deleting the ${itemType.toLowerCase()}`, error);
//       toast.error(
//         `Failed to delete ${itemType.toLowerCase()} "${
//           item.name
//         }". Please try again.`
//       );
//     }
//   };

//   return (
//     <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//       <AlertDialogTrigger asChild onClick={() => setIsDialogOpen(true)}>
//         {triggerButton || (
//           <Button variant="destructive" size="sm">
//             Delete
//           </Button>
//         )}
//       </AlertDialogTrigger>
//       <AlertDialogContent>
//         <AlertDialogHeader>
//           <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//           <AlertDialogDescription>
//             This action cannot be undone. This will permanently delete the
//             {itemType.toLowerCase()} "{item.name}".
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
//             Cancel
//           </Button>
//           <Button variant="destructive" onClick={handleDelete}>
//             Delete
//           </Button>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// }
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

interface DeleteItem {
  id: string;
  name: string;
}

interface UniversalDeleteDialogProps<T extends DeleteItem> {
  item: T;
  itemType: string;
  onDelete: (id: string, message: string) => Promise<void>;
  onClose: () => void;
  triggerButton?: React.ReactNode;
}

export function UniversalDeleteDialog<T extends DeleteItem>({
  item,
  itemType,
  onDelete,
  onClose,
  triggerButton,
}: UniversalDeleteDialogProps<T>) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDelete = async () => {
    if (!isDeleting) {
      setIsDeleting(true);
      try {
        await onDelete(
          item.id,
          `${itemType} "${item.name}" deleted successfully.`
        );
        setIsDialogOpen(false);
      } catch (error) {
        console.error(`Error deleting the ${itemType.toLowerCase()}`, error);
        toast.error(
          `Failed to delete ${itemType.toLowerCase()} "${
            item.name
          }". Please try again.`
        );
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild onClick={() => setIsDialogOpen(true)}>
        {triggerButton || (
          <Button variant="destructive" size="sm">
            Delete
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            {itemType.toLowerCase()} "{item.name}".
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
