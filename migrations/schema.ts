import {
  pgTable,
  pgEnum,
  uuid,
  timestamp,
  text,
  integer,
  boolean,
  jsonb,
  json,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const keyStatus = pgEnum("key_status", [
  "expired",
  "invalid",
  "valid",
  "default",
]);
export const keyType = pgEnum("key_type", [
  "stream_xchacha20",
  "secretstream",
  "secretbox",
  "kdf",
  "generichash",
  "shorthash",
  "auth",
  "hmacsha256",
  "hmacsha512",
  "aead-det",
  "aead-ietf",
]);
export const factorStatus = pgEnum("factor_status", ["verified", "unverified"]);
export const factorType = pgEnum("factor_type", ["webauthn", "totp"]);
export const aalLevel = pgEnum("aal_level", ["aal3", "aal2", "aal1"]);
export const codeChallengeMethod = pgEnum("code_challenge_method", [
  "plain",
  "s256",
]);

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }),
  productName: text("product_name").notNull(),
  categoryName: text("category_name").notNull(),
  image: text("image").notNull(),
  quantiy: text("quantiy"),
  price: text("price").notNull(),
  stock: integer("stock").notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
  additionalInfo: text("additional_info"),
  feedbacks: text("feedbacks").array(),
  rating: integer("rating").notNull(),
  tags: text("tags").array().notNull(),
  onSale: boolean("on_sale"),
  salePercentage: integer("sale_percentage"),
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }),
  customerId: uuid("customer_id").notNull(),
  items: jsonb("items").default(null),
  totalPrice: integer("total_price").notNull(),
  orderStatus: text("order_status").notNull(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone").notNull(),
  billingDetails: json("billing_details").default({
    properties: {
      firstName: {
        config: {
          name: "first_name",
          notNull: false,
          hasDefault: false,
          primaryKey: false,
          isUnique: false,
          dataType: "string",
          columnType: "PgText",
        },
        foreignKeyConfigs: [],
      },
      lastName: {
        config: {
          name: "last_name",
          notNull: false,
          hasDefault: false,
          primaryKey: false,
          isUnique: false,
          dataType: "string",
          columnType: "PgText",
        },
        foreignKeyConfigs: [],
      },
      companyName: {
        config: {
          name: "company_name",
          notNull: false,
          hasDefault: false,
          primaryKey: false,
          isUnique: false,
          dataType: "string",
          columnType: "PgText",
        },
        foreignKeyConfigs: [],
      },
      streetAddress: {
        config: {
          name: "street_address",
          notNull: false,
          hasDefault: false,
          primaryKey: false,
          isUnique: false,
          dataType: "string",
          columnType: "PgText",
        },
        foreignKeyConfigs: [],
      },
      country: {
        config: {
          name: "country",
          notNull: false,
          hasDefault: false,
          primaryKey: false,
          isUnique: false,
          dataType: "string",
          columnType: "PgText",
        },
        foreignKeyConfigs: [],
      },
      states: {
        config: {
          name: "states",
          notNull: false,
          hasDefault: false,
          primaryKey: false,
          isUnique: false,
          dataType: "string",
          columnType: "PgText",
        },
        foreignKeyConfigs: [],
      },
      zipcode: {
        config: {
          name: "zip_code",
          notNull: false,
          hasDefault: false,
          primaryKey: false,
          isUnique: false,
          dataType: "number",
          columnType: "PgInteger",
        },
        foreignKeyConfigs: [],
      },
      email: {
        config: {
          name: "email",
          notNull: false,
          hasDefault: false,
          primaryKey: false,
          isUnique: false,
          dataType: "string",
          columnType: "PgText",
        },
        foreignKeyConfigs: [],
      },
      phone: {
        config: {
          name: "phone",
          notNull: false,
          hasDefault: false,
          primaryKey: false,
          isUnique: false,
          dataType: "string",
          columnType: "PgText",
        },
        foreignKeyConfigs: [],
      },
    },
  }),
});

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }),
  categoryName: text("category_name").notNull(),
  iconId: text("icon_id").notNull(),
  noOfProducts: integer("no_of_products").notNull(),
});
