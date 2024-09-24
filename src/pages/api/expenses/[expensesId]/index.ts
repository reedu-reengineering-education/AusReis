import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const expense = await prisma.expense.findUnique({
        where: { id: String(id) },
        include: { bills: true },
      });

      if (!expense) {
        return res.status(404).json({ error: "Expense not found" });
      }

      return res.status(200).json(expense);
    } catch (error) {
      console.error("Error fetching expense:", error);
      return res.status(500).json({ error: "Error fetching expense" });
    }
  } else if (req.method === "PUT") {
    const { amount, description, status, category, bills } = req.body;

    try {
      const updatedExpense = await prisma.expense.update({
        where: { id: String(id) },
        data: {
          amount,
          description,
          status,
          category,
          bills: {
            set: bills.map((bill: { file: string; amount: number }) => ({
              file: bill.file,
              amount: bill.amount,
            })),
          },
        },
      });
      return res.status(200).json(updatedExpense);
    } catch (error: any) {
      console.error("Error updating expense:", error.message);
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
