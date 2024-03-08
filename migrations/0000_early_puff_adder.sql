CREATE TABLE IF NOT EXISTS "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created-at" timestamp with time zone,
	"category_name" text NOT NULL,
	"icon_id" text NOT NULL,
	"no_of_products" numeric NOT NULL
);
