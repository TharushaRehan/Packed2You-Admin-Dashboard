import {
  boolean,
  integer,
  json,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  companyName: text("company_name"),
  streetAddress: text("street_address").notNull(),
  country: text("country").notNull(),
  states: text("states").notNull(),
  zipcode: integer("zip_code").notNull(),
});

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }),
  categoryName: text("category_name").notNull(),
  iconId: text("icon_id").notNull(),
  noOfProducts: integer("no_of_products").notNull(),
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  }),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "string",
  }),
  productName: text("product_name").notNull(),
  categoryName: text("category_name").notNull(),
  image: text("image").notNull(),
  quantity: text("quantity"),
  price: integer("price").notNull(),
  stock: text("stock").notNull(),
  description: text("description").notNull(),
  additionalInfo: text("additional_info"),
  tags: text("tags").array().notNull(),
  isOnSale: boolean("on_sale").notNull(),
  salePercentage: integer("sale_percentage").notNull(),
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  }),
  customerId: uuid("customer_id").notNull(),
  items: jsonb("items").default(null),
  totalPrice: integer("total_price").notNull(),
  orderStatus: text("order_status").notNull(),
  billingDetails: jsonb("billing_details").default(null),
});

export const feedbacks = pgTable("feedbacks", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  }),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  feedback: text("feedback").notNull(),
  rating: integer("rating").notNull(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});

export const admins = pgTable("admins", {
  id: text("id").primaryKey().notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
});
