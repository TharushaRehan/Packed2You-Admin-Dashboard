"use server";

import db from "./db";
import { categories, products, admins } from "../../../migrations/schema";
import { Admin, Category, Product } from "./supabase.types";
import { eq } from "drizzle-orm";

export const CREATE_CATEGORY = async (category: Category) => {
  try {
    await db.insert(categories).values(category);

    return { error: null };
  } catch (error) {
    return { error: error };
  }
};

export const GET_CATEGORIES = async () => {
  try {
    const results = await db.select().from(categories);

    return { data: results, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
};

export const UPDATE_CATEGORY = async (
  category: Partial<Category>,
  categoryId: string
) => {
  if (!categoryId) return;
  try {
    await db
      .update(categories)
      .set(category)
      .where(eq(categories.id, categoryId));

    return {
      data: null,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
};

export const DELETE_CATEGORY = async (categoryId: string) => {
  if (!categoryId) return;
  await db.delete(categories).where(eq(categories.id, categoryId));
};

export const CREATE_PRODUCT = async (product: Product) => {
  try {
    await db.insert(products).values(product);

    return { error: null };
  } catch (error) {
    return { error: error };
  }
};

export const GET_PRODUCTS = async () => {
  try {
    const results = await db.select().from(products);

    return { data: results, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
};

export const UPDATE_PRODUCT = async (
  product: Partial<Product>,
  productId: string
) => {
  if (!productId) return;
  try {
    await db.update(products).set(product).where(eq(products.id, productId));

    return {
      data: null,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
};

export const DELETE_PRODUCT = async (productId: string) => {
  if (!productId) return;
  await db.delete(products).where(eq(products.id, productId));
};

export const ADD_NEW_ADMIN = async (admin: Admin) => {
  if (!admin) return;
  await db.insert(admins).values(admin);
};

export const CHECK_ADMIN = async (email: string) => {
  if (!email)
    return {
      data: null,
      error: "Error",
    };
  try {
    const data = await db
      .selectDistinct({ email: admins.email })
      .from(admins)
      .where(eq(admins.email, email));

    console.log(data);
    return {
      data: data,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
};
