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
import SearchBar from "./SearchBar";
import { getUser } from "@/lib/api/userClient";
import { User } from "@prisma/client";

export default function UserTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getUser("", ""); // Provide the required arguments
        setUsers(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleRemoveUser = (id: string) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase() ?? false)
  );

  // Funktion, um Status zu bestimmen und die entsprechende Farbe für das Badge zu setzen
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-green-100 text-green-800"; // Grün für "Active"
      case "user":
        return "bg-yellow-100 text-yellow-800"; // Gelb für "Pending"
      case "sklave":
        return "bg-red-100 text-red-800"; // Rot für "Inactive"
      default:
        return "bg-gray-100 text-gray-800"; // Grau für unbekannte Status
    }
  };

  const getEmailBadgeColor = (email: string) => {
    switch (email) {
      case "admin":
        return "bg-green-100 text-green-800"; // Grün für "Active"
      case "user":
        return "bg-yellow-100 text-yellow-800"; // Gelb für "Pending"
      case "sklave":
        return "bg-red-100 text-red-800"; // Rot für "Inactive"
      default:
        return "bg-gray-100 text-gray-800"; // Grau für unbekannte Status
    }
  };

  return (
    <div>
      <SearchBar
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>
                <Badge className={getRoleBadgeColor(user.role)}>
                  {user.role}
                </Badge>
              </TableCell>

              {/* Badge für den Status */}
              <TableCell>
                <Badge className={getEmailBadgeColor(user.role ?? "")}>
                  {user.email}
                </Badge>
              </TableCell>

              <TableCell className="flex justify-end space-x-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveUser(user.id)}
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
