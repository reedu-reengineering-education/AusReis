// Path: src/components/admin-dashboard/ProjectTable.tsx
"use client";

import {
  AwaitedReactNode,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useState,
} from "react";
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
} from "@/components/ui/dropdown-menu";
import SearchBar from "./SearchBar";
import ProjectForm from "./ProjectForm";
import { getUser } from "@/lib/api/userClient";
import { ProjectViewModal } from "./ViewButtonModal";
import { ProjectEditModal } from "./EditButtonModal";
import { ProjectDeleteDialog } from "./DeleteButtonModal";

// Importiere die API-Client-Funktionen
import {
  getProject,
  createProject,
  deleteProject,
  updateProject,
} from "@/lib/api/projectClient";
import { useSession } from "next-auth/react";
import { Project, User } from "@prisma/client";
import { Progress } from "../ui/progress";

export default function ProjectTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("name");
  const [projects, setProjects] = useState<(Project & { users: User[] })[]>([]); // Zustandsvariable für Projekte
  const [isLoading, setIsLoading] = useState(true); // Zustandsvariable für Ladezustand
  const [error, setError] = useState<Error | null>(null); // Zustandsvariable für Fehler
  const [availableUsers, setAvailableUsers] = useState([]);
  const [showAddProjectForm, setShowAddProjectForm] = useState(false); // Steuerung des Formulars
  const { data: session, status } = useSession(); // Session holen
  const [editingProject, setEditingProject] = useState<Project | null>(null); // Für das Bearbeiten
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null); // Zustandsvariable für das ausgewählte Projekt

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>You must be logged in to view this page.</div>;
  }

  // Daten von der API laden
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true); // Ladevorgang beginnt
        const data = await getProject(); // API-Aufruf ohne ID, um alle Projekte zu laden
        const sortedProjects = sortProjects(data); // Projekte sortieren
        setProjects(data); // Projekte in den Zustand laden
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError(error as any); // Fehler im Zustand speichern
      } finally {
        setIsLoading(false); // Ladevorgang abgeschlossen
      }
    };

    fetchProjects();
  }, []);

  // Benutzerdaten abrufen
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getUser(""); // API-Aufruf zum Abrufen der Benutzer
        setAvailableUsers(users); // Benutzer in den Zustand laden
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Funktion, um Projekte alphabetisch und nach letztem Änderungsdatum zu sortieren
  const sortProjects = (projects: Project[]) => {
    return projects.sort((a, b) => {
      // Zuerst alphabetisch nach dem Projektnamen sortieren
      const nameComparison = a.name.localeCompare(b.name);

      // Falls die Namen gleich sind, nach dem letzten Änderungsdatum sortieren
      if (nameComparison === 0) {
        return (
          new Date(b.updatedAt ?? 0).getTime() -
          new Date(a.updatedAt ?? 0).getTime()
        );
      }

      // Wenn die Namen nicht gleich sind, die alphabetische Reihenfolge beibehalten
      return nameComparison;
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Modal schließen
    setSelectedProject(null); // Auswahl zurücksetzen
  };

  const handleUpdateProject = async (
    updatedProject: Project & { users: User[] }
  ): Promise<boolean> => {
    try {
      // Prüfen, ob assignedUsers ein Array ist

      console.log("updatedProject.users:", updatedProject);

      setProjects((prevProjects) =>
        prevProjects.map((p) =>
          p.id === updatedProject.id ? updatedProject : p
        )
      ); // Aktualisiere die Projektliste
      setEditingProject(null); // Formular schließen
      return true; // Return true on success
    } catch (error) {
      console.error("Error updating project:", error);
      return false; // Return false on error
    }
  };

  // Projekt löschen
  const handleDelete = async (projectId: string) => {
    try {
      const response = await deleteProject(projectId); // Warte auf die Antwort des DELETE-Requests
      // Überprüfen, ob der Request erfolgreich war
      if (response.status === 204 || response.status === 200) {
        setProjects(
          (prevProjects) =>
            prevProjects.filter((project) => project.id !== projectId) // Entferne das gelöschte Projekt aus der Liste
        );
        console.log("Project deleted successfully");
      } else {
        console.error(
          "Failed to delete project. Status code:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleDeleteSuccess = (deletedProjectId: string, message: string) => {
    console.log(message); // Erfolgsnachricht oder Benachrichtigung anzeigen
    setProjects((prevProjects) =>
      prevProjects.filter((project) => project.id !== deletedProjectId)
    ); // Entferne das gelöschte Projekt aus der Projektliste
  };

  // Neues Projekt speichern
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
        newProject.users // Benutzer-IDs hinzufügen
      );
      setProjects([...projects, savedProject]); // Das neue Projekt der Liste hinzufügen
      setShowAddProjectForm(false); // Formular schließen
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  // Gefilterte Projekte basierend auf Suchfeld und Filterkriterien
  const filteredProjects = projects.filter((project) =>
    selectedFilter === "name"
      ? project.name.toLowerCase().includes(searchTerm.toLowerCase())
      : project.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Funktion, um Status zu bestimmen und die entsprechende Farbe für das Badge zu setzen
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"; // Grün für "Active"
      case "pending":
        return "bg-yellow-100 text-yellow-800"; // Gelb für "Pending"
      case "completed":
        return "bg-blue-100 text-blue-800"; // Blau für "Completed"
      default:
        return "bg-gray-100 text-gray-800"; // Grau für unbekannte Status
    }
  };

  if (isLoading) {
    return <div>Loading projects...</div>;
  }

  if (error) {
    return <div>Error loading projects: {error.message}</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Filter By</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem onClick={() => setSelectedFilter("name")}>
              Project Name
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedFilter("status")}>
              Status
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* Button, um das Formular für neue Projekte zu öffnen */}
        <ProjectForm
          onSave={handleSaveProject}
          availableUsers={availableUsers} // Benutzerliste weitergeben
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Progres</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Actual Spend</TableHead>
            <TableHead>Users</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProjects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>{project.name}</TableCell>

              {/* Badge für den Status */}
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

              {/* Benutzerliste anzeigen */}
              <TableCell>
                <div className="relative group">
                  <div className="flex flex-col space-y-0 transition-all duration-300">
                    {project.users?.map(
                      (
                        user: { id: string; name: string | null },
                        index: number
                      ) => (
                        <Badge
                          key={user.id}
                          className="block transform transition-all duration-300 group-hover:translate-y-[var(--hover-spacing)]"
                          style={{
                            transform: `translateY(${index * -5}px)`, // Stapel-Effekt
                            ["--hover-spacing" as any]: `${index * 15}px`, // Abstand bei Hover
                          }}
                        >
                          {user.name ?? "Unknown"}
                        </Badge>
                      )
                    )}
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
                <ProjectDeleteDialog
                  project={project}
                  onDelete={handleDelete}
                  onClose={handleCloseModal}
                  onDeleteSuccess={handleDeleteSuccess}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/*  */}
    </div>
  );
}
