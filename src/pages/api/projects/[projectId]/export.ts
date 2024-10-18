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

  const { projectId } = req.query;

  if (req.method === "GET") {
    try {
      console.log("Fetching project data for export, projectId:", projectId);

      const projectWithExpenses = await prisma.project.findUnique({
        where: { id: projectId as string },
        include: {
          expenses: {
            include: {
              user: true,
              bills: {
                include: {
                  files: true,
                },
              },
            },
          },
        },
      });

      if (!projectWithExpenses) {
        console.log("Project not found");
        return res.status(404).json({ error: "Project not found" });
      }

      console.log(
        "Project found, expenses count:",
        projectWithExpenses.expenses.length
      );

      const formattedData = projectWithExpenses.expenses.map(
        (expense, index) => ({
          number: index + 1,
          date: expense.createdAt.toISOString().split("T")[0],
          amount: expense.amount,
          description: expense.description,
          category: expense.category,
          status: expense.status,
          user: expense.user?.name,
          travelStartDate: expense.travelStartDate
            ? expense.travelStartDate.toISOString().split("T")[0]
            : null,
          travelEndDate: expense.travelEndDate
            ? expense.travelEndDate.toISOString().split("T")[0]
            : null,
          billsCount: expense.bills.length,
          filesCount: expense.bills.reduce(
            (acc, bill) => acc + bill.files.length,
            0
          ),
        })
      );

      console.log("Formatted data length:", formattedData.length);

      return res.status(200).json(formattedData);
    } catch (error) {
      console.error("Error fetching project data for export:", error);
      return res
        .status(500)
        .json({ error: "Error fetching project data for export" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
