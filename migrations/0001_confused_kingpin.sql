CREATE TABLE IF NOT EXISTS "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone,
	"customer_id" uuid NOT NULL,
	"items" text NOT NULL,
	"total_price" numeric NOT NULL,
	"order_status" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone,
	"product_name" text NOT NULL,
	"category_name" text NOT NULL,
	"image" text NOT NULL,
	"quantiy" text,
	"price" text NOT NULL,
	"stock" numeric,
	"description" text
);
--> statement-breakpoint
ALTER TABLE "categories" RENAME COLUMN "created-at" TO "created_at";