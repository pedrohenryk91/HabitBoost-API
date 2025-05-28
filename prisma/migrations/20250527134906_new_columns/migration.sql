/*
  Warnings:

  - You are about to drop the column `dates` on the `habit` table. All the data in the column will be lost.
  - Added the required column `icon_id` to the `category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status_by_date` to the `habit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "category" ADD COLUMN     "icon_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "habit" DROP COLUMN "dates",
ADD COLUMN     "status_by_date" JSONB NOT NULL;
