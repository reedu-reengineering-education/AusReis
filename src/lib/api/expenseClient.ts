import axios from "axios";
import File from "prisma/prisma-client";

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
export const createExpense = async (data: any, xhr: any) => {
  console.log("createExpense called with:", {
    data,
  });
  try {
    const response = await axios.post(API_URL, {
      data,
      xhr,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating expense:", error);
    throw error;
  }
};

// Aktualisieren einer bestimmten Auslage
export const updateExpense = async (
  id: string,
  status?: string,
  amount?: number,
  description?: string,
  projectId?: string,
  category?: string,
  bills?: { file: string; amount: number }[]
) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, {
      status,
      amount,
      description,
      projectId,
      category,
      bills,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating expense:", error);
    throw error;
  }
};

// Löschen einer bestimmten Auslage
export const deleteExpense = async (expenseId: string) => {
  try {
    return await axios.delete(`api/expenses/${expenseId}`);
  } catch (error) {
    console.error("Error deleting expense:", error);
    throw error;
  }
};
