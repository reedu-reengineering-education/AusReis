// Path: src/components/admin-dashboard/EditUserForm.tsx
import React, { useState, useEffect } from "react";
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
import { Pencil } from "lucide-react";
import { User } from "@prisma/client";
import { updateUser } from "@/lib/api/userClient";

type EditUserFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser: (updatedUser: User) => void;
  user: User | null;
};

export function EditUserForm({
  isOpen,
  onClose,
  onUpdateUser,
  user,
}: EditUserFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setRole(user.role as "user" | "admin");
      console.log("Current user:", user);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.id || !name || !email || !role) {
      toast.error("All fields are required and user must have a valid ID");
      return;
    }
    try {
      console.log("Submitting user update:", {
        id: user.id,
        name,
        email,
        role,
      });
      const updatedUserData = await updateUser(user.id, name, email, role);
      console.log("Received updated user data:", updatedUserData);
      onUpdateUser(updatedUserData);
      toast.success("User updated successfully");
      onClose();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Pencil className="w-6 h-6 text-primary" />
            Edit User
          </DialogTitle>
          <DialogDescription>
            Make changes to the user's information here. Click save when you're
            done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-sm font-medium">
                Name
              </Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                placeholder="john@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role" className="text-sm font-medium">
                Role
              </Label>
              <Select
                value={role}
                onValueChange={(value: "user" | "admin") => setRole(value)}
              >
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
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
