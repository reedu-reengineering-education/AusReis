import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { amount, description, status, userId, projectId, category, bills } =
      req.body;

    try {
      const newExpense = await prisma.expense.create({
        data: {
          amount,
          description,
          status: status || "pending",
          category,
          user: { connect: { id: userId } },
          project: { connect: { id: projectId } },
          bills: {
            create: bills.map((bill: { file: string; amount: number }) => ({
              file: bill.file,
              amount: bill.amount,
            })),
          },
        },
      });

      return res.status(201).json(newExpense);
    } catch (error) {
      console.error("Error creating expense:", error);
      return res.status(500).json({ error: "Error creating expense" });
    }
  } // Zum erstellen einer Liste der Ausgaben
  else if (req.method === "GET") {
    try {
      const expenses = await prisma.expense.findMany({
        include: {
          bills: true,
          user: true,
          project: true,
        },
      });

      return res.status(200).json(expenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      return res.status(500).json({ error: "Error fetching expenses" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
