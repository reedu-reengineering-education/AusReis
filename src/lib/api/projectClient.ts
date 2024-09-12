import axios from "axios";

// Basis-URL für die Projekte-API
const API_URL = "/api/projects";

// Ein Projekt oder alle Projekte abrufen
export async function getProject(id?: string) {
  try {
    const url = id ? `${API_URL}/${id}` : API_URL; // Spezifisches oder alle Projekte abrufen
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching project(s):", error);
    throw error;
  }
}

// Neues Projekt erstellen
export async function createProject(
  name: string,
  status: string,
  budget: number,
  actualSpend: number,
  userIds: string[]
) {
  try {
    const response = await axios.post(API_URL, {
      name,
      status,
      budget,
      actualSpend,
      userIds, // Benutzer-IDs hinzufügen
    });
    return response.data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
}

// Projekt aktualisieren
export async function updateProject(
  id: string,
  name: string,
  status: string,
  budget: number,
  actualSpend: number
) {
  const apiUrl = `${API_URL}/${id}`; // Spezifisches Projekt aktualisieren
  try {
    const response = await axios.put(apiUrl, {
      name,
      status,
      budget,
      actualSpend,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
}

// Projekt löschen
export async function deleteProject(id: string) {
  const apiUrl = `${API_URL}/${id}`; // Spezifisches Projekt löschen
  try {
    await axios.delete(apiUrl);
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
}
