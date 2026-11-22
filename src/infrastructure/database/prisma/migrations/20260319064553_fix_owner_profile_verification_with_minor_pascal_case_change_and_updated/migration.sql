/*
  Warnings:

  - The `verificationStatus` column on the `OwnerProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum

-- AlterTable
ALTER TABLE "OwnerProfile" DROP COLUMN "verificationStatus",
ADD COLUMN     "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "verifiedAt" SET DEFAULT CURRENT_TIMESTAMP;

