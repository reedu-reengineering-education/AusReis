import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";
import { withMethods } from "@/lib/apiMiddlewares/withMethods";
import { withUser } from "@/lib/apiMiddlewares/withUser";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { usersId } = req.query;

  if (typeof usersId !== "string" || usersId.length !== 25) {
    return res.status(400).json({ error: "Invalid user ID format" });
  }

  console.log("Received userId:", usersId, "Type:", typeof usersId);
  console.log("Request method:", req.method);
  console.log("Request body:", req.body);
  console.log("Raw query:", req.query);
  console.log("Received userId in API route:", req.query.usersId);
  console.log("Logged in user ID:", (req as any).user?.id); // Wenn Sie req.user in Ihrer Middleware setzen
  console.log("Parsed userId:", usersId);
  console.log("userId type:", typeof usersId);
  console.log("userId length:", usersId.length);

  if (req.method === "GET") {
    try {
      const user = await prisma.user.findUnique({
        where: { id: usersId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ error: "Server error" });
    }
  } else if (req.method === "PUT") {
    const { name, email, role } = req.body;
    const loggedInUser = (req as any).user;

    if (loggedInUser.role !== "admin") {
      return res.status(403).json({ error: "Only admins can update users" });
    }

    if (!name || !email || !role) {
      console.log("Missing required fields:", { name, email, role });
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id: req.query.usersId as string },
        data: {
          name,
          email,
          role: role as "user" | "admin",
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      console.log("Updated user:", updatedUser);
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      // @ts-ignore
      if (error.code === "P2025") {
        return res.status(404).json({ error: "User not found" });
      }
      return (
        res
          .status(500)
          // @ts-ignore
          .json({ error: "Failed to update user", details: error.message })
      );
    }
  } else if (req.method === "DELETE") {
    try {
      await prisma.user.delete({
        where: { id: usersId },
      });

      return res.status(204).end();
    } catch (error) {
      console.error("Error deleting user:", error);
      // @ts-ignore
      if (error.code === "P2025") {
        return res.status(404).json({ error: "User not found" });
      }
      return (
        res
          .status(500)
          // @ts-ignore
          .json({ error: "Failed to delete user", details: error.message })
      );
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withMethods(["GET", "PUT", "DELETE"], withUser(handler));
