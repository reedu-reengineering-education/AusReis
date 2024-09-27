import axios from "axios";

const API_URL = "/api/expenses";

// Abrufen aller Auslagen
export const getExpenses = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching expenses:", error);
    throw error;
  }
};

// Erstellen einer neuen Auslage
export const createExpense = async (
  amount: number,
  description: string,
  projectId: string,
  userId: string, // Dies wird aus der Session automatisch gesetzt
  category: string, // Dies wird basierend auf dem Tab automatisch gesetzt
  bills: { file: string; amount: number }[]
) => {
  console.log("createExpense called with:", {
    amount,
    description,
    projectId,
    userId,
    category,
    bills,
  });

  if (!userId || !category) {
    console.error("userId or category is missing");
    throw new Error("User ID and category are required.");
  }

  try {
    const response = await axios.post(API_URL, {
      amount,
      description,
      projectId,
      userId,
      category,
      bills,
    });
    console.log("API response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating expense:",
      (error as any).response || (error as any).message
    );
    throw error;
  }
};

// Aktualisieren einer bestimmten Auslage
export const updateExpense = async (
  id: string,
  amount?: number,
  description?: string,
  projectId?: string,
  category?: string,
  bills?: { file: string; amount: number }[]
) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, {
      amount,
      description,
      projectId,
      category,
      bills,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error updating expense:",
      (error as any).response || (error as any).message
    );
    throw error;
  }
};

// Löschen einer bestimmten Auslage
export const deleteExpense = async (id: string) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error(
      "Error deleting expense:",
      (error as any).response || (error as any).message
    );
    throw error;
  }
};
