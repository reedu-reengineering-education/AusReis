import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { name, email, password } = req.body;

    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: { name, email, password: hashedPassword },
      });

      return res.status(201).json(newUser);
    } catch (error) {
      console.error("Error registering user:", error);
      return res.status(500).json({ error: "Server error" });
    }
  } else {
    res.status(405).end();
  }
}

export default handler;
