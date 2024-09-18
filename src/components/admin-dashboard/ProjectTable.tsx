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
import { Project } from "@prisma/client";

export default function ProjectTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("name");
  const [projects, setProjects] = useState<Project[]>([]); // Zustandsvariable für Projekte
  const [isLoading, setIsLoading] = useState(true); // Zustandsvariable für Ladezustand
  const [error, setError] = useState<Error | null>(null); // Zustandsvariable für Fehler
  const [availableUsers, setAvailableUsers] = useState([]);
  const [showAddProjectForm, setShowAddProjectForm] = useState(false); // Steuerung des Formulars
  const { data: session, status } = useSession(); // Session holen
  const [editingProject, setEditingProject] = useState<Project | null>(null); // Für das Bearbeiten
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null); // Zustandsvariable für das ausgewählte Projekt

  interface User {
    id: string;
    name: string;
  }

  // Schnittstelle für Projekte
  interface Project {
    updatedAt: Date;
    users: User[];
    id: string;
    name: string;
    status: string;
    budget: number;
    actualSpend: number;
    assignedUsers: { id: string }[];
  }
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
        console.log("Users:", users);
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
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      }

      // Wenn die Namen nicht gleich sind, die alphabetische Reihenfolge beibehalten
      return nameComparison;
    });
  };

  // const handleViewClick = (project: Project) => {
  //   setSelectedProject(project); // Setze das ausgewählte Projekt
  //   setIsModalOpen(true); // Öffne das Modal
  // };

  // const handleViewProject = (project: Project) => {
  //   setSelectedProject(project); // Das ausgewählte Projekt speichern
  //   setIsModalOpen(true); // Modal öffnen
  // };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Modal schließen
    setSelectedProject(null); // Auswahl zurücksetzen
  };

  const handleUpdateProject = async (
    updatedProject: Project
  ): Promise<boolean> => {
    try {
      // Prüfen, ob assignedUsers ein Array ist
      console.log("updatedProject.assignedUsers:", updatedProject);
      if (Array.isArray(updatedProject.assignedUsers)) {
        const userIds = updatedProject.assignedUsers
          .map((user) => {
            if (typeof user === "string") {
              return user; // Falls es bereits eine ID ist, zurückgeben
            } else if (user && user.id) {
              return user.id; // Falls es ein User-Objekt ist, die ID zurückgeben
            }
            console.error("Invalid user object:", user);
            return null;
          })
          .filter(Boolean); // Null-Werte herausfiltern

        // Setze die zugewiesenen Benutzer-IDs
        updatedProject.assignedUsers = userIds as any; // Typumgehung, da assignedUsers jetzt eine Liste von IDs ist
      } else {
        console.error(
          "assignedUsers is not an array:",
          updatedProject.assignedUsers
        );
      }

      await updateProject(
        updatedProject.id,
        updatedProject.name,
        updatedProject.status,
        updatedProject.budget,
        updatedProject.actualSpend,
        updatedProject.assignedUsers as unknown as string[] // Pass the userIds here
      );

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
    userIds: string[];
  }) => {
    try {
      const savedProject = await createProject(
        newProject.name,
        newProject.status,
        newProject.budget,
        newProject.actualSpend,
        newProject.userIds // Benutzer-IDs hinzufügen
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
      case "ACTIVE":
        return "bg-green-100 text-green-800"; // Grün für "Active"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"; // Gelb für "Pending"
      case "COMPLETED":
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

              <TableCell>${project.budget.toLocaleString()}</TableCell>
              <TableCell>${project.actualSpend.toLocaleString()}</TableCell>

              {/* Benutzerliste anzeigen */}
              <TableCell>
                {project.users.map(
                  (user: {
                    id: Key | null | undefined;
                    name:
                      | string
                      | number
                      | bigint
                      | boolean
                      | ReactElement<any, string | JSXElementConstructor<any>>
                      | Iterable<ReactNode>
                      | ReactPortal
                      | Promise<AwaitedReactNode>
                      | null
                      | undefined;
                  }) => (
                    <Badge key={user.id} className="mr-2">
                      {user.name}
                    </Badge>
                  )
                )}
              </TableCell>
              <TableCell className="flex justify-end space-x-2">
                {/* <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewClick(project)}
                >
                  View
                </Button> */}
                <ProjectViewModal project={project} />
                {/* <Button variant="outline" size="sm">
                  Edit
                </Button> */}
                <ProjectEditModal
                  projectId={project.id}
                  onProjectUpdated={handleUpdateProject}
                  availableUsers={availableUsers}
                  onUpdate={handleUpdateProject}
                  editingProject={editingProject}
                />
                {/* <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(project.id)}
                >
                  Remove
                </Button> */}
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
