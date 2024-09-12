-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('ACTIVE', 'PENDING', 'COMPLETED');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "status" "ProjectStatus" NOT NULL DEFAULT 'PENDING';
