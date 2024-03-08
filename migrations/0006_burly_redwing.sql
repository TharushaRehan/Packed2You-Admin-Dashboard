ALTER TABLE "orders" ALTER COLUMN "items" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "items" SET DEFAULT 'null'::jsonb;