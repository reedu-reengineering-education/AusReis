import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      const projects = await prisma.project.findMany({
        select: {
          id: true,
          name: true,
          status: true,
          budget: true,
          actualSpend: true,
          users: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      return res.status(200).json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      return res.status(500).json({ error: "Error fetching projects" });
    }
  }

  if (req.method === "POST") {
    const isAdmin = session.user.role === "admin";
    if (!isAdmin) {
      return res
        .status(403)
        .json({ error: "Forbidden: Only admins can create projects." });
    }

    const { name, status, budget, actualSpend, users } = req.body;

    if (
      !name ||
      !status ||
      !budget ||
      actualSpend === undefined ||
      !users ||
      !Array.isArray(users) ||
      users.length === 0
    ) {
      return res.status(400).json({
        error:
          "Missing or invalid required fields: name, status, budget, actualSpend, users",
      });
    }

    try {
      const project = await prisma.project.create({
        data: {
          name,
          status,
          budget: parseFloat(budget),
          actualSpend: parseFloat(actualSpend),
          users: {
            connect: users.map((id: string) => ({ id })),
          },
        },
        select: {
          id: true,
          name: true,
          status: true,
          budget: true,
          actualSpend: true,
          users: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      return res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      return res.status(500).json({ error: "Error creating project" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}
