// Path: src/components/admin-dashboard/ProjectTable.tsx
// Component: ProjectTable for displaying projects on the admin dashboard
"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import SearchBar from "./SearchBar";
import {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
} from "@/lib/api/userClient";
import { useSession } from "next-auth/react";
import { User } from "@prisma/client";
import { toast } from "react-toastify";
import { CreateUserForm } from "./CreateUserForm";
import { EditUserForm } from "./EditUserForm";
import { UniversalDeleteDialog } from "../forms/UniversalDeleteButton";

export default function UserTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { data: session, status } = useSession();
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("name");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUpdateUser = async (updatedUser: User): Promise<boolean> => {
    try {
      const result = await updateUser(
        updatedUser.id,
        updatedUser.name || "",
        updatedUser.email || "",
        updatedUser.role
      );
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === updatedUser.id ? result : u))
      );
      toast.success("User updated successfully");
      return true;
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Error updating user. Please try again.");
      return false;
    }
  };

  const handleDeleteSuccess = async (id: string, message: string) => {
    try {
      await deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
      console.log(message);
      toast.success(message);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user. Please try again.");
    }
  };

  const handleCreateUser = async (
    name: string,
    email: string,
    role: string
  ) => {
    try {
      const newUser = await createUser(name, email, "defaultPassword", role);
      setUsers([...users, newUser]);
      toast.success("User created successfully");
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user");
    }
  };

  const filteredAndSortedUsers = users
    .filter((user) => {
      if (searchTerm === "") return true;

      const searchLower = searchTerm.toLowerCase();
      return (
        user.name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.role.toLowerCase().includes(searchLower)
      );
    })
    .filter((user) => {
      return selectedRoles.length === 0 || selectedRoles.includes(user.role);
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.name ?? "").localeCompare(b.name ?? "");
        case "email":
          return (a.email ?? "").localeCompare(b.email ?? "");
        case "role":
          return a.role.localeCompare(b.role);
        default:
          return 0;
      }
    });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-green-100 text-green-800";
      case "user":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (status === "loading" || isLoading) {
    return <div>Loading users...</div>;
  }

  if (!session) {
    return <div>You must be logged in to view this page.</div>;
  }

  if (error) {
    return <div>Error loading users: {error.message}</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users..."
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Sort and Filter</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
              <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="email">Email</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="role">Role</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
            {["admin", "user"].map((role) => (
              <DropdownMenuCheckboxItem
                key={role}
                checked={selectedRoles.includes(role)}
                onCheckedChange={(checked) => {
                  setSelectedRoles(
                    checked
                      ? [...selectedRoles, role]
                      : selectedRoles.filter((r) => r !== role)
                  );
                }}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button onClick={() => setIsCreateModalOpen(true)}>Create User</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge className={getRoleBadgeColor(user.role)}>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedUser(user);
                    setIsEditModalOpen(true);
                  }}
                >
                  Edit
                </Button>
                <UniversalDeleteDialog
                  item={{ id: user.id, name: user.name ?? "Unknown User" }}
                  itemType="User"
                  onDelete={handleDeleteSuccess}
                  onClose={() => {}}
                  triggerButton={
                    <Button variant="destructive" size="sm">
                      Delete
                    </Button>
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CreateUserForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateUser={handleCreateUser}
      />

      <EditUserForm
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdateUser={handleUpdateUser}
        user={selectedUser}
      />
    </div>
  );
}
