import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/db";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export function withUser(handler: NextApiHandler) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    try {
      const session = await getServerSession(req, res, authOptions);

      if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      (req as any).user = user;

      return handler(req, res);
    } catch (error) {
      console.error(error);
      return res.status(500).end();
    }
  };
}
