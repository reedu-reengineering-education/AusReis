// registerClient.ts
import axios from "axios";

export async function registerUser(
  name: string,
  email: string,
  password: string,
  secretCode?: string // Optionaler Admin-Code
) {
  try {
    const response = await axios.post("/api/auth/register", {
      name,
      email,
      password,
      secretCode, // Optional den Admin-Code mitschicken
    });
    return response.data;
  } catch (error) {
    throw new Error("Error registering user");
  }
}
