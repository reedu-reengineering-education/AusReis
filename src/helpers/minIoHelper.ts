import fs from "fs";
import { IncomingForm, type File } from "formidable";
import { saveFileInBucket } from "@/utils/s3-file-management";
import { nanoid } from "nanoid";
import prisma from "@/lib/db";

const bucketName = process.env.S3_BUCKET_NAME as string;

type ProcessedFiles = Array<[string, File]>;

export const uploadFiles = async (bills: any) => {
  console.log(bills);
  const file = fs.createReadStream(bills[0].file.filepath);
  // generate unique file name
  const fileName = `${nanoid(5)}-${bills[0].file.originalFilename}`;
  // Save file to S3 bucket and save file info to database concurrently
  await saveFileInBucket({
    bucketName,
    fileName,
    file,
  });
  //   save file info to database
  let results = await prisma.file.create({
    data: {
      filename: fileName,
      size: bills[0].file.size ?? 0,
    },
  });

  return results;
};

// Set error status and result body if error occurs
export function setErrorStatus(
  status: number,
  resultBody: { status: string; message: string }
) {
  status = 500;
  resultBody = {
    status: "fail",
    message: "Upload error",
  };
  return { status, resultBody };
}

// Disable body parser built-in to Next.js to allow formidable to work
export const config = {
  api: {
    bodyParser: false,
  },
};

export default uploadFiles;
