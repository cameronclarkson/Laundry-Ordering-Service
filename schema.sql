-- Add delivery_address column to orders table
ALTER TABLE "public"."orders" ADD COLUMN "delivery_address" text;

-- Backfill existing rows with empty string
UPDATE "public"."orders" SET "delivery_address" = '' WHERE "delivery_address" IS NULL;