-- DropForeignKey
ALTER TABLE "Evidence" DROP CONSTRAINT "Evidence_indicatorId_fkey";

-- AlterTable
ALTER TABLE "Evidence" ALTER COLUMN "indicatorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_indicatorId_fkey" FOREIGN KEY ("indicatorId") REFERENCES "Indicator"("id") ON DELETE SET NULL ON UPDATE CASCADE;
