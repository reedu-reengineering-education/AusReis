// Path: src/components/admin-dashboard/ProjectForm.tsx
// Component: ProjectForm for creating and editing projects
"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { UserPlusIcon, UserMinusIcon } from "lucide-react";
import axios from "axios";

type ProjectStatus = "active" | "pending" | "completed" | "archived";

interface User {
  id: string;
  name: string;
}

interface ProjectFormProps {
  projectId?: string;
  onSave: (project: any) => Promise<void>;
  initialProject?: any;
  availableUsers: User[];
}

export default function ProjectForm({
  projectId,
  onSave,
  initialProject,
}: ProjectFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("active");
  const [budget, setBudget] = useState("");
  const [actualSpend, setActualSpend] = useState("");
  const [involvedUsers, setInvolvedUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState("");

  useEffect(() => {
    if (isOpen) {
      loadAllUsers();
      if (initialProject) {
        setName(initialProject.name);
        setStatus(initialProject.status);
        setBudget(initialProject.budget.toString());
        setActualSpend(initialProject.actualSpend.toString());
        setInvolvedUsers(initialProject.users || []);
      } else {
        resetForm();
      }
    }
  }, [isOpen, initialProject]);

  const resetForm = () => {
    setName("");
    setStatus("active");
    setBudget("");
    setActualSpend("");
    setInvolvedUsers([]);
  };

  const loadAllUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      setAllUsers(
        response.data.map((user: User) => ({ id: user.id, name: user.name }))
      );
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedBudget = parseFloat(budget);
    const parsedActualSpend = parseFloat(actualSpend);

    if (isNaN(parsedBudget) || isNaN(parsedActualSpend)) {
      toast.error("Please enter valid numbers for budget and actual spend.");
      return;
    }

    if (!involvedUsers.length) {
      toast.error("Please select at least one user for the project.");
      return;
    }

    try {
      await onSave({
        id: projectId,
        name,
        status,
        budget: parsedBudget,
        actualSpend: parsedActualSpend,
        users: involvedUsers.map((user) => user.id),
      });
      setIsOpen(false);
      resetForm();
      toast.success(
        projectId
          ? "Project updated successfully!"
          : "Project created successfully!"
      );
    } catch (error) {
      toast.error(
        projectId
          ? "Failed to update project. Please try again."
          : "Failed to create project. Please try again."
      );
    }
  };

  const addUser = (user: User) => {
    setInvolvedUsers((prev) => [...prev, user]);
  };

  const removeUser = (user: User) => {
    setInvolvedUsers((prev) => prev.filter((u) => u.id !== user.id));
  };

  const availableUsers = allUsers.filter(
    (user) => !involvedUsers.some((involved) => involved.id === user.id)
  );

  const filteredAvailableUsers = availableUsers.filter((user) =>
    user.name.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const getStatusBadgeColor = (status: ProjectStatus) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "archived":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" onClick={() => setIsOpen(true)}>
          {projectId ? "Edit Project" : "Add New Project"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>
            {projectId ? "Edit Project" : "Add New Project"}
          </DialogTitle>
          <DialogDescription>
            {projectId
              ? "Make changes to your project here. Click save when you're done."
              : "Enter the details for the new project. Please fill out all fields and click save when done."}
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
                required
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
                  {["active", "pending", "completed", "archived"].map((s) => (
                    <SelectItem key={s} value={s}>
                      <Badge
                        className={getStatusBadgeColor(s as ProjectStatus)}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget</Label>
                <Input
                  id="budget"
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Enter budget"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="actualSpend">Actual Spend</Label>
                <Input
                  id="actualSpend"
                  type="number"
                  value={actualSpend}
                  onChange={(e) => setActualSpend(e.target.value)}
                  placeholder="Enter actual spend"
                  required
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
            <Button type="submit">Save Project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
