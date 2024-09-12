import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db"; // Prisma client
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Session-Überprüfung, um sicherzustellen, dass nur angemeldete Benutzer die API verwenden können
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // GET-Methode: Abrufen aller Projekte
  if (req.method === "GET") {
    try {
      const projects = await prisma.project.findMany({
        include: { users: true }, // Verknüpfte Benutzerdaten abrufen
      }); // Alle Projekte abrufen
      return res.status(200).json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      return res.status(500).json({ error: "Error fetching projects" });
    }
  }

  if (req.method === "POST") {
    const { name, status, budget, actualSpend, userIds } = req.body;

    // Überprüfen, ob alle erforderlichen Felder vorhanden sind
    if (
      !name ||
      !status ||
      !budget ||
      actualSpend === undefined ||
      !userIds ||
      !userIds.length
    ) {
      return res.status(400).json({
        error:
          "Missing required fields: name, status, budget, actualSpend, userIds",
      });
    }

    try {
      const project = await prisma.project.create({
        data: {
          name,
          status,
          budget: parseFloat(budget), // Ensure budget is a number
          actualSpend: parseFloat(actualSpend), // Ensure actualSpend is a number
          users: {
            connect: userIds.map((id: string) => ({ id })),
          },
        },
      });
      return res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      return res.status(500).json({ error: "Error creating project" });
    }
    // // POST-Methode: Neues Projekt erstellen
    // else if (req.method === "POST") {
    //   const { name, status, budget, actualSpend, userIds } = req.body;

    //   // Validierung der benötigten Felder
    //   if (
    //     !name ||
    //     !status ||
    //     !budget ||
    //     !actualSpend ||
    //     !userIds ||
    //     userIds.length === 0
    //   ) {
    //     return res.status(400).json({
    //       error:
    //         "Missing required fields: name, status, budget, actualSpend, userIds",
    //     });
    //   }

    //   try {
    //     // Neues Projekt erstellen
    //     const project = await prisma.project.create({
    //       data: {
    //         name,
    //         status,
    //         budget: parseFloat(budget),
    //         actualSpend: parseFloat(actualSpend),
    //         users: {
    //           connect: userIds.map((id: string) => ({ id })), // Benutzer verknüpfen
    //         },
    //       },
    //     });
    //     return res.status(201).json(project);
    //   } catch (error) {
    //     console.error("Error creating project:", error);
    //     return res.status(500).json({ error: "Error creating project" });
    //   }
    // }

    // Wenn die Methode nicht erlaubt ist
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed` });
  }
}
