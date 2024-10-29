// export default handler;
// Path: src/pages/api/expenses/[expenseId]/index.ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { handleEmailFire } from "@/helpers/email-helper";
import AdminExpenseEditedNotification from "@/components/email/AdminExpenseEditedNotification";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

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
    const { grossAmount, netAmount, description, status, category, bills } =
      req.body;

    try {
      const originalExpense = await prisma.expense.findUnique({
        where: { id: String(expenseId) },
        include: { user: true, project: true },
      });

      if (!originalExpense) {
        return res.status(404).json({ error: "Expense not found" });
      }

      const updatedExpense = await prisma.expense.update({
        where: { id: String(expenseId) },
        data: {
          grossAmount,
          netAmount,
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

      // Send notification to the expense owner (user or admin)
      await handleEmailFire({
        to: originalExpense.user?.email || "",
        subject: "Your Expense has been edited",
        component: AdminExpenseEditedNotification,
        props: {
          expenseId: updatedExpense.id,
          grossAmount: updatedExpense.grossAmount,
          netAmount: updatedExpense.netAmount,
          description: updatedExpense.description,
          status: updatedExpense.status,
          category: updatedExpense.category,
          bills: updatedExpense.bills,
          createdBy:
            originalExpense.user?.name ||
            originalExpense.user?.email ||
            "Unknown",
          projectName: updatedExpense.project?.name || "Unknown",
          projectStatus: updatedExpense.project?.status || "Unknown",
          baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "",
          editedBy:
            session.user.name || session.user.email || "An administrator",
        },
        from: "",
        html: "",
      });

      return res.status(200).json(updatedExpense);
    } catch (error: any) {
      console.error("Error updating expense:", error.message);
      return res.status(500).json({ error: error.message });
    }
  } else if (req.method === "DELETE") {
    try {
      const expense = await prisma.expense.findUnique({
        where: { id: String(expenseId) },
      });
      if (!expense) {
        return res.status(404).json({ error: "Expense not found" });
      }
      await prisma.expense.delete({
        where: { id: String(expenseId) },
      });

      return res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
      console.error("Error deleting expense:", error);
      return res.status(500).json({ error: "Error deleting expense" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
