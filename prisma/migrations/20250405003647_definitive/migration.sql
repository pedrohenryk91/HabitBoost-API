/*
  Warnings:

  - You are about to drop the column `current_reps` on the `goal` table. All the data in the column will be lost.
  - You are about to drop the column `total_reps` on the `goal` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `profile` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `tb_user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `tb_user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `tb_user` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "profile_username_key";

-- AlterTable
ALTER TABLE "goal" DROP COLUMN "current_reps",
DROP COLUMN "total_reps";

-- AlterTable
ALTER TABLE "habit" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "profile" DROP COLUMN "username";

-- AlterTable
ALTER TABLE "tb_user" DROP COLUMN "verified",
ADD COLUMN     "username" TEXT NOT NULL,
ADD COLUMN     "verified_status" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "days";

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_username_key" ON "tb_user"("username");
