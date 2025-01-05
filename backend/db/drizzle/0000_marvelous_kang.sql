CREATE TABLE "menu_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"section_id" integer,
	"name" varchar(200) NOT NULL,
	"description" text,
	"price" numeric(10, 2) NOT NULL,
	"image_url" varchar(255),
	"is_available" boolean DEFAULT true,
	"display_order" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "menu_sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"restaurant_id" integer,
	"name" varchar(100) NOT NULL,
	"description" text,
	"display_order" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer,
	"menu_item_id" integer,
	"quantity" integer NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"special_instructions" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"restaurant_id" integer,
	"table_id" integer,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"total_amount" numeric(10, 2) DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "restaurant_tables" (
	"id" serial PRIMARY KEY NOT NULL,
	"restaurant_id" integer,
	"table_number" varchar(20) NOT NULL,
	"seating_capacity" integer NOT NULL,
	"is_available" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "restaurants" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"name" varchar(200) NOT NULL,
	"owner_name" varchar(100) NOT NULL,
	"location" text NOT NULL,
	"phone_number" varchar(20) NOT NULL,
	"cuisine_type" varchar(50) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_section_id_menu_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."menu_sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "menu_sections" ADD CONSTRAINT "menu_sections_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_menu_item_id_menu_items_id_fk" FOREIGN KEY ("menu_item_id") REFERENCES "public"."menu_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_table_id_restaurant_tables_id_fk" FOREIGN KEY ("table_id") REFERENCES "public"."restaurant_tables"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "restaurant_tables" ADD CONSTRAINT "restaurant_tables_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_table_per_restaurant" ON "restaurant_tables" USING btree ("restaurant_id","table_number");