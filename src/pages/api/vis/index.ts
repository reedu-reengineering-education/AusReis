import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUserProjectHierarchy = async () => {
  const users = await prisma.user.findMany({
    include: {
      projects: {
        include: {
          Expense: true, // Alle Ausgaben für jedes Projekt laden
        },
      },
    },
  });

  return users;
};
