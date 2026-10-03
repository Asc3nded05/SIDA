-- AlterTable
ALTER TABLE "Work" ADD COLUMN     "commissionRequestId" TEXT;

-- CreateIndex
CREATE INDEX "Work_commissionRequestId_idx" ON "Work"("commissionRequestId");

-- AddForeignKey
ALTER TABLE "Work" ADD CONSTRAINT "Work_commissionRequestId_fkey" FOREIGN KEY ("commissionRequestId") REFERENCES "CommissionRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
