-- CreateEnum
CREATE TYPE "PropertyVerificationStatus" AS ENUM ('PENDING_APPROVAL', 'ACTIVE', 'RENTED', 'UNLISTED', 'REJECTED');

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "areaSqrt" INTEGER,
    "locationDistrict" TEXT NOT NULL,
    "locationCity" TEXT NOT NULL,
    "locationPincode" TEXT NOT NULL,
    "fullAddress" TEXT NOT NULL,
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "nearbyLandmarks" TEXT,
    "monthlyRent" DECIMAL(10,2) NOT NULL,
    "depositAmount" DECIMAL(10,2) NOT NULL,
    "maintenanceCharges" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "maintenanceIncluded" BOOLEAN NOT NULL DEFAULT true,
    "photos" TEXT[],
    "mainPhotoIndex" INTEGER NOT NULL DEFAULT 0,
    "videoTourUrl" TEXT,
    "status" "PropertyVerificationStatus" NOT NULL DEFAULT 'PENDING_APPROVAL',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "availableFrom" TIMESTAMP(3),
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
    "inquiryCount" INTEGER NOT NULL DEFAULT 0,
    "wishlistCount" INTEGER NOT NULL DEFAULT 0,
    "virtualTourCount" INTEGER NOT NULL DEFAULT 0,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyDetails" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "bhk" INTEGER,
    "bathrooms" INTEGER,
    "floorNumber" TEXT,
    "totalFloors" INTEGER,
    "propertyAge" TEXT,
    "facingDirection" TEXT,
    "furnishingStatus" TEXT,
    "landType" TEXT,
    "isCornerPlot" BOOLEAN,
    "roadWidthFeet" INTEGER,
    "shoptype" TEXT,
    "hasParking" BOOLEAN,
    "preferredTenantType" JSONB,
    "petsAllowed" BOOLEAN NOT NULL DEFAULT false,
    "smokingAllowed" BOOLEAN NOT NULL DEFAULT false,
    "maximumOccupants" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Property_ownerId_idx" ON "Property"("ownerId");

-- CreateIndex
CREATE INDEX "Property_status_idx" ON "Property"("status");

-- CreateIndex
CREATE INDEX "Property_locationDistrict_locationCity_idx" ON "Property"("locationDistrict", "locationCity");

-- CreateIndex
CREATE INDEX "Property_propertyType_idx" ON "Property"("propertyType");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyDetails_propertyId_key" ON "PropertyDetails"("propertyId");

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyDetails" ADD CONSTRAINT "PropertyDetails_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
