-- CreateEnum
CREATE TYPE "days" AS ENUM ('everyday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday');

-- AlterTable
ALTER TABLE "habit" ADD COLUMN     "days" "days"[];
