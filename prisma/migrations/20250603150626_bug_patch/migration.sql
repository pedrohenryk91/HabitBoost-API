/*
  Warnings:

  - The `days` column on the `habit` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "habit" DROP COLUMN "days",
ADD COLUMN     "days" TEXT[];
