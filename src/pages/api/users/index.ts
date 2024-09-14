// pages/api/users/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db"; // Prisma client importieren

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      // Lade alle Benutzer
      const users = await prisma.user.findMany();
      return res.status(200).json(users); // Korrekte Antwort senden
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ error: "Error fetching users" });
    }
  } else {
    // HTTP-Methoden-Handler für nicht erlaubte Methoden
    res.setHeader("Allow", ["GET"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed` });
  }
}
