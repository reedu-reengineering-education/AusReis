import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  const isAdmin = session?.user.role === "admin";

  if (!isAdmin) {
    return res.status(403).json({ error: "Forbidden: only for admins" });
  } else if (req.method === "GET") {
    try {
      const expenses = await prisma.expense.findMany({
        select: {
          id: true,
          amount: true,
          description: true,
          status: true,
          category: true,
          travelStartDate: true,
          travelEndDate: true,
          userId: true,
          projectId: true,
          createdAt: true,
          bills: {
            select: {
              id: true,
              amount: true,
              files: {
                select: {
                  id: true,
                  filename: true,
                  fileUrl: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          project: {
            select: {
              id: true,
              name: true,
              status: true,
            },
          },
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
