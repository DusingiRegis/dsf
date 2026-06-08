-- AlterTable
ALTER TABLE "PropertySubmission" ADD COLUMN "listingStatus" TEXT NOT NULL DEFAULT 'forSale';
ALTER TABLE "PropertySubmission" ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'USD';
ALTER TABLE "PropertySubmission" ADD COLUMN "bedrooms" INTEGER;
ALTER TABLE "PropertySubmission" ADD COLUMN "bathrooms" INTEGER;
