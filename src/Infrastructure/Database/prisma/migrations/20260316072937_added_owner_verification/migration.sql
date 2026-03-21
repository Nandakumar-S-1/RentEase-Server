CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'SUBMITTED', 'VERIFIED', 'REJECTED');

ALTER TABLE "OwnerProfile" RENAME COLUMN "user_id" TO "userId";

ALTER TABLE "OwnerProfile"
ADD COLUMN "documentType" TEXT,
ADD COLUMN "documentUrl" TEXT,
ADD COLUMN "rejectionReason" TEXT,
ADD COLUMN "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN "verifiedAt" TIMESTAMP(3);