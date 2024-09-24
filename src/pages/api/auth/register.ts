import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db"; // Prisma-Datenbankzugriff importieren
import bcrypt from "bcryptjs"; // Für Passwort-Hashing
import { Prisma } from "@prisma/client"; // Prisma-Spezifische Fehler
import { Role } from "@prisma/client"; // Import Role type from Prisma client

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, email, password, secretCode } = req.body;

  try {
    // Überprüfung auf bereits existierende Benutzer
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Passwort-Hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Rolle bestimmen
    let role: Role = Role.user; // Standardmäßig USER

    if (secretCode === process.env.ADMIN_SECRET_CODE) {
      role = Role.admin; // Adminrolle setzen, wenn der geheime Code korrekt ist
    }

    // Benutzer in der Datenbank erstellen
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    return res.status(201).json(user); // Erfolgreich erstellt
  } catch (error: any) {
    // Prisma-Spezifische Fehlerbehandlung
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        // Fehlercode P2002 bedeutet, dass ein eindeutiger Wert verletzt wurde (z.B. E-Mail ist bereits registriert)
        return res.status(409).json({ error: "Email is already registered" });
      }
    }

    // Detailliertere allgemeine Fehlerbehandlung
    console.error("Error registering user:", error);

    if (error.message.includes("ECONNREFUSED")) {
      // Wenn die Verbindung zur Datenbank nicht hergestellt werden kann
      return res.status(503).json({ error: "Database connection refused" });
    }

    // Generischer Server-Fehler
    return res.status(500).json({ error: "Server error" });
  }
}
