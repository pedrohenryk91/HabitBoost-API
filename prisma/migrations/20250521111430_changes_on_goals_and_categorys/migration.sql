/*
  Warnings:

  - Added the required column `current_count` to the `goal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `target_count` to the `goal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "category" ADD COLUMN     "is_custom" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "goal" ADD COLUMN     "current_count" INTEGER NOT NULL,
ADD COLUMN     "target_count" INTEGER NOT NULL;
