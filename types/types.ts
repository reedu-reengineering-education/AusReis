import { Prisma } from "@prisma/client";

// Typ für Bills
export type BillType = {
  id: string;
  file: string;
  amount: number;
  createdAt: Date;
  userId: string;
  expenseId: string;
};

// Typ für Files
export type FileType = {
  id: number;
  filename: string;
  fileUrl?: string;
  mimeType?: string;
  size?: number;
  createdAt?: Date;
  userId?: string;
};

// Typ für Expenses
export type ExpenseType = {
  id: string;
  amount: number;
  description: string;
  status: ExpenseStatus;
  userId?: string;
  projectId: string;
  category: ExpenseCategory;
  createdAt: Date;
  bills: BillType[];
};

// Typ für Projects
export type ProjectType = {
  id: string;
  name: string;
  status: ProjectStatus;
  budget: number;
  actualSpend: number;
  createdAt: Date;
  users: UserType[];
  expenses: ExpenseType[];
};

// Typ für Users
export type UserType = {
  id: string;
  name?: string;
  email?: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt?: Date;
  projects: ProjectType[];
  expenses: ExpenseType[];
  files: FileType[];
};

// Typ für Form Data
export interface FormData {
  status: string;

  amount: number;

  description: string;

  projectId: string;

  userId: string; // Ensure this is always a string

  category: ExpenseCategory;

  bills: { file: string; amount: number }[];
}

// // Typ für Expenses mit Bills (Verwendung von Prisma)
// export type ExpenseWithBills = Prisma.ExpenseGetPayload<{
//   include: { bills: true };
// }>;

// // Typ für Expenses mit User (Verwendung von Prisma)
// export type ExpenseWithUser = Prisma.ExpenseGetPayload<{
//   include: { user: true };
// }>;

export type ExpenseStatus = "Approved" | "Pending" | "Rejected";
export type ExpenseCategory = "Reimbursement" | "Travel";
export type ProjectStatus = "Active" | "Inactive";
export type Role = "Admin" | "User";
