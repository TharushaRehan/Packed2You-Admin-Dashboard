"use server";

import db from "./db";
import { categories } from "../../../migrations/schema";
import { Category } from "./supabase.types";
import { eq } from "drizzle-orm";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

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
