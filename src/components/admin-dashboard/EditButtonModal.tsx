"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { XIcon, UserPlusIcon, UserMinusIcon } from "lucide-react";
import { Project, ProjectStatus, User } from "@prisma/client";
import { getProject, updateProject } from "@/lib/api/projectClient";

interface ProjectEditModalProps {
  projectId: string;
  onProjectUpdated: (updatedProject: Project) => Promise<boolean>;
  editingProject: Project | null;
  availableUsers: User[] | any[]; // Add this line to include availableUsers prop
}

export function ProjectEditModal({
  projectId,
  onProjectUpdated,
}: ProjectEditModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [project, setProject] = useState<Project & { users: User[] }>();
  const [name, setName] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("pending");
  const [budget, setBudget] = useState(0);
  const [actualSpend, setActualSpend] = useState(0);
  const [involvedUsers, setInvolvedUsers] = useState<User[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState("");

  useEffect(() => {
    if (isOpen) {
      loadProject();
      loadUsers();
    }
  }, [isOpen, projectId]);

  const loadProject = async () => {
    try {
      const projectData = await getProject(projectId);
      setProject(projectData);
      setName(projectData.name);
      setStatus(projectData.status);
      setBudget(projectData.budget);
      setActualSpend(projectData.actualSpend);
      setInvolvedUsers(projectData.users || []);
    } catch (error) {
      console.error("Error loading project:", error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const users = await response.json();
      setAvailableUsers(
        users.filter(
          (user: User) =>
            !involvedUsers.some((involved) => involved.id === user.id)
        )
      );
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedProject = await updateProject(
        projectId,
        name,
        status,
        budget,
        actualSpend,
        involvedUsers.map((user) => user.id)
      );
      onProjectUpdated(updatedProject);
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const addUser = (user: User) => {
    setInvolvedUsers([...involvedUsers, user]);
    setAvailableUsers(availableUsers.filter((u) => u.id !== user.id));
  };

  const removeUser = (user: User) => {
    setInvolvedUsers(involvedUsers.filter((u) => u.id !== user.id));
    setAvailableUsers([...availableUsers, user]);
  };

  const filteredAvailableUsers = availableUsers.filter((user) =>
    (user.name?.toLowerCase() ?? "").includes(userSearchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        Edit
      </Button>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Make changes to your project here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter project name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value: ProjectStatus) => setStatus(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget</Label>
                <Input
                  id="budget"
                  type="number"
                  value={budget || ""}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  placeholder="Enter budget"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="actualSpend">Actual Spend</Label>
                <Input
                  id="actualSpend"
                  type="number"
                  value={actualSpend || ""}
                  onChange={(e) => setActualSpend(Number(e.target.value))}
                  placeholder="Enter actual spend"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Project Users</Label>
              <Tabs defaultValue="involved" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="involved">Involved Users</TabsTrigger>
                  <TabsTrigger value="available">Available Users</TabsTrigger>
                </TabsList>
                <TabsContent value="involved">
                  <ScrollArea className="h-[200px] w-full border rounded-md p-2">
                    <div className="space-y-2">
                      {involvedUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between"
                        >
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800 hover:bg-green-200"
                          >
                            {user.name}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeUser(user)}
                          >
                            <UserMinusIcon className="h-4 w-4" />
                            <span className="sr-only">Remove user</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="available">
                  <div className="space-y-2">
                    <Input
                      placeholder="Search available users..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                    />
                    <ScrollArea className="h-[200px] w-full border rounded-md p-2">
                      <div className="space-y-2">
                        {filteredAvailableUsers.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center justify-between"
                          >
                            <Badge
                              variant="outline"
                              className="bg-gray-100 text-gray-800 hover:bg-gray-200"
                            >
                              {user.name}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => addUser(user)}
                            >
                              <UserPlusIcon className="h-4 w-4" />
                              <span className="sr-only">Add user</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
