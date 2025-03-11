alter table "public"."orders" add column "delivery_address" text;

-- Backfill existing rows with empty string
update "public"."orders" set "delivery_address" = '' where "delivery_address" is null;