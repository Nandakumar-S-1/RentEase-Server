-- CreateEnum
CREATE TYPE "AgreementStatus" AS ENUM ('DRAFT', 'PENDING_TENANT_SIGNATURE', 'ACTIVE', 'EXPIRED', 'TERMINATED');

-- CreateEnum
CREATE TYPE "DepositRefundStatus" AS ENUM ('PENDING', 'PARTIAL', 'FULL', 'DISPUTED');

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "rejectionReason" TEXT;

-- CreateTable
CREATE TABLE "Agreement" (
    "id" TEXT NOT NULL,
    "agreementNumber" VARCHAR(50) NOT NULL,
    "propertyId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "lockInPeriodMonths" INTEGER NOT NULL,
    "noticePeriodMonths" INTEGER NOT NULL,
    "monthlyRent" DECIMAL(10,2) NOT NULL,
    "depositAmount" DECIMAL(10,2) NOT NULL,
    "maintenanceCharges" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "maintenanceIncluded" BOOLEAN NOT NULL DEFAULT true,
    "lateFeePerDay" DECIMAL(8,2) NOT NULL DEFAULT 100,
    "lateFeeGracePeriodDays" INTEGER NOT NULL DEFAULT 3,
    "rentEscalationPercentage" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "termsAndConditions" JSONB,
    "customClauses" TEXT,
    "tenantRemarks" TEXT,
    "ownerSignatureUrl" TEXT,
    "ownerSignedAt" TIMESTAMP(3),
    "tenantSignatureUrl" TEXT,
    "tenantSignedAt" TIMESTAMP(3),
    "agreementPdfUrl" TEXT,
    "status" "AgreementStatus" NOT NULL DEFAULT 'DRAFT',
    "terminationReason" TEXT,
    "terminatedAt" TIMESTAMP(3),
    "terminatedById" TEXT,
    "depositPaid" BOOLEAN NOT NULL DEFAULT false,
    "depositPaidAt" TIMESTAMP(3),
    "depositRefundStatus" "DepositRefundStatus",
    "depositRefundAmount" DECIMAL(10,2),
    "depositRefundDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agreement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Agreement_agreementNumber_key" ON "Agreement"("agreementNumber");

-- CreateIndex
CREATE INDEX "Agreement_agreementNumber_idx" ON "Agreement"("agreementNumber");

-- CreateIndex
CREATE INDEX "Agreement_propertyId_idx" ON "Agreement"("propertyId");

-- CreateIndex
CREATE INDEX "Agreement_ownerId_idx" ON "Agreement"("ownerId");

-- CreateIndex
CREATE INDEX "Agreement_tenantId_idx" ON "Agreement"("tenantId");

-- CreateIndex
CREATE INDEX "Agreement_status_idx" ON "Agreement"("status");

-- CreateIndex
CREATE INDEX "Agreement_startDate_endDate_idx" ON "Agreement"("startDate", "endDate");

-- AddForeignKey
ALTER TABLE "Agreement" ADD CONSTRAINT "Agreement_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agreement" ADD CONSTRAINT "Agreement_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agreement" ADD CONSTRAINT "Agreement_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agreement" ADD CONSTRAINT "Agreement_terminatedById_fkey" FOREIGN KEY ("terminatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
