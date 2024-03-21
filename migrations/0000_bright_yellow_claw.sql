CREATE TABLE IF NOT EXISTS "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone,
	"category_name" text NOT NULL,
	"icon_id" text NOT NULL,
	"no_of_products" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "feedbacks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone,
	"customer_id" uuid NOT NULL,
	"feedback" text NOT NULL,
	"rating" integer NOT NULL,
	"product_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone,
	"customer_id" uuid NOT NULL,
	"items" jsonb DEFAULT 'null'::jsonb,
	"total_price" integer NOT NULL,
	"order_status" text NOT NULL,
	"billing_details" jsonb DEFAULT 'null'::jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	"product_name" text NOT NULL,
	"category_name" text NOT NULL,
	"image" text NOT NULL,
	"quantiy" text,
	"price" integer NOT NULL,
	"stock" integer NOT NULL,
	"description" text NOT NULL,
	"additional_info" text,
	"tags" text[] NOT NULL,
	"on_sale" boolean NOT NULL,
	"sale_percentage" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"company_name" text,
	"street_address" text NOT NULL,
	"country" text NOT NULL,
	"states" text NOT NULL,
	"zip_code" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
