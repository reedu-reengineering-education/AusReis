import formidable from "formidable";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

export default async function handler(req, res) {
  const form = new formidable.IncomingForm();
  form.uploadDir = uploadDir;
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: "Error parsing files" });
      return;
    }

    const uploadedFiles = [];
    for (const file of Object.values(files)) {
      const newPath = path.join(uploadDir, file.name);
      fs.renameSync(file.path, newPath);

      const savedFile = await prisma.file.create({
        data: {
          name: file.name,
          path: newPath,
        },
      });

      uploadedFiles.push(savedFile);
    }

    res.status(200).json({ files: uploadedFiles });
  });
}
