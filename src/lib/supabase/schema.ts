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
  billingDetails: json("billing_details").default({
    properties: {
      firstName: text("first_name"),
      lastName: text("last_name"),
      companyName: text("company_name"),
      streetAddress: text("street_address"),
      country: text("country"),
      states: text("states"),
      zipcode: integer("zip_code"),
      email: text("email"),
      phone: text("phone"),
    },
  }),
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
  isOnSale: boolean("on_sale"),
  salePercentage: integer("sale_percentage"),
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
