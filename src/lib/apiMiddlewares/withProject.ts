import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/db";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export function withProject(handler: NextApiHandler) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    try {
      // Session abrufen und überprüfen
      const session = await getServerSession(req, res, authOptions);

      if (!session) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Das Projekt anhand der ID abrufen
      const project = await prisma.project.findUnique({
        where: {
          id: req.query.projectId as string, // Sicherstellen, dass projectId aus der Query kommt
        },
        include: {
          users: true, // Benutzer mit einbeziehen, um zu prüfen, ob der User dazugehört
        },
      });

      // Wenn das Projekt nicht existiert, Zugriff verweigern
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Überprüfen, ob der angemeldete Benutzer Teil des Projekts oder Admin ist
      const userIsInProject = project.users.some(
        (user) => user.id === session.user.id
      );

      if (!userIsInProject && session.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      // Wenn alles passt, den ursprünglichen API-Handler aufrufen
      return handler(req, res);
    } catch (error) {
      console.error("Error in withProject middleware:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}
