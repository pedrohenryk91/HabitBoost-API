/*
  Warnings:

  - Added the required column `profile_id` to the `category` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "category_name_key";

-- DropIndex
DROP INDEX "goal_title_key";

-- DropIndex
DROP INDEX "habit_title_key";

-- AlterTable
ALTER TABLE "category" ADD COLUMN     "profile_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
