import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";
import { withMethods } from "@/lib/apiMiddlewares/withMethods";
import { withUser } from "@/lib/apiMiddlewares/withUser";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  if (req.method === "GET") {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId as string }, // Sucht nach der ID
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" });
    }
  } else if (req.method === "PUT") {
    const { name, email, password } = req.body;

    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId as string },
        data: { name, email, password },
      });

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" });
    }
  } else if (req.method === "DELETE") {
    try {
      await prisma.user.delete({
        where: { id: userId as string },
      });

      return res.status(204).end();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" });
    }
  } else {
    res.status(405).end();
  }
}

export default withMethods(["GET", "PUT", "DELETE"], handler);
