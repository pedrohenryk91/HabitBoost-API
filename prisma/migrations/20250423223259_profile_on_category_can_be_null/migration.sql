-- DropForeignKey
ALTER TABLE "category" DROP CONSTRAINT "category_profile_id_fkey";

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
