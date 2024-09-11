// pages/api/admin/create.ts
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db"; // Prisma-Client

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, email, password } = req.body;

    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 10);

    // Admin erstellen
    try {
      const admin = await prisma.user.create({
        data: {
          name: name || "Admin User",
          email,
          password: hashedPassword,
          role: "ADMIN", // Admin-Rolle setzen
        },
      });

      return res.status(201).json({ message: "Admin created", admin });
    } catch (error) {
      return res.status(500).json({ error: "Failed to create admin" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
