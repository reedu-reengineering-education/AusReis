/*
  Warnings:

  - Added the required column `budget` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "actualSpend" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "budget" DOUBLE PRECISION NOT NULL;
