-- DropForeignKey
ALTER TABLE "profile" DROP CONSTRAINT "profile_user_id_fkey";

-- AlterTable
ALTER TABLE "profile" ADD COLUMN     "count_updated_at" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "profile" ADD CONSTRAINT "profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tb_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
