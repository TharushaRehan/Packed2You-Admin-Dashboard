import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  }),
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
  quantity: text("quantiy"),
  price: text("price").notNull(),
  stock: integer("stock").notNull(),
  description: text("description"),
  additionalInfo: text("additional_info"),
  customerFeedback: text("feedbacks").array(),
  rating: integer("rating").notNull(),
  tags: text("tags").array().notNull(),
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
});
