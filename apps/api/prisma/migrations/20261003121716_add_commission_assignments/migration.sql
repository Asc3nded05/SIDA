-- CreateTable
CREATE TABLE "CommissionAssignment" (
    "id" TEXT NOT NULL,
    "commissionRequestId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommissionAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CommissionAssignment_memberId_idx" ON "CommissionAssignment"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "CommissionAssignment_commissionRequestId_memberId_key" ON "CommissionAssignment"("commissionRequestId", "memberId");

-- AddForeignKey
ALTER TABLE "CommissionAssignment" ADD CONSTRAINT "CommissionAssignment_commissionRequestId_fkey" FOREIGN KEY ("commissionRequestId") REFERENCES "CommissionRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommissionAssignment" ADD CONSTRAINT "CommissionAssignment_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
