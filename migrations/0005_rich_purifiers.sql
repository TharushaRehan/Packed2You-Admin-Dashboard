ALTER TABLE "orders" ALTER COLUMN "items" SET DEFAULT 'null'::json;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "items" DROP NOT NULL;