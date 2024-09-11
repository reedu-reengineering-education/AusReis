import axios from "axios";

const API_URL = "/api/projects";

export const getProject = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      params: { id },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
};

export const createProject = async (name: string, description: string) => {
  console.log("createProject called with:", { name, description });
  try {
    const response = await axios.post(API_URL, { name, description });
    console.log("API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const updateProject = async (
  id: string,
  name?: string,
  description?: string
) => {
  try {
    const response = await axios.put(`${API_URL}?id=${id}`, {
      name,
      description,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

export const deleteProject = async (id: string) => {
  try {
    await axios.delete(`${API_URL}?id=${id}`);
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};
