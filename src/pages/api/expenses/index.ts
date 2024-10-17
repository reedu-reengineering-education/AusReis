// Typ: API-Route für allgmeine Anfragen
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (req.method === "POST") {
    const { amount, description, userId, projectId, category, status, bills } =
      req.body.data;

    if (!amount || !description || !userId || !projectId || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      console.log("Bills:", bills);
      const newExpense = await prisma.expense.create({
        data: {
          amount,
          description,
          status: status || "pending",
          category,
          user: { connect: { id: userId } },
          project: { connect: { id: projectId } },
          bills: {
            create: {
              files: { connect: { id: req.body.xhr.id } },
              amount: amount,
              user: { connect: { id: userId } },
            },
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
        where: {
          userId: session?.user.id,
        },
        include: {
          bills: { include: { files: true } },
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
