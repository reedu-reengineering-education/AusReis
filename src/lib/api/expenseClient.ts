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

// // Erstellen einer neuen Auslage
// export const createExpense = async (data: any, xhr: any) => {
//   console.log("createExpense called with:", {
//     data,
//   });
//   try {
//     const response = await axios.post(API_URL, {
//       data: {
//         ...data,
//         travelStartDate: data.travelStartDate,
//         travelEndDate: data.travelEndDate,
//       },
//       xhr,
//     });
//     console.log("response.data", response.data);
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
//   bills?: { file: string; amount: number }[],
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
// export async function deleteExpense(expenseId: string): Promise<boolean> {
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
// }
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

// Erstellen einer neuen Auslage
// export const createExpense = async (data: any) => {
//   console.log("createExpense called with:", { data });
//   try {
//     const response = await axios.post(API_URL, {
//       ...data,
//       bills: data.bills.map(
//         (bill: { file: { id: number }; amount: number }) => ({
//           fileId: bill.file.id,
//           amount: bill.amount,
//         })
//       ),
//       travelStartDate: data.travelStartDate,
//       travelEndDate: data.travelEndDate,
//     });
//     console.log("response.data", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("Error creating expense:", error);
//     throw error;
//   }
// };

// Erstellen einer neuen Auslage
// export const createExpense = async (data: any) => {
//   console.log("createExpense called with:", JSON.stringify(data, null, 2));
//   try {
//     // Ensure bills are in the correct format
//     const formattedBills = data.bills.map((bill: any) => {
//       if (bill.files && bill.files.length > 0) {
//         // Handle the case where files are nested in a 'files' array
//         return {
//           id: bill.id,
//           fileId: bill.files[0].id,
//           amount: bill.amount,
//         };
//       } else if (bill.file && bill.file.id) {
//         // Handle the case where file is directly on the bill object
//         return {
//           id: bill.id,
//           fileId: bill.file.id,
//           amount: bill.amount,
//         };
//       } else {
//         console.error("Invalid bill structure:", bill);
//         throw new Error("Invalid bill structure");
//       }
//     });

//     const response = await axios.post(API_URL, {
//       ...data,
//       bills: formattedBills,
//       travelStartDate: data.travelStartDate,
//       travelEndDate: data.travelEndDate,
//     });
//     console.log("response.data", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("Error creating expense:", error);
//     throw error;
//   }
// };
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
// Aktualisieren einer bestimmten Auslage
export const updateExpense = async (
  id: string,
  status?: string,
  amount?: number,
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
      amount,
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
