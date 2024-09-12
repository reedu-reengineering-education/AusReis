import axios from "axios";

const API_URL = "/api/users";

// Funktion zum Abrufen eines Benutzers basierend auf der E-Mail
export const getUser = async (email: string) => {
  try {
    const response = await axios.get(`${API_URL}/${email}`); // Direkt die E-Mail in die URL
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

// Funktion zum Erstellen eines neuen Benutzers
export const createUser = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const response = await axios.post(API_URL, { name, email, password });
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Funktion zum Aktualisieren eines Benutzers
export const updateUser = async (
  id: string,
  name?: string,
  email?: string,
  password?: string
) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, {
      name,
      email,
      password,
    }); // ID direkt in der URL
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Funktion zum Löschen eines Benutzers
export const deleteUser = async (id: string) => {
  try {
    await axios.delete(`${API_URL}/${id}`); // ID direkt in der URL
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
