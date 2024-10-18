import axios from "axios";

// Basis-URL für die Projekte-API
const API_URL = "/api/projects";

// Ein Projekt oder alle Projekte abrufen
export async function getProject(id?: string) {
  try {
    const url = id ? `${API_URL}/${id}` : API_URL; // Spezifisches oder alle Projekte abrufen
    const response = await axios.get(url);
    return response.data;
    // für das richtige Format, siehe https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/crud#selecting-fields
    // as Prisma.ProjectGetPayload<{
    //   include: {
    //     users: {
    //       select: {
    //         name: true;
    //         email: true;
    //         role: true;
    //       };
    //     };
    //   };
    // }>;
  } catch (error) {
    console.error("Error fetching project(s):", error);
    throw error;
  }
}

export async function getProjectForExport(id: string) {
  try {
    const url = id ? `${API_URL}/${id}/export` : API_URL; // Spezifisches oder alle Projekte abrufen
    console.log("Fetchiong project data for export from, url:", url);
    const response = await axios.get(url);
    console.log("Response data:", response.data);
    return response.data;
    // : API_URL; // Spezifisches oder alle Projekte abrufen
  } catch (error) {
    console.error("Error fetching project(s) data for export:", error);
    throw error;
  }
}

// Neues Projekt erstellen (nur für Admins)
export async function createProject(
  name: string,
  status: string,
  budget: number,
  actualSpend: number,
  users: string[]
) {
  try {
    const response = await axios.post(API_URL, {
      name,
      status,
      budget,
      actualSpend,
      users, // Benutzer-IDs hinzufügen
    });
    return response.data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
}

// Projekt aktualisieren (auch für Admins)
export async function updateProject(
  id: string,
  name: string,
  status: string,
  budget: number,
  actualSpend: number,
  userIds: string[]
) {
  const apiUrl = `${API_URL}/${id}`; // Spezifisches Projekt aktualisieren
  try {
    const response = await axios.put(apiUrl, {
      name,
      status,
      budget,
      actualSpend,
      userIds, // Benutzer-IDs hinzufügen
    });
    return response.data;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
}

// API-Client für Projektlöschung (auch für Admins)
export async function deleteProject(id: string) {
  const apiUrl = `${API_URL}/${id}`; // Spezifisches Projekt löschen
  try {
    const response = await axios.delete(apiUrl);
    return response; // Rückgabe der API-Antwort
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
}
