import axios from "axios";

const FILE_API_URL = "/api/file";

export const getFile = async (id: string) => {
  try {
    const response = await axios.get(`${FILE_API_URL}?id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching file:", error);
    throw error;
  }
};

export const createFile = async (name: string, path: string) => {
  try {
    const response = await axios.post(FILE_API_URL, { name, path });
    return response.data;
  } catch (error) {
    console.error("Error creating file:", error);
    throw error;
  }
};

export const updateFile = async (id: string, name: string, path: string) => {
  try {
    const response = await axios.put(`${FILE_API_URL}?id=${id}`, {
      name,
      path,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating file:", error);
    throw error;
  }
};

export const deleteFile = async (id: string) => {
  try {
    await axios.delete(`${FILE_API_URL}?id=${id}`);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};
