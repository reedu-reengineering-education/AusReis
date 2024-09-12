import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Project ID is required" });
  }

  try {
    if (req.method === "GET") {
      // Ein bestimmtes Projekt abrufen
      const project = await prisma.project.findUnique({
        where: { id },
      });

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      return res.status(200).json(project);
    } else if (req.method === "PUT") {
      const { name, status, budget, actualSpend } = req.body;

      // Überprüfen, ob alle Felder vorhanden sind
      if (
        !name ||
        !status ||
        budget === undefined ||
        actualSpend === undefined
      ) {
        return res
          .status(400)
          .json({
            error: "Name, status, budget, and actualSpend are required",
          });
      }

      // Sicherstellen, dass budget und actualSpend Zahlen sind
      const parsedBudget = parseFloat(budget);
      const parsedActualSpend = parseFloat(actualSpend);

      if (isNaN(parsedBudget) || isNaN(parsedActualSpend)) {
        return res
          .status(400)
          .json({ error: "Budget and actualSpend must be valid numbers" });
      }

      // Projekt aktualisieren
      const updatedProject = await prisma.project.update({
        where: { id },
        data: {
          name,
          status,
          budget: parsedBudget,
          actualSpend: parsedActualSpend,
        },
      });

      return res.status(200).json(updatedProject);
    } else if (req.method === "DELETE") {
      // Projekt löschen
      await prisma.project.delete({
        where: { id },
      });

      return res.status(204).end();
    } else {
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error handling project:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
