import axios from "axios";

const REGISTER_API_URL = "/api/register";

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const response = await axios.post(REGISTER_API_URL, {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};
