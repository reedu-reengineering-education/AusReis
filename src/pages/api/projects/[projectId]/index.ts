import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";
import { withMethods } from "@/lib/apiMiddlewares/withMethods";
import { withProject } from "@/lib/apiMiddlewares/withProject";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  // Überprüfe, ob der Benutzer authentifiziert ist
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Überprüfe, ob der Benutzer Admin ist
  const isAdmin = session.user.role === "admin";
  const { projectId } = req.query;

  // Überprüfe, ob die Anfrage GET, PUT oder DELETE ist
  if (req.method === "GET") {
    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId as string },
        include: {
          users: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      return res.status(200).json(project);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" });
    }
  } else if (req.method === "PUT") {
    if (!isAdmin) {
      return res
        .status(403)
        .json({ error: "Forbidden: Only admins can update projects." });
    }

    const { name, status, budget, actualSpend, userIds } = req.body;

    try {
      const updatedProject = await prisma.project.update({
        where: { id: projectId as string },
        data: {
          name,
          status,
          budget: parseFloat(budget),
          actualSpend: parseFloat(actualSpend),
          users: {
            set: userIds.map((id: string) => ({ id })),
          },
        },
        include: { users: { select: { id: true, name: true } } },
      });

      return res.status(200).json(updatedProject);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" });
    }
  } else if (req.method === "DELETE") {
    if (!isAdmin) {
      return res
        .status(403)
        .json({ error: "Forbidden: Only admins can delete projects." });
    }

    try {
      await prisma.project.delete({
        where: { id: projectId as string },
      });

      return res.status(204).end();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" });
    }
  } else {
    res.status(405).end();
  }
}

export default withMethods(["GET", "PUT", "DELETE"], withProject(handler));
