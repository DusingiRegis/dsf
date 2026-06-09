-- AlterTable
ALTER TABLE "Property" ADD COLUMN "neighborhood" TEXT;
ALTER TABLE "Property" ADD COLUMN "contactPhone" TEXT;
ALTER TABLE "Property" ADD COLUMN "furnished" BOOLEAN;
ALTER TABLE "Property" ADD COLUMN "pricePeriod" TEXT;
ALTER TABLE "Property" ADD COLUMN "titleDeed" TEXT;
ALTER TABLE "Property" ADD COLUMN "titleDeedType" TEXT;
ALTER TABLE "Property" ADD COLUMN "plotSize" DOUBLE PRECISION;
ALTER TABLE "Property" ADD COLUMN "zoning" TEXT;
ALTER TABLE "Property" ADD COLUMN "roadAccess" TEXT;
ALTER TABLE "Property" ADD COLUMN "make" TEXT;
ALTER TABLE "Property" ADD COLUMN "model" TEXT;
ALTER TABLE "Property" ADD COLUMN "year" INTEGER;
ALTER TABLE "Property" ADD COLUMN "mileage" INTEGER;
ALTER TABLE "Property" ADD COLUMN "fuelType" TEXT;
ALTER TABLE "Property" ADD COLUMN "transmission" TEXT;
ALTER TABLE "Property" ADD COLUMN "color" TEXT;
ALTER TABLE "Property" ADD COLUMN "features" TEXT;
ALTER TABLE "Property" ADD COLUMN "acceptInquiries" BOOLEAN NOT NULL DEFAULT true;

-- Make size nullable (since current schema has size Float?)
ALTER TABLE "Property" ALTER COLUMN "size" DROP NOT NULL;
