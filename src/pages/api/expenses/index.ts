import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { amount, description, status, userId, projectId, category, bills } =
      req.body;

    console.log("Request Body:", req.body); // Debugging: Zeigt den gesamten Body
    if (!amount || !description || !userId || !projectId || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Weitere Log-Ausgabe für Debugging
    console.log("All fields are present");
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
      console.log(newExpense);
      return res.status(201).json(newExpense);
    } catch (error) {
      console.error("Error creating expense:", error);
      return res.status(500).json({ error: "Error creating expense" });
    }
  } // Zum erstellen einer Liste der Ausgaben
  else if (req.method === "GET") {
    try {
      console.log("Fetching expenses...");
      const expenses = await prisma.expense.findMany({
        include: {
          bills: true,
          user: true,
          project: true,
        },
      });

      console.log("Expenses fetched:", expenses);
      return res.status(200).json(expenses);
    } catch (error: any) {
      console.error("Error fetching expenses:", error.message);
      return res
        .status(500)
        .json({ error: "Error fetching expenses", details: error.message });
    }
  }
  return res.status(405).json({ error: "Method not allowed" });
}
