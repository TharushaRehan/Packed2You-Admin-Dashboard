ALTER TABLE "products" ALTER COLUMN "stock" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "updated_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "additional_info" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "feedbacks" text[];--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "rating" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "tags" text[] NOT NULL;