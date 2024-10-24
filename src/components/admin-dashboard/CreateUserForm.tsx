// // components/AdminDashboard/UserForm.tsx
// import { useState } from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { X } from "lucide-react";

// export default function UserForm({
//   onSave,
//   onClose,
// }: {
//   onSave: (user: any) => void;
//   onClose: () => void;
// }) {
//   const [formData, setFormData] = useState({ name: "", role: "", status: "" });

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     onSave(formData);
//   };

//   return (
//     <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
//       <Card className="max-w-4xl w-full">
//         <CardHeader className="flex items-center justify-between">
//           <CardTitle>Add New User</CardTitle>
//           <Button variant="ghost" size="icon" onClick={onClose}>
//             <X />
//           </Button>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit}>
//             <Input
//               name="name"
//               placeholder="User Name"
//               value={formData.name}
//               onChange={(e) =>
//                 setFormData({ ...formData, name: e.target.value })
//               }
//               required
//               className="mb-4"
//             />
//             <Input
//               name="role"
//               placeholder="Role"
//               value={formData.role}
//               onChange={(e) =>
//                 setFormData({ ...formData, role: e.target.value })
//               }
//               required
//               className="mb-4"
//             />
//             <Input
//               name="status"
//               placeholder="Status"
//               value={formData.status}
//               onChange={(e) =>
//                 setFormData({ ...formData, status: e.target.value })
//               }
//               required
//               className="mb-4"
//             />
//             <Button type="submit">Save User</Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import { UserPlus } from "lucide-react";

type CreateUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreateUser: (name: string, email: string, role: string) => void;
};

export function CreateUserForm({
  isOpen,
  onClose,
  onCreateUser,
}: CreateUserModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Name and email are required");
      return;
    }
    onCreateUser(name, email, role);
    setName("");
    setEmail("");
    setRole("user");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-primary" />
            Create New User
          </DialogTitle>
          <DialogDescription>
            Enter the details of the new user below. All fields are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                placeholder="john@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium">
                Role
              </Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full">
              Create User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
