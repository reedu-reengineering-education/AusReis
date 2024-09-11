import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // if (!process.env.NEXTAUTH_SECRET) {
      //   throw new Error("NEXTAUTH_SECRET is not defined");
      // }

      // const token = jwt.sign({ userId: user.id }, process.env.NEXTAUTH_SECRET, {
      //   expiresIn: "1h",
      // });

      return res.status(200).json({ userId: user.id });
    } catch (error) {
      console.error("Error logging in user:", error);
      return res.status(500).json({ error: "Server error" });
    }
  } else {
    res.status(405).end();
  }
}

export default handler;
