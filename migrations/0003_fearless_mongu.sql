CREATE TABLE IF NOT EXISTS "admins" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL
);
