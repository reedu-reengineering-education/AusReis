import axios from "axios";

const API_URL = "/api/expenses";

export const getExpense = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      params: { id },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching expense:", error);
    throw error;
  }
};

export const createExpense = async (
  amount: number,
  description: string,
  projectId: string
) => {
  console.log("createExpense called with:", { amount, description, projectId });
  try {
    const response = await axios.post(API_URL, {
      amount,
      description,
      projectId,
    });
    console.log("API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating expense:", error);
    throw error;
  }
};

export const updateExpense = async (
  id: string,
  amount?: number,
  description?: string,
  projectId?: string
) => {
  try {
    const response = await axios.put(`${API_URL}?id=${id}`, {
      amount,
      description,
      projectId,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating expense:", error);
    throw error;
  }
};

export const deleteExpense = async (id: string) => {
  try {
    await axios.delete(`${API_URL}?id=${id}`);
  } catch (error) {
    console.error("Error deleting expense:", error);
    throw error;
  }
};
