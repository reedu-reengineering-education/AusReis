import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/app/lib/db";
import { withMethods } from "@/app/lib/apiMiddlewares/withMethods";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { id } = req.query;

    try {
      const file = await prisma.file.findUnique({
        where: { id: id as string },
      });

      if (!file) {
        res.status(404).json({ error: "File not found" });
        return;
      }

      res.status(200).json(file);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  } else if (req.method === "POST") {
    const { name, path } = req.body;

    try {
      const newFile = await prisma.file.create({
        data: { name, path },
      });

      res.status(201).json(newFile);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  } else if (req.method === "PUT") {
    const { id } = req.query;
    const { name, path } = req.body;

    try {
      const updatedFile = await prisma.file.update({
        where: { id: id as string },
        data: { name, path },
      });

      res.status(200).json(updatedFile);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.query;

    try {
      await prisma.file.delete({
        where: { id: id as string },
      });

      res.status(204).end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  } else {
    res.status(405).end();
  }
}

export default withMethods(["GET", "POST", "PUT", "DELETE"], handler);
