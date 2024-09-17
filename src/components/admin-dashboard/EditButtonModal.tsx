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
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getProject, updateProject } from "@/lib/api/projectClient";
import { Project } from "prisma/prisma-client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { XIcon } from "lucide-react";

async function fetchUsers() {
  const response = await fetch("/api/users");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

interface ProjectEditModalProps {
  projectId: string;
  onProjectUpdated: (updatedProject: Project) => void;
}

export function ProjectEditModal({
  projectId,
  onProjectUpdated,
}: ProjectEditModalProps) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [budget, setBudget] = useState<number>(0);
  const [actualSpend, setActualSpend] = useState<number>(0);
  const [assignedUsers, setAssignedUsers] = useState<{ id: string }[]>([]);
  const loadProjectRef = React.useRef(() => {});
  const [project, setProject] = useState<Project | null>(null);
  const [allUsers, setAllUsers] = useState<{ id: string; name: string }[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<
    { id: string; name: string }[]
  >([]);
  const [userSearchTerm, setUserSearchTerm] = useState<string>("");

  loadProjectRef.current = async () => {
    try {
      const projectData = await getProject(projectId);
      setProject(projectData);
      setName(projectData.name);
      setStatus(projectData.status);
      setBudget(projectData.budget);
      setActualSpend(projectData.actualSpend);
      setAssignedUsers(projectData.assignedUsers || []);
      setSelectedUsers(
        (projectData.assignedUsers || []).map(
          (user: { id: string; name: string }) => ({
            id: user.id,
            name: user.name,
          })
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadProjectRef.current();
  }, [projectId]);

  const loadUsers = async () => {
    try {
      const users = await fetchUsers();
      setAllUsers(users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    if (isDialogOpen) {
      loadUsers();
    }
  }, [isDialogOpen]);

  const handleAddUser = (user: { id: string; name: string }) => {
    if (!selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
  };

  const handleSubmitUpdate = async () => {
    try {
      console.log(selectedUsers);
      const updatedProject: any = await updateProject(
        projectId,
        name,
        status,
        budget,
        actualSpend,
        selectedUsers.map((user) => user.id)
      );
      console.log("Project updated successfully");
      setIsDialogOpen(false);

      // Übergeordnete Komponente informieren, dass das Projekt aktualisiert wurde
      onProjectUpdated(updatedProject);
    } catch (error) {
      console.error("Error updating the project", error);
    }
  };

  const filteredUsers = allUsers.filter((user) =>
    user.name.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild onClick={() => setIsDialogOpen(true)}>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>Modify project details</DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitUpdate();
          }}
        >
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Input
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="budget">Budget</Label>
            <Input
              id="budget"
              type="number"
              value={budget === 0 ? "" : budget}
              onChange={(e) => {
                const newValue = parseFloat(e.target.value);
                setBudget(isNaN(newValue) ? 0 : newValue);
              }}
              required
            />
          </div>
          <div>
            <Label htmlFor="actualSpend">Actual Spend</Label>
            <Input
              id="actualSpend"
              type="number"
              value={actualSpend === 0 ? "" : actualSpend}
              onChange={(e) => {
                const newValue = parseFloat(e.target.value);
                setActualSpend(isNaN(newValue) ? 0 : newValue);
              }}
              required
            />
          </div>
          <div>
            <Label htmlFor="assignedUsers">Assigned Users</Label>
            <div className="flex items-center gap-4">
              <Input
                placeholder="Benutzer suchen..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className="bg-background"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button>Benutzer hinzufügen</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {filteredUsers.map((user) => (
                    <DropdownMenuItem
                      key={user.id}
                      onClick={() => handleAddUser(user)}
                    >
                      {user.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="mt-4">
              {selectedUsers.map((user) => (
                <Badge key={user.id} className="mr-2">
                  {user.name}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveUser(user.id)}
                  >
                    <XIcon className="w-4 h-4" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="outline" type="submit">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
