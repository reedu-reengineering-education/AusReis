// Path: src/lib/api/registerClient.ts
import axios from "axios";

export async function registerUser(
  name: string,
  email: string,
  password: string,
  secretCode?: string
) {
  try {
    const response = await axios.post("/api/auth/register", {
      name,
      email,
      password,
      secretCode,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Error registering user");
    }
    throw new Error("An unexpected error occurred during registration");
  }
}
