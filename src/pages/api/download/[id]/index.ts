import { NextApiRequest, NextApiResponse } from "next";
import { getFileFromBucket } from "@/utils/s3-file-management";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const bucketName = process.env.S3_BUCKET_NAME as string;

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(403).end();
  }

  const { id } = req.query;

  const numericId = parseInt(id as string, 10);
  if (isNaN(numericId))
    return res.status(400).json({ message: "Invalid request" });

  // get the file name and original name from the database
  const fileObject = await prisma.file.findUnique({
    where: {
      id: numericId,
    },
    select: {
      filename: true,
      userId: true,
    },
  });
  if (!fileObject) {
    return res.status(404).json({ message: "Item not found" });
  }
  // get the file from the bucket and pipe it to the response object
  const data = await getFileFromBucket({
    bucketName: bucketName,
    fileName: fileObject?.filename,
  });

  if (!data) {
    return res.status(404).json({ message: "Item not found" });
  }

  if (session.user.role !== "admin" && fileObject.userId !== session.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  // set header for download file
  res.setHeader(
    "content-disposition",
    `attachment; filename="${fileObject?.filename}"`
  );

  // pipe the data to the res object
  data.pipe(res);
}

export default handler;
