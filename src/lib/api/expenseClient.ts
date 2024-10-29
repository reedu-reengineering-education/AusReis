// // Zweck: Definiert die API-Methoden für Auslagen
// //  Path: src/lib/api/expenseClient.ts
// import axios from "axios";

// const API_URL = "/api/expenses";
// const ADMIN_API_URL = "/api/admin/expenses";

// // Abrufen aller Auslagen für Admin
// export const getExpensesForAdmin = async () => {
//   try {
//     const response = await axios.get(`${ADMIN_API_URL}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching expenses:", error);
//     throw error;
//   }
// };

// // Abrufen aller Auslagen
// export const getExpenses = async () => {
//   try {
//     const response = await axios.get(`${API_URL}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching expenses:", error);
//     throw error;
//   }
// };

// export const createExpense = async (data: any) => {
//   console.log("createExpense called with:", JSON.stringify(data, null, 2));
//   try {
//     const response = await axios.post(API_URL, data);
//     console.log(
//       "createExpense response:",
//       JSON.stringify(response.data, null, 2)
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error creating expense:", error);
//     throw error;
//   }
// };
// // Aktualisieren einer bestimmten Auslage
// export const updateExpense = async (
//   id: string,
//   status?: string,
//   amount?: number,
//   description?: string,
//   projectId?: string,
//   category?: string,
//   bills?: { fileId: string; amount: number }[],
//   travelStartDate?: Date,
//   travelEndDate?: Date
// ) => {
//   try {
//     const response = await axios.put(`${API_URL}/${id}`, {
//       status,
//       amount,
//       description,
//       projectId,
//       category,
//       bills,
//       travelStartDate,
//       travelEndDate,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error updating expense:", error);
//     throw error;
//   }
// };

// // Löschen einer bestimmten Auslage
// export const deleteExpense = async (expenseId: string): Promise<boolean> => {
//   try {
//     const response = await axios.delete(`/api/expenses/${expenseId}`);
//     if (response.status === 200) {
//       return true;
//     } else {
//       throw new Error(response.data.error || "Failed to delete expense");
//     }
//   } catch (error) {
//     if (axios.isAxiosError(error) && error.response?.status === 404) {
//       console.warn("Expense not found, it may have been already deleted");
//       return true;
//     }
//     console.error("Error deleting expense:", error);
//     throw error;
//   }
// };
// Zweck: Definiert die API-Methoden für Auslagen
// Path: src/lib/api/expenseClient.ts
import axios from "axios";

const API_URL = "/api/expenses";
const ADMIN_API_URL = "/api/admin/expenses";

// Abrufen aller Auslagen für Admin
export const getExpensesForAdmin = async () => {
  try {
    const response = await axios.get(`${ADMIN_API_URL}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching expenses:", error);
    throw error;
  }
};

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

// Änderung: Aktualisierung der createExpense-Funktion, um grossAmount und netAmount zu verwenden
export const createExpense = async (data: any) => {
  console.log("createExpense called with:", JSON.stringify(data, null, 2));
  try {
    const response = await axios.post(API_URL, data);
    console.log(
      "createExpense response:",
      JSON.stringify(response.data, null, 2)
    );
    return response.data;
  } catch (error) {
    console.error("Error creating expense:", error);
    throw error;
  }
};

// Änderung: Aktualisierung der updateExpense-Funktion, um grossAmount und netAmount zu verwenden
export const updateExpense = async (
  id: string,
  status?: string,
  grossAmount?: number,
  netAmount?: number,
  description?: string,
  projectId?: string,
  category?: string,
  bills?: { fileId: string; amount: number }[],
  travelStartDate?: Date,
  travelEndDate?: Date
) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, {
      status,
      grossAmount,
      netAmount,
      description,
      projectId,
      category,
      bills,
      travelStartDate,
      travelEndDate,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating expense:", error);
    throw error;
  }
};

// Löschen einer bestimmten Auslage
export const deleteExpense = async (expenseId: string): Promise<boolean> => {
  try {
    const response = await axios.delete(`/api/expenses/${expenseId}`);
    if (response.status === 200) {
      return true;
    } else {
      throw new Error(response.data.error || "Failed to delete expense");
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.warn("Expense not found, it may have been already deleted");
      return true;
    }
    console.error("Error deleting expense:", error);
    throw error;
  }
};
