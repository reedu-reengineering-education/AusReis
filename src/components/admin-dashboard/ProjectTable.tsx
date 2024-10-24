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
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import SearchBar from "./SearchBar";
import ProjectForm from "./ProjectForm";
import { getUsers } from "@/lib/api/userClient";
import { ProjectEditModal } from "./EditButtonModal";
import { UniversalDeleteDialog } from "../forms/UniversalDeleteButton";
import {
  getProject,
  createProject,
  deleteProject,
  updateProject,
} from "@/lib/api/projectClient";
import { useSession } from "next-auth/react";
import { Project, User } from "@prisma/client";
import { Progress } from "../ui/progress";
import { ProjectViewModal } from "./ViewButtonModal";
import { toast } from "react-toastify";

export default function ProjectTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState<(Project & { users: User[] })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [availableUsers, setAvailableUsers] = useState<
    (User & { name: string })[]
  >([]);
  const { data: session, status } = useSession();
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("name");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const data = await getProject();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const users = await getUsers();
        setAvailableUsers(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchProjects();
    fetchUsers();
  }, []);

  const handleUpdateProject = async (
    updatedProject: Project & { users: User[] }
  ): Promise<boolean> => {
    try {
      console.log("updatedProject.users:", updatedProject);
      setProjects((prevProjects) =>
        prevProjects.map((p) =>
          p.id === updatedProject.id ? updatedProject : p
        )
      );
      return true;
    } catch (error) {
      console.error("Error updating project:", error);
      return false;
    }
  };

  const handleDeleteSuccess = async (id: string, message: string) => {
    try {
      await deleteProject(id);
      setProjects(projects.filter((project) => project.id !== id));
      console.log(message);
      toast.success(message);
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Error deleting project. Please try again.");
    }
  };

  const handleSaveProject = async (newProject: {
    name: string;
    status: string;
    budget: number;
    actualSpend: number;
    users: any[];
  }) => {
    try {
      const savedProject = await createProject(
        newProject.name,
        newProject.status,
        newProject.budget,
        newProject.actualSpend,
        newProject.users
      );
      setProjects([...projects, savedProject]);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const filteredAndSortedProjects = projects
    .filter((project) => {
      if (searchTerm === "") return true;

      const searchLower = searchTerm.toLowerCase();
      return (
        project.name.toLowerCase().includes(searchLower) ||
        project.status.toLowerCase().includes(searchLower) ||
        project.budget.toString().includes(searchLower) ||
        project.actualSpend.toString().includes(searchLower) ||
        project.users.some((user) =>
          user.name?.toLowerCase().includes(searchLower)
        )
      );
    })
    .filter((project) => {
      const statusMatch =
        selectedStatuses.length === 0 ||
        selectedStatuses.includes(project.status);
      const userMatch =
        selectedUsers.length === 0 ||
        project.users.some((user) => selectedUsers.includes(user.id));
      return statusMatch && userMatch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "status":
          return a.status.localeCompare(b.status);
        case "budget":
          return a.budget - b.budget;
        case "actualSpend":
          return a.actualSpend - b.actualSpend;
        default:
          return 0;
      }
    });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (status === "loading" || isLoading) {
    return <div>Loading projects...</div>;
  }

  if (!session) {
    return <div>You must be logged in to view this page.</div>;
  }

  if (error) {
    return <div>Error loading projects: {error.message}</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-4 ">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search projects..."
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Sort and Filter</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
              <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="status">
                Status
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="budget">
                Budget
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="actualSpend">
                Actual Spend
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            {["active", "pending", "completed"].map((status) => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={selectedStatuses.includes(status)}
                onCheckedChange={(checked) => {
                  setSelectedStatuses(
                    checked
                      ? [...selectedStatuses, status]
                      : selectedStatuses.filter((s) => s !== status)
                  );
                }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Filter by User</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {availableUsers.map((user) => (
                  <DropdownMenuCheckboxItem
                    key={user.id}
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={(checked) => {
                      setSelectedUsers(
                        checked
                          ? [...selectedUsers, user.id]
                          : selectedUsers.filter((id) => id !== user.id)
                      );
                    }}
                  >
                    {user.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
        <ProjectForm
          onSave={handleSaveProject}
          availableUsers={availableUsers}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Actual Spend</TableHead>
            <TableHead>Users</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedProjects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>{project.name}</TableCell>
              <TableCell>
                <Badge className={getStatusBadgeColor(project.status)}>
                  {project.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Progress
                  value={project.actualSpend}
                  max={project.budget}
                  className="bg-gradient-to-r from-green-500 via-orange-500 to-red-500 opacity-50"
                />
              </TableCell>
              <TableCell>{project.budget.toLocaleString()} €</TableCell>
              <TableCell>{project.actualSpend.toLocaleString()} €</TableCell>
              <TableCell>
                <div className="relative group">
                  <div className="flex flex-col space-y-0 transition-all duration-300">
                    {project.users?.map((user: User, index: number) => (
                      <Badge
                        key={user.id}
                        className="block transform transition-all duration-300 group-hover:translate-y-[var(--hover-spacing)]"
                        style={{
                          transform: `translateY(${index * -5}px)`,
                          ["--hover-spacing" as any]: `${index * 15}px`,
                        }}
                      >
                        {user.name ?? "Unknown"}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TableCell>
              <TableCell className="flex justify-end space-x-2">
                <ProjectViewModal project={project} />
                <ProjectEditModal
                  projectId={project.id}
                  onProjectUpdated={(project: Project) =>
                    handleUpdateProject(project as any)
                  }
                  editingProject={null}
                />
                <UniversalDeleteDialog
                  item={{ id: project.id, name: project.name }}
                  itemType="Projekt"
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
    </div>
  );
}
