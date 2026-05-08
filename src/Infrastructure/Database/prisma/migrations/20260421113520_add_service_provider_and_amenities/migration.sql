-- AlterTable
ALTER TABLE "PropertyDetails" ADD COLUMN     "amenities" TEXT[];

-- CreateTable
CREATE TABLE "ServiceProvider" (
    "id" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,
    "provider_type" VARCHAR(50) NOT NULL,
    "provider_name" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "typical_charges_min" DECIMAL(8,2),
    "typical_charges_max" DECIMAL(8,2),
    "rating" DECIMAL(3,2) DEFAULT 0,
    "total_jobs_completed" INTEGER DEFAULT 0,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceProvider_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ServiceProvider_property_id_idx" ON "ServiceProvider"("property_id");

-- CreateIndex
CREATE INDEX "ServiceProvider_provider_type_idx" ON "ServiceProvider"("provider_type");

-- AddForeignKey
ALTER TABLE "ServiceProvider" ADD CONSTRAINT "ServiceProvider_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
