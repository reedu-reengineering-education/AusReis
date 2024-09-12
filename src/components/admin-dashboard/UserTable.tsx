import { useState } from "react";
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

export default function UserTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", role: "Admin", status: "Active" },
    { id: 2, name: "Jane Doe", role: "User", status: "Pending" },
    { id: 3, name: "Bob Smith", role: "User", status: "Inactive" },
  ]);

  const handleRemoveUser = (id: number) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Funktion, um Status zu bestimmen und die entsprechende Farbe für das Badge zu setzen
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"; // Grün für "Active"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"; // Gelb für "Pending"
      case "Inactive":
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
            <TableHead>Status</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.role}</TableCell>

              {/* Badge für den Status */}
              <TableCell>
                <Badge className={getStatusBadgeColor(user.status)}>
                  {user.status}
                </Badge>
              </TableCell>

              <TableCell className="flex justify-end space-x-2">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
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
