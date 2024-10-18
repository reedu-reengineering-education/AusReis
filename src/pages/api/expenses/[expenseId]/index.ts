// Api-Endpoint für spezifischen Anfragen
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { expenseId } = req.query;

  if (req.method === "GET") {
    try {
      const expense = await prisma.expense.findUnique({
        where: { id: String(expenseId) },
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
        where: { id: String(expenseId) },
        data: {
          amount,
          description,
          status,
          category,
          bills: {
            set: bills?.map((bill: { file: string; amount: number }) => ({
              file: bill.file,
              amount: bill.amount,
            })),
          },
        },
        include: {
          bills: true,
          user: true,
          project: true,
        },
      });
      return res.status(200).json(updatedExpense);
    } catch (error: any) {
      console.error("Error updating expense:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }
  if (req.method === "DELETE") {
    console.log("DELETE request received for ID:", expenseId); // Überprüfe, ob die ID korrekt abgefangen wird

    if (!expenseId || typeof expenseId !== "string") {
      console.log("Invalid or missing ID");
      return res.status(400).json({ error: "Invalid or missing expense ID" });
    }

    try {
      const expense = await prisma.expense.findUnique({
        where: { id: expenseId },
      });
      if (!expense) {
        console.log("Expense not found");
        return res.status(404).json({ error: "Expense not found" });
      }
      await prisma.expense.delete({
        where: { id: expenseId },
      });

      console.log("Expense deleted successfully");

      return res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
      console.error("Error deleting expense:", error);
      return res.status(500).json({ error: "Error deleting expense" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
    return res.status(405).json({ error: "Method not allowed" });
  }
}

export default handler;
