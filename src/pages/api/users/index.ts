import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";
import { withMethods } from "@/lib/apiMiddlewares/withMethods";
import { withUser } from "@/lib/apiMiddlewares/withUser";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const users = await prisma.user.findMany();
      return res.status(200).json(users);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" });
    }
  } else if (req.method === "POST") {
    const { name, email, password } = req.body;

    try {
      const newUser = await prisma.user.create({
        data: { name, email, password },
      });

      return res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" });
    }
  } else {
    res.status(405).end();
  }
}

export default withMethods(["GET", "POST"], withUser(handler));
