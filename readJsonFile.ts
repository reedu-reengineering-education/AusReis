import fs from "fs";
import path from "path";

export const readJsonFile = (filePath: string) => {
  const absolutePath = path.resolve(filePath);
  const fileContent = fs.readFileSync(absolutePath, "utf-8");
  return JSON.parse(fileContent);
};
