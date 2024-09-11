import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db"; // Prisma-Client wird verwendet

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const projects = await prisma.project.findMany({
        include: {
          users: true,
          Expense: true,
        },
      });
      return res.status(200).json(projects);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error fetching projects", error });
    }
  } else if (req.method === "POST") {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }

    try {
      const project = await prisma.project.create({
        data: {
          name,
        },
      });
      return res.status(201).json(project);
    } catch (error) {
      return res.status(500).json({ message: "Error creating project", error });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
