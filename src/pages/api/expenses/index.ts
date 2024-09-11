import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { amount, description, status, userId, projectId } = req.body;

    try {
      const newExpense = await prisma.expense.create({
        data: {
          amount,
          description,
          status: status || "PENDING",
          user: { connect: { id: userId } },
          project: { connect: { id: projectId } },
        },
      });

      return res.status(201).json(newExpense);
    } catch (error) {
      console.error("Error creating expense:", error);
      return res.status(500).json({ error: "Error creating expense" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
