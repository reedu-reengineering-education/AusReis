// Path: src/pages/api/expenses/%5BexpenseId%5D/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import UserExpenseCreatedNotification from "@/components/email/UserExpenseCreatedNotification";
import { handleEmailFire } from "@/helpers/email-helper";
import { ExpenseStatus, ProjectStatus } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (req.method === "POST") {
    const {
      grossAmount,
      netAmount,
      description,
      userId,
      projectId,
      category,
      status,
      bills,
      travelStartDate,
      travelEndDate,
    } = req.body;

    if (
      !grossAmount ||
      !netAmount ||
      !description ||
      !userId ||
      !projectId ||
      !category
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      // Log the received bills data
      console.log("Received bills data:", JSON.stringify(bills, null, 2));

      const newExpense = await prisma.expense.create({
        data: {
          grossAmount,
          netAmount,
          description,
          status: status || "pending",
          category,
          travelStartDate: travelStartDate ? new Date(travelStartDate) : null,
          travelEndDate: travelEndDate ? new Date(travelEndDate) : null,
          user: { connect: { id: userId } },
          project: { connect: { id: projectId } },
          bills: {
            create: bills.map((bill: { fileId: string; amount: number }) => {
              // Log each bill being processed
              console.log("Processing bill:", JSON.stringify(bill, null, 2));

              if (!bill.fileId) {
                console.error("Missing fileId for bill:", bill);
                throw new Error("Missing fileId for bill");
              }

              return {
                amount: bill.amount,
                user: { connect: { id: userId } },
                files: { connect: [{ id: bill.fileId }] }, // Connect as an array
              };
            }),
          },
        },
        include: {
          user: true,
          project: true,
          bills: {
            include: {
              files: true,
            },
          },
        },
      });

      // Log the created expense
      console.log("Created expense:", JSON.stringify(newExpense, null, 2));

      // Send email notifications
      const adminUsers = await prisma.user.findMany({
        where: { role: "admin" },
        select: { email: true },
      });
      for (const admin of adminUsers) {
        if (admin.email) {
          await handleEmailFire({
            to: admin.email,
            subject: "New Expense Created",
            component: UserExpenseCreatedNotification,
            props: {
              expenseId: newExpense.id,
              grossAmount: newExpense.grossAmount,
              netAmount: newExpense.netAmount,
              description: newExpense.description,
              category: newExpense.category,
              createdBy: newExpense.user?.name || newExpense.user?.email,
              projectName: newExpense.project.name,
              projectStatus: newExpense.project.status,
              ExpenseStatus: newExpense.status,
            },
            from: "",
            html: "",
          });
        }
      }

      return res.status(201).json(newExpense);
    } catch (error) {
      console.error("Error creating expense:", error);
      return res.status(500).json({
        error: "Error creating expense",
        details: (error as any).message,
      });
    }
  } else if (req.method === "GET") {
    try {
      const expenses = await prisma.expense.findMany({
        where: {
          userId: session?.user.id,
        },
        select: {
          id: true,
          grossAmount: true,
          netAmount: true,
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
