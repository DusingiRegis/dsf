-- Add currency column
ALTER TABLE "Property" ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'USD';
