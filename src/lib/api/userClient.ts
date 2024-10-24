// Path: src/lib/api/userClient.ts
import axios from "axios";

const API_URL = "/api/users";

// Funktion zum Abrufen aller Benutzer
export const getUsers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Funktion zum Erstellen eines neuen Benutzers
export const createUser = async (
  name: string,
  email: string,
  password: string,
  role: string
) => {
  try {
    const response = await axios.post(API_URL, { name, email, password, role });
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Funktion zum Aktualisieren eines Benutzers
export const updateUser = async (
  id: string,
  name: string,
  email: string,
  role: "user" | "admin"
) => {
  try {
    console.log("Sending update request:", { id, name, email, role });
    console.log("Sending userId:", id);
    const response = await axios.put(`${API_URL}/${encodeURIComponent(id)}`, {
      name,
      email,
      role,
    });
    console.log("Update response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
      console.error("Request config:", error.config);
    }
    throw error;
  }
};
// wo soll dieser log: console.log("Sending userId:", id); hin in der updateUser funktion?
//

// Funktion zum Löschen eines Benutzers
export const deleteUser = async (id: string) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
