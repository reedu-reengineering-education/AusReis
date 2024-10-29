import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Handler function called");
  console.log("Request method:", req.method);
  console.log("Request query:", req.query);

  const session = await getServerSession(req, res, authOptions);
  console.log("Session:", session ? "Exists" : "Does not exist");

  if (!session) {
    console.log("Unauthorized access attempt");
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { projectId } = req.query;
  console.log("Extracted projectId:", projectId);

  if (req.method === "GET") {
    console.log("Processing GET request");
    try {
      console.log("Fetching project data for export, projectId:", projectId);

      if (!projectId || typeof projectId !== "string") {
        console.log("Invalid projectId:", projectId);
        return res.status(400).json({ error: "Invalid project ID" });
      }

      console.log("Attempting to fetch project from database");
      const projectWithExpenses = await prisma.project.findUnique({
        where: { id: projectId },
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

      console.log("Database query completed");

      if (!projectWithExpenses) {
        console.log("Project not found in database");
        return res.status(404).json({ error: "Project not found" });
      }

      console.log("Project found, project details:", {
        id: projectWithExpenses.id,
        name: projectWithExpenses.name,
        expensesCount: projectWithExpenses.expenses.length,
      });

      console.log("Formatting expense data");
      const formattedData = projectWithExpenses.expenses.map(
        (expense, index) => {
          console.log(`Processing expense ${index + 1}:`, {
            id: expense.id,
            grossAmount: expense.grossAmount,
            netAmount: expense.netAmount,
            category: expense.category,
            status: expense.status,
          });
          return {
            number: index + 1,
            date: expense.createdAt.toISOString().split("T")[0],
            grossAmount: expense.grossAmount,
            netAmount: expense.netAmount,
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
          };
        }
      );

      console.log("Formatted data length:", formattedData.length);
      console.log("First formatted expense:", formattedData[0]);

      console.log("Sending response");
      return res.status(200).json(formattedData);
    } catch (error) {
      console.error("Error in try block:");
      console.error(error);
      console.error("Error details:", {
        name: error instanceof Error ? error.name : "Unknown",
        message: error instanceof Error ? error.message : "Unknown",
        stack: error instanceof Error ? error.stack : "No stack trace",
      });
      return res.status(500).json({
        error: "Error fetching project data for export",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  } else {
    console.log("Invalid HTTP method:", req.method);
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
